import { QuoteFormData, DurationType } from '@/types/quote';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';

interface StepTwoProps {
  formData: QuoteFormData;
  updateFormData: (updates: Partial<QuoteFormData>) => void;
}

export const StepTwo = ({ formData, updateFormData }: StepTwoProps) => {
  const durationOptions: { value: DurationType; label: string; description: string; popular?: boolean }[] = [
    {
      value: '<1month',
      label: 'Less than 1 month',
      description: 'Short-term storage'
    },
    {
      value: '1-3months',
      label: '1-3 months',
      description: 'Medium-term storage',
      popular: true
    },
    {
      value: '3-6months',
      label: '3-6 months',
      description: 'Long-term storage'
    },
    {
      value: '>6months',
      label: 'More than 6 months',
      description: 'Extended storage'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="text-center mb-4">
        <Clock className="w-10 h-10 mx-auto mb-3 text-primary" />
        <p className="text-muted-foreground text-sm">
          How long do you plan to store your items?
        </p>
      </div>

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
        {durationOptions.map((option) => {
          const isSelected = formData.duration === option.value;
          
          return (
            <Card 
              key={option.value}
              className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] relative ${
                isSelected 
                  ? 'ring-2 ring-primary bg-primary/5 shadow-medium' 
                  : 'hover:shadow-soft'
              }`}
              onClick={() => updateFormData({ duration: option.value })}
            >
              {option.popular && (
                <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full font-medium">
                  Popular
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
                  }`}>
                    {isSelected && (
                      <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{option.label}</h3>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
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