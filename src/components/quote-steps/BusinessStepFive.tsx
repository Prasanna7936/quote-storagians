import { QuoteFormData, BusinessSpaceSize } from '@/types/quote';
import { Card, CardContent } from '@/components/ui/card';
import { Square, Building, Warehouse, Factory } from 'lucide-react';

interface BusinessStepFiveProps {
  formData: QuoteFormData;
  updateFormData: (updates: Partial<QuoteFormData>) => void;
}

export const BusinessStepFive = ({ formData, updateFormData }: BusinessStepFiveProps) => {
  const spaceOptions: { 
    value: BusinessSpaceSize; 
    label: string; 
    size: string;
    description: string; 
    icon: typeof Square 
  }[] = [
    {
      value: 'compact',
      label: 'Compact',
      size: '25 – 100 Sq. Ft.',
      description: 'For small inventory, documents, or office supplies',
      icon: Square
    },
    {
      value: 'standard',
      label: 'Standard',
      size: '100 – 500 Sq. Ft.',
      description: 'Suitable for retail stock, tools, or equipment',
      icon: Building
    },
    {
      value: 'large',
      label: 'Large',
      size: '500 – 1000 Sq. Ft.',
      description: 'Ideal for bulk inventory or seasonal goods',
      icon: Warehouse
    },
    {
      value: 'custom',
      label: 'Custom',
      size: '1000+ Sq. Ft.',
      description: 'For warehouse overflow, pallet storage, or large-scale business assets',
      icon: Factory
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <p className="text-muted-foreground text-sm">
          Select the space that best fits your business needs
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {spaceOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = formData.businessSpaceSize === option.value;
          
          return (
            <Card 
              key={option.value}
              className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                isSelected 
                  ? 'ring-2 ring-primary bg-primary/5 shadow-medium' 
                  : 'hover:shadow-soft'
              }`}
              onClick={() => updateFormData({ businessSpaceSize: option.value })}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm">{option.label}</h3>
                      {isSelected && (
                        <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-medium text-primary mb-1">({option.size})</p>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};