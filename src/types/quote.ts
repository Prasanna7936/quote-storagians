export type StorageType = 'household' | 'business' | 'document' | 'callback';

export type DurationType = '<1month' | '1-3months' | '3-6months' | '>6months';

export interface FurnitureItems {
  extraLarge: number; // L Shape Sofa, Almirah/Cupboard 3Door, King Size cot, Dining Table 8 Seater
  large: number; // Sofa 3 Seater, Queen cot, Dining Table 6 Seater, Almirah/Cupboard 2 Door
  medium: number; // Sofa 1 & 2 Seater, Single cot, Dining Table 4 Seater, Study/Computer Table, Mattresses
  small: number; // Foldable Cot, Dining Chair, Side/Centre Table, Office Chair, Plastic Chairs (4 stackable)
}

export interface ApplianceItems {
  extraLarge: number; // Fridge 3+ Door, TV 80+ inch, Washing Machine 10+ ltrs
  large: number; // Fridge 2 Door, TV above 65+ inch, Washing Machine 5+ Ltrs
  medium: number; // Fridge Single Door, TV up to 60 inch, AC
  small: number; // Mini Fridge, Gas Stove, Microwave Oven, Mixer/Grinder
}

export interface BoxItems {
  luggage: number; // Suitcases, Travel Bags
  kitchen: number; // Kitchen Utensils/Crockery
  clothes: number; // Cloths, Pillows, Bedsheets
  books: number; // Books, Documents, Gift Articles
  personal: number; // Shoes/Slippers/Sanitary Items
}

export type DeliveryMethod = 'pickup' | 'third-party' | 'self-drop';

export type BusinessGoodsType = 'new' | 'used';
export type BusinessGoodsCategory = 'electronics' | 'fmcg' | 'office-furniture' | 'kitchen-hotel' | 'others';
export type BusinessSpaceSize = 'compact' | 'standard' | 'large' | 'custom';

export type DocumentBoxRequirement = 'need-fresh' | 'ready-to-ship';
export type DocumentStorageType = 'rack' | 'pallet';
export type DocumentBoxCount = '10-25' | '25-50' | '50-100' | '100+';

export interface QuoteFormData {
  storageType: StorageType;
  duration: DurationType;
  furniture: FurnitureItems;
  appliances: ApplianceItems;
  boxes: BoxItems;
  deliveryMethod: DeliveryMethod;
  pickupLocation: string;
  pickupDate: Date | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  
  // Business storage specific fields
  businessGoodsType?: BusinessGoodsType;
  businessGoodsCategory?: BusinessGoodsCategory;
  businessSpaceSize?: BusinessSpaceSize;
  documentBoxRequirement?: DocumentBoxRequirement;
  documentStorageType?: DocumentStorageType;
  documentBoxCount?: DocumentBoxCount;
}

export interface QuoteResult {
  totalItems: number;
  estimatedVolume: number; // in cubic feet
  monthlyRate: number;
  totalCost: number;
  breakdown: {
    furniture: number;
    appliances: number;
    boxes: number;
    baseRate: number;
    durationMultiplier: number;
  };
}