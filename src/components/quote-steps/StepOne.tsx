import { QuoteFormData, StorageType } from '@/types/quote';
import { Card, CardContent } from '@/components/ui/card';
import { Home, FileText, Phone } from 'lucide-react';

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
      value: 'document',
      label: 'Document Storage',
      description: 'Files, records, and important documents',
      icon: FileText
    }
  ];

  const callbackOption = {
    value: 'callback' as StorageType,
    label: 'Request Call Back',
    description: 'Our team will contact you shortly',
    icon: Phone
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-muted-foreground">
          Select the type of storage you need or request a callback
        </p>
      </div>

      {/* Storage Types Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center">Storage Solutions</h3>
        <p className="text-sm text-muted-foreground text-center">Complete 8-step process for instant quote</p>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto">
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
                <CardContent className="p-6 text-center">
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{option.label}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                  
                  {isSelected && (
                    <div className="mt-4">
                      <div className="w-6 h-6 mx-auto bg-primary rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
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

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or</span>
        </div>
      </div>

      {/* Callback Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center">Need Help?</h3>
        <p className="text-sm text-muted-foreground text-center">Quick 2-step process to get expert assistance</p>
        <div className="max-w-sm mx-auto">
          <Card 
            className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
              formData.storageType === callbackOption.value
                ? 'ring-2 ring-primary bg-primary/5 shadow-medium' 
                : 'hover:shadow-soft'
            }`}
            onClick={() => updateFormData({ storageType: callbackOption.value })}
          >
            <CardContent className="p-6 text-center">
              <div className={`w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center ${
                formData.storageType === callbackOption.value ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                <callbackOption.icon className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{callbackOption.label}</h3>
              <p className="text-sm text-muted-foreground mb-3">{callbackOption.description}</p>
              
              {formData.storageType === callbackOption.value && (
                <div className="mt-4">
                  <div className="w-6 h-6 mx-auto bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};