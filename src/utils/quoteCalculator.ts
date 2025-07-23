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
  extraLarge: 165, // cft per item
  large: 95,
  medium: 45,
  small: 20
};

const VEHICLE_OPTIONS = [
  { minVolume: 0, maxVolume: 500, name: 'Tata Ace', cost: 1200 },
  { minVolume: 501, maxVolume: 900, name: 'Bolero Pickup', cost: 1800 },
  { minVolume: 901, maxVolume: 1400, name: 'Eicher 14ft', cost: 2800 },
  { minVolume: 1401, maxVolume: Infinity, name: 'Eicher 17ft', cost: 3600 }
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
  '<1month': 1.5,
  '1-3months': 1.0,
  '3-6months': 0.9,
  '>6months': 0.8
};

const STORAGE_TYPE_MULTIPLIERS = {
  household: 1.0,
  business: 1.2,
  document: 0.8
};

export const calculateQuote = (formData: QuoteFormData): QuoteResult => {
  if (formData.storageType === 'household') {
    return calculateHouseholdQuote(formData);
  }
  
  // Original calculation for business/document storage
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
    case '<1month':
      totalCost = monthlyRate;
      break;
    case '1-3months':
      totalCost = monthlyRate * 2.5;
      break;
    case '3-6months':
      totalCost = monthlyRate * 4.5;
      break;
    case '>6months':
      totalCost = monthlyRate * 8;
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
  
  // 3. Volume Calculation (only for furniture/appliances)
  const totalVolume = Math.round(
    (extraLarge * VOLUME_RATES.extraLarge) +
    (large * VOLUME_RATES.large) +
    (medium * VOLUME_RATES.medium) +
    (small * VOLUME_RATES.small)
  );
  
  // 4. Vehicle Selection
  const vehicle = VEHICLE_OPTIONS.find(v => totalVolume >= v.minVolume && totalVolume <= v.maxVolume)!;
  
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
  
  // 6. Pickup Charges
  const pickupCharges = packingMaterialCharges + labourCost + vehicle.cost;
  
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
    vehicleCost: vehicle.cost,
    labourCount,
    labourCost,
    pickupCharges
  };
};