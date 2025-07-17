import { Card, CardContent } from '@/components/ui/card';
import { Package } from 'lucide-react';
import { QuoteFormData, DocumentBoxCount } from '@/types/quote';

interface DocumentStepFiveProps {
  formData: QuoteFormData;
  updateFormData: (updates: Partial<QuoteFormData>) => void;
}

export const DocumentStepFive = ({ formData, updateFormData }: DocumentStepFiveProps) => {
  const boxCountOptions = [
    {
      value: '10-25' as DocumentBoxCount,
      label: '10 – 25 Boxes',
      description: 'Small to medium document storage',
    },
    {
      value: '25-50' as DocumentBoxCount,
      label: '25 – 50 Boxes',
      description: 'Medium document storage',
    },
    {
      value: '50-100' as DocumentBoxCount,
      label: '50 – 100 Boxes',
      description: 'Large document storage',
    },
    {
      value: '100+' as DocumentBoxCount,
      label: '100+ Boxes',
      description: 'Extra large document storage',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-foreground mb-2">Number of Boxes</h3>
        <p className="text-muted-foreground">
          How many boxes do you need to store?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {boxCountOptions.map((option) => {
          const isSelected = formData.documentBoxCount === option.value;
          
          return (
            <Card 
              key={option.value}
              className={`cursor-pointer transition-all duration-200 hover:shadow-medium ${
                isSelected 
                  ? 'ring-2 ring-primary bg-primary/5 border-primary' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => updateFormData({ documentBoxCount: option.value })}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  <Package className="w-8 h-8" />
                </div>
                <h4 className="font-medium text-foreground mb-2">
                  {option.label}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};