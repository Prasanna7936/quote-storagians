import { QuoteFormData, BusinessGoodsCategory } from '@/types/quote';
import { Card, CardContent } from '@/components/ui/card';
import { Smartphone, Package, Armchair, ChefHat, MoreHorizontal } from 'lucide-react';

interface BusinessStepFourProps {
  formData: QuoteFormData;
  updateFormData: (updates: Partial<QuoteFormData>) => void;
}

export const BusinessStepFour = ({ formData, updateFormData }: BusinessStepFourProps) => {
  const categoryOptions: { value: BusinessGoodsCategory; label: string; icon: typeof Smartphone }[] = [
    {
      value: 'electronics',
      label: 'Electronics Goods',
      icon: Smartphone
    },
    {
      value: 'fmcg',
      label: 'FMCG Goods',
      icon: Package
    },
    {
      value: 'office-furniture',
      label: 'Office Furnitures',
      icon: Armchair
    },
    {
      value: 'kitchen-hotel',
      label: 'Kitchen/Hotel/Restaurant Items',
      icon: ChefHat
    },
    {
      value: 'others',
      label: 'Others',
      icon: MoreHorizontal
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <p className="text-muted-foreground text-sm">
          What kind of goods would you like to store with us?
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categoryOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = formData.businessGoodsCategory === option.value;
          
          return (
            <Card 
              key={option.value}
              className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                isSelected 
                  ? 'ring-2 ring-primary bg-primary/5 shadow-medium' 
                  : 'hover:shadow-soft'
              }`}
              onClick={() => updateFormData({ businessGoodsCategory: option.value })}
            >
              <CardContent className="p-4 text-center">
                <div className={`w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center ${
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-sm">{option.label}</h3>
                
                {isSelected && (
                  <div className="mt-2">
                    <div className="w-4 h-4 mx-auto bg-primary rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};