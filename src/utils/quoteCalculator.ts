import { QuoteFormData, QuoteResult } from '@/types/quote';

// Pricing constants (per cubic foot per month)
const FURNITURE_RATES = {
  extraLarge: 8, // cubic feet per item
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
  books: 2,
  personal: 1
};

const BASE_RATE_PER_CUBIC_FOOT = 2.5; // ₹2.5 per cubic foot per month

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
  // Calculate furniture volume
  const furnitureVolume = 
    formData.furniture.extraLarge * FURNITURE_RATES.extraLarge +
    formData.furniture.large * FURNITURE_RATES.large +
    formData.furniture.medium * FURNITURE_RATES.medium +
    formData.furniture.small * FURNITURE_RATES.small;

  // Calculate appliances volume
  const appliancesVolume = 
    formData.appliances.extraLarge * APPLIANCE_RATES.extraLarge +
    formData.appliances.large * APPLIANCE_RATES.large +
    formData.appliances.medium * APPLIANCE_RATES.medium +
    formData.appliances.small * APPLIANCE_RATES.small;

  // Calculate boxes volume
  const boxesVolume = 
    formData.boxes.luggage * BOX_RATES.luggage +
    formData.boxes.kitchen * BOX_RATES.kitchen +
    formData.boxes.clothes * BOX_RATES.clothes +
    formData.boxes.books * BOX_RATES.books +
    formData.boxes.personal * BOX_RATES.personal;

  const totalVolume = furnitureVolume + appliancesVolume + boxesVolume;
  
  // Calculate total items
  const furnitureItems = Object.values(formData.furniture).reduce((a, b) => a + b, 0);
  const applianceItems = Object.values(formData.appliances).reduce((a, b) => a + b, 0);
  const boxItems = Object.values(formData.boxes).reduce((a, b) => a + b, 0);
  const totalItems = furnitureItems + applianceItems + boxItems;

  // Calculate base rate
  const baseRate = totalVolume * BASE_RATE_PER_CUBIC_FOOT;
  
  // Apply multipliers
  const durationMultiplier = DURATION_MULTIPLIERS[formData.duration];
  const storageTypeMultiplier = STORAGE_TYPE_MULTIPLIERS[formData.storageType];
  
  const monthlyRate = baseRate * durationMultiplier * storageTypeMultiplier;
  
  // Calculate total cost based on duration
  let totalCost = monthlyRate;
  switch (formData.duration) {
    case '<1month':
      totalCost = monthlyRate;
      break;
    case '1-3months':
      totalCost = monthlyRate * 2.5; // average 2.5 months
      break;
    case '3-6months':
      totalCost = monthlyRate * 4.5; // average 4.5 months
      break;
    case '>6months':
      totalCost = monthlyRate * 8; // average 8 months
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