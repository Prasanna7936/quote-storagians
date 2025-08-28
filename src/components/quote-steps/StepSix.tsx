import { DeliveryMethod, QuoteFormData } from '@/types/quote';
import { Card, CardContent } from '@/components/ui/card';
import { Truck, Package, User } from 'lucide-react';

interface StepSixProps {
  formData: QuoteFormData;
  updateFormData: (updates: Partial<QuoteFormData>) => void;
}

export const StepSix = ({ formData, updateFormData }: StepSixProps) => {
  const deliveryOptions: { 
    value: DeliveryMethod; 
    label: string; 
    description: string; 
    icon: typeof Truck;
    details: string;
  }[] = [
    {
      value: 'pickup',
      label: 'Pickup by Us',
      description: 'Our team will pick-up the goods from your location',
      details: 'Complete door-to-door service with professional packing',
      icon: Truck
    },
    {
      value: 'third-party',
      label: 'Drop by You',
      description: 'Make your own shifting arrangements (own vehicle or 3rd party logistics)',
      details: 'Our team will assist with packing (if needed) and take care of inventory',
      icon: Package
    }
  ];

  return (
    <div className="space-y-3">
      <div className="text-center mb-4">
        <p className="text-muted-foreground text-sm">
          How would you like to move the goods to storage?
        </p>
      </div>

      <div className="grid gap-3 grid-cols-1">
        {deliveryOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = formData.deliveryMethod === option.value;
          
          return (
            <Card 
              key={option.value}
              className={`cursor-pointer transition-all duration-200 hover:scale-[1.01] ${
                isSelected 
                  ? 'ring-2 ring-primary bg-primary/5 shadow-medium' 
                  : 'hover:shadow-soft'
              }`}
              onClick={() => updateFormData({ deliveryMethod: option.value })}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-base">{option.label}</h3>
                      {isSelected && (
                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                    <p className="text-xs text-muted-foreground mt-1 italic">{option.details}</p>
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