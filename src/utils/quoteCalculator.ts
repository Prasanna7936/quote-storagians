import { QuoteFormData, QuoteResult } from '@/types/quote';

// New household calculation rates
const RENTAL_RATES = {
  extraLarge: 348,
  large: 222,
  medium: 136,
  small: 46,
  luggage: 50,
  boxes: 65
};

const PACKING_MATERIAL_RATES = {
  extraLarge: 452,
  large: 288,
  medium: 177,
  small: 60,
  luggage: 50,
  boxes: 85
};

const VOLUME_RATES = {
  extraLarge: 60, // cft per item
  large: 30,
  medium: 15,
  small: 5,
  luggage: 7,
  boxes: 5
};

const VEHICLE_OPTIONS = [
  { minVolume: 0, maxVolume: 250, name: 'Tata Ace (250 CFT)', baseFare: 400, ratePerKm: 30 },
  { minVolume: 251, maxVolume: 400, name: 'Bolero Pickup (400 CFT)', baseFare: 550, ratePerKm: 35 },
  { minVolume: 401, maxVolume: 800, name: 'Eicher Canter 14 ft (800 CFT)', baseFare: 1250, ratePerKm: 40 },
  { minVolume: 801, maxVolume: 1000, name: 'Eicher Canter 17 ft (1000 CFT)', baseFare: 3200, ratePerKm: 45 },
  { minVolume: 1001, maxVolume: Infinity, name: 'Eicher Canter 19 ft (1200 CFT)', baseFare: 4500, ratePerKm: 50 }
];

const LABOUR_COST_PER_PERSON = 800;

// Old constants for backward compatibility with business/document storage
const FURNITURE_RATES = {
  extraLarge: 8,
  large: 5,
  medium: 3,
  small: 1
};

const APPLIANCE_RATES = {
  extraLarge: 12,
  large: 8,
  medium: 5,
  small: 2
};

const BOX_RATES = {
  luggage: 3,
  kitchen: 2,
  clothes: 2,
  booksPersonal: 2
};

const BASE_RATE_PER_CUBIC_FOOT = 2.5;

const DURATION_MULTIPLIERS = {
  '1-3months': 1.0,
  '3-6months': 0.9,
  '6-12months': 0.8,
  '>12months': 0.7
};

const STORAGE_TYPE_MULTIPLIERS = {
  household: 1.0,
  document: 0.8
};


// Document storage rate matrix (₹ per box per month)
const DOCUMENT_RATE_MATRIX = {
  'rack': {
    '1-3M': { '10-25': 125, '26-50': 120, '51-100': 110, '101+': 100 },
    '3-6M': { '10-25': 120, '26-50': 110, '51-100': 100, '101+': 90 },
    '6-12M': { '10-25': 110, '26-50': 100, '51-100': 90, '101+': 85 },
    '>12M': { '10-25': 100, '26-50': 90, '51-100': 85, '101+': 80 }
  },
  'pallet': {
    '1-3M': { '10-25': 100, '26-50': 90, '51-100': 80, '101+': 70 },
    '3-6M': { '10-25': 90, '26-50': 80, '51-100': 70, '101+': 60 },
    '6-12M': { '10-25': 80, '26-50': 70, '51-100': 60, '101+': 55 },
    '>12M': { '10-25': 70, '26-50': 60, '51-100': 55, '101+': 50 }
  }
};

// Slab-based fresh box charges based on box count range
const getBoxChargeRate = (boxCountRange: string): number => {
  switch (boxCountRange) {
    case '10-25':
      return 100;
    case '26-50':
      return 90;
    case '51-100':
      return 85;
    case '100+':
      return 75;
    default:
      return 100;
  }
};

export const calculateQuote = (formData: QuoteFormData): QuoteResult => {
  // Log calculation inputs for debugging
  console.log('Calculating quote for:', {
    storageType: formData.storageType,
    duration: formData.duration,
    documentStorageType: formData.documentStorageType,
    documentBoxCount: formData.documentBoxCount,
    documentBoxRequirement: formData.documentBoxRequirement
  });

  if (formData.storageType === 'household') {
    return calculateHouseholdQuote(formData);
  }
  
  if (formData.storageType === 'document') {
    return calculateDocumentQuote(formData);
  }
  
  // Fallback to old calculation for other types
  const furnitureVolume = 
    formData.furniture.extraLarge * FURNITURE_RATES.extraLarge +
    formData.furniture.large * FURNITURE_RATES.large +
    formData.furniture.medium * FURNITURE_RATES.medium +
    formData.furniture.small * FURNITURE_RATES.small;

  const appliancesVolume = 
    formData.appliances.extraLarge * APPLIANCE_RATES.extraLarge +
    formData.appliances.large * APPLIANCE_RATES.large +
    formData.appliances.medium * APPLIANCE_RATES.medium +
    formData.appliances.small * APPLIANCE_RATES.small;

  const boxesVolume = 
    formData.boxes.luggage * BOX_RATES.luggage +
    formData.boxes.kitchen * BOX_RATES.kitchen +
    formData.boxes.clothes * BOX_RATES.clothes +
    formData.boxes.booksPersonal * BOX_RATES.booksPersonal;

  const totalVolume = furnitureVolume + appliancesVolume + boxesVolume;
  
  const furnitureItems = Object.values(formData.furniture).reduce((a, b) => a + b, 0);
  const applianceItems = Object.values(formData.appliances).reduce((a, b) => a + b, 0);
  const boxItems = Object.values(formData.boxes).reduce((a, b) => a + b, 0);
  const totalItems = furnitureItems + applianceItems + boxItems;

  const baseRate = totalVolume * BASE_RATE_PER_CUBIC_FOOT;
  const durationMultiplier = DURATION_MULTIPLIERS[formData.duration];
  const storageTypeMultiplier = STORAGE_TYPE_MULTIPLIERS[formData.storageType];
  const monthlyRate = baseRate * durationMultiplier * storageTypeMultiplier;
  
  let totalCost = monthlyRate;
  switch (formData.duration) {
    case '1-3months':
      totalCost = monthlyRate * 2.5;
      break;
    case '3-6months':
      totalCost = monthlyRate * 4.5;
      break;
    case '6-12months':
      totalCost = monthlyRate * 9;
      break;
    case '>12months':
      totalCost = monthlyRate * 15;
      break;
  }

  return {
    totalItems,
    estimatedVolume: Math.round(totalVolume),
    monthlyRate: Math.round(monthlyRate),
    totalCost: Math.round(totalCost),
    breakdown: {
      furniture: Math.round(furnitureVolume * BASE_RATE_PER_CUBIC_FOOT * durationMultiplier * storageTypeMultiplier),
      appliances: Math.round(appliancesVolume * BASE_RATE_PER_CUBIC_FOOT * durationMultiplier * storageTypeMultiplier),
      boxes: Math.round(boxesVolume * BASE_RATE_PER_CUBIC_FOOT * durationMultiplier * storageTypeMultiplier),
      baseRate: Math.round(baseRate),
      durationMultiplier
    }
  };
};

const calculateHouseholdQuote = (formData: QuoteFormData): QuoteResult => {
  const rentalAdjustmentFactor = 1.0;
  const packingMaterialAdjustmentFactor = 1.0;
  
  // Get total items by category
  const extraLarge = formData.furniture.extraLarge + formData.appliances.extraLarge;
  const large = formData.furniture.large + formData.appliances.large;
  const medium = formData.furniture.medium + formData.appliances.medium;
  const small = formData.furniture.small + formData.appliances.small;
  const luggages = formData.boxes.luggage;
  const boxes = formData.boxes.kitchen + formData.boxes.clothes + formData.boxes.booksPersonal;
  
  // 1. Rental Calculation
  const rentalCharges = Math.round(
    ((extraLarge * RENTAL_RATES.extraLarge) +
     (large * RENTAL_RATES.large) +
     (medium * RENTAL_RATES.medium) +
     (small * RENTAL_RATES.small) +
     (luggages * RENTAL_RATES.luggage) +
     (boxes * RENTAL_RATES.boxes)) * rentalAdjustmentFactor
  );
  
  // 2. Packing Material Calculation
  const packingMaterialCharges = Math.round(
    ((extraLarge * PACKING_MATERIAL_RATES.extraLarge) +
     (large * PACKING_MATERIAL_RATES.large) +
     (medium * PACKING_MATERIAL_RATES.medium) +
     (small * PACKING_MATERIAL_RATES.small) +
     (luggages * PACKING_MATERIAL_RATES.luggage) +
     (boxes * PACKING_MATERIAL_RATES.boxes)) * packingMaterialAdjustmentFactor
  );
  
  // 3. Volume Calculation (includes furniture/appliances/luggages/boxes)
  console.log('Volume calculation debug:', {
    extraLarge, large, medium, small, luggages, boxes,
    extraLargeVol: extraLarge * VOLUME_RATES.extraLarge,
    largeVol: large * VOLUME_RATES.large,
    mediumVol: medium * VOLUME_RATES.medium,
    smallVol: small * VOLUME_RATES.small,
    luggageVol: luggages * VOLUME_RATES.luggage,
    boxesVol: boxes * VOLUME_RATES.boxes
  });
  
  const totalVolume = Math.round(
    (extraLarge * VOLUME_RATES.extraLarge) +
    (large * VOLUME_RATES.large) +
    (medium * VOLUME_RATES.medium) +
    (small * VOLUME_RATES.small) +
    (luggages * VOLUME_RATES.luggage) +
    (boxes * VOLUME_RATES.boxes)
  );
  
  // 4. Vehicle Selection
  const vehicle = VEHICLE_OPTIONS.find(v => totalVolume >= v.minVolume && totalVolume <= v.maxVolume) || VEHICLE_OPTIONS[0];
  
  // 5. Labour Estimation
  let labourCount = 2; // Default
  
  // Base rules based on volume
  if (totalVolume <= 900) {
    labourCount = 2;
  } else if (totalVolume >= 901 && totalVolume <= 1400) {
    labourCount = 3;
  } else if (totalVolume > 1400) {
    labourCount = 4;
  }
  
  // Override rules
  if (extraLarge >= 1 && labourCount < 3) {
    labourCount = 3;
  }
  
  const totalItems = extraLarge + large + medium + small + luggages + boxes;
  if (totalItems > 60 && labourCount < 4) {
    labourCount = labourCount + 1;
  }
  const labourCost = labourCount * LABOUR_COST_PER_PERSON;
  
  // 6. Pickup Charges (distance-based calculation with new formula)
  const distance = formData.distanceKm || 0;
  const billedDistance = Math.max(0, distance - 5); // Base 5km included in base fare
  const vehicleCost = vehicle.baseFare + (billedDistance * vehicle.ratePerKm);
  const pickupCharges = packingMaterialCharges + labourCost + vehicleCost;
  
  return {
    totalItems,
    estimatedVolume: totalVolume,
    monthlyRate: rentalCharges,
    totalCost: rentalCharges,
    breakdown: {
      furniture: 0,
      appliances: 0,
      boxes: 0,
      baseRate: rentalCharges,
      durationMultiplier: 1
    },
    // New household fields
    rentalCharges,
    packingMaterialCharges,
    totalVolume,
    recommendedVehicle: vehicle.name,
    vehicleCost,
    labourCount,
    labourCost,
    pickupCharges
  };
};


const calculateDocumentQuote = (formData: QuoteFormData): QuoteResult => {
  // Map form data to lookup table keys
  const storageType = formData.documentStorageType === 'rack' ? 'rack' : 'pallet';
  const boxCountRange = formData.documentBoxCount || '10-25';
  
  // Map duration to lookup table format
  let durationKey: string;
  switch (formData.duration) {
    case '1-3months':
      durationKey = '1-3M';
      break;
    case '3-6months':
      durationKey = '3-6M';
      break;
    case '6-12months':
      durationKey = '6-12M';
      break;
    case '>12months':
      durationKey = '>12M';
      break;
    default:
      durationKey = '1-3M';
  }
  
  // Get box rate from lookup table (handle 100+ -> 101+ mapping)
  const rateKey = boxCountRange === '100+' ? '101+' : boxCountRange;
  const boxRate = DOCUMENT_RATE_MATRIX[storageType]?.[durationKey]?.[rateKey] || 100;
  
  // Log document calculation details for debugging
  console.log('Document storage calculation:', {
    storageType,
    durationKey,
    rateKey,
    boxRate,
    boxCountRange
  });
  
  // Use fixed box counts based on selected range
  let boxCount: number;
  switch (boxCountRange) {
    case '10-25':
      boxCount = 25;
      break;
    case '26-50':
      boxCount = 50;
      break;
    case '51-100':
      boxCount = 100;
      break;
    case '100+':
      boxCount = 500;
      break;
    default:
      boxCount = 25;
  }
  
  // Calculate costs
  const boxRental = boxRate * boxCount;
  const boxChargeRate = getBoxChargeRate(boxCountRange);
  const boxCharges = formData.documentBoxRequirement === 'need-fresh' ? boxChargeRate * boxCount : 0;
  const totalStorageCost = boxRental + boxCharges;
  
  // Format display values
  const durationDisplay = formData.duration === '1-3months' ? '1–3M' : 
                         formData.duration === '3-6months' ? '3–6M' :
                         formData.duration === '6-12months' ? '6–12M' : '>12M';
  
  const storageTypeDisplay = storageType === 'rack' ? 'Rack Storage' : 'Pallet Storage';
  
  return {
    totalItems: boxCount,
    estimatedVolume: boxCount,
    monthlyRate: boxRental,
    totalCost: totalStorageCost,
    breakdown: {
      furniture: 0,
      appliances: 0,
      boxes: 0,
      baseRate: boxRental,
      durationMultiplier: 1
    },
    // Document storage specific fields
    storageType: storageTypeDisplay,
    durationCategory: durationDisplay,
    boxCount,
    boxRate,
    boxRental,
    boxCharges,
    boxChargeRate
  };
};