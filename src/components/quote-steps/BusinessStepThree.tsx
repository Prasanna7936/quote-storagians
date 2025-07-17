import { QuoteFormData, BusinessGoodsType } from '@/types/quote';
import { Card, CardContent } from '@/components/ui/card';
import { Package, RotateCcw } from 'lucide-react';

interface BusinessStepThreeProps {
  formData: QuoteFormData;
  updateFormData: (updates: Partial<QuoteFormData>) => void;
}

export const BusinessStepThree = ({ formData, updateFormData }: BusinessStepThreeProps) => {
  const goodsOptions: { value: BusinessGoodsType; label: string; description: string; icon: typeof Package }[] = [
    {
      value: 'new',
      label: 'New/Fresh Packed Goods',
      description: 'Brand new or recently packed items',
      icon: Package
    },
    {
      value: 'used',
      label: 'Old/Used/Unused/Second Hand Goods',
      description: 'Previously used or second-hand items',
      icon: RotateCcw
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <p className="text-muted-foreground text-sm">
          What type of goods would you like to store with us?
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {goodsOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = formData.businessGoodsType === option.value;
          
          return (
            <Card 
              key={option.value}
              className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                isSelected 
                  ? 'ring-2 ring-primary bg-primary/5 shadow-medium' 
                  : 'hover:shadow-soft'
              }`}
              onClick={() => updateFormData({ businessGoodsType: option.value })}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">{option.label}</h3>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};