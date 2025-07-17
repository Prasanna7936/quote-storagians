import { QuoteFormData, StorageType } from '@/types/quote';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Building2, FileText, Phone } from 'lucide-react';

interface StepOneProps {
  formData: QuoteFormData;
  updateFormData: (updates: Partial<QuoteFormData>) => void;
}

export const StepOne = ({ formData, updateFormData }: StepOneProps) => {
  const storageOptions: { value: StorageType; label: string; description: string; icon: typeof Home }[] = [
    {
      value: 'household',
      label: 'Household Storage',
      description: 'Furniture, appliances, and personal belongings',
      icon: Home
    },
    {
      value: 'business',
      label: 'Business Storage',
      description: 'Office equipment, inventory, and business assets',
      icon: Building2
    },
    {
      value: 'document',
      label: 'Document Storage',
      description: 'Files, records, and important documents',
      icon: FileText
    },
    {
      value: 'callback',
      label: 'Request Call Back',
      description: 'Our team will contact you shortly',
      icon: Phone
    }
  ];

  return (
    <div className="space-y-3">
      <div className="text-center mb-4">
        <p className="text-muted-foreground text-sm">
          Select the type of storage you need
        </p>
      </div>

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {storageOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = formData.storageType === option.value;
          
          return (
            <Card 
              key={option.value}
              className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                isSelected 
                  ? 'ring-2 ring-primary bg-primary/5 shadow-medium' 
                  : 'hover:shadow-soft'
              }`}
              onClick={() => updateFormData({ storageType: option.value })}
            >
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-base mb-1">{option.label}</h3>
                <p className="text-xs text-muted-foreground">{option.description}</p>
                
                {isSelected && (
                  <div className="mt-3">
                    <div className="w-5 h-5 mx-auto bg-primary rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
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