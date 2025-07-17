import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Archive, Layers, Info } from 'lucide-react';
import { QuoteFormData, DocumentStorageType } from '@/types/quote';

interface DocumentStepFourProps {
  formData: QuoteFormData;
  updateFormData: (updates: Partial<QuoteFormData>) => void;
}

export const DocumentStepFour = ({ formData, updateFormData }: DocumentStepFourProps) => {
  const storageOptions = [
    {
      value: 'rack' as DocumentStorageType,
      label: 'Rack Storage',
      description: 'Ideal for frequent access to individual boxes',
      icon: Archive,
    },
    {
      value: 'pallet' as DocumentStorageType,
      label: 'Pallet Storage',
      description: 'Suitable for one-time or rare access to boxes',
      icon: Layers,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-foreground mb-2">Storage Type</h3>
        <p className="text-muted-foreground">
          Choose the storage type based on how often you'll need to access your documents
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {storageOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = formData.documentStorageType === option.value;
          
          return (
            <TooltipProvider key={option.value}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-medium ${
                      isSelected 
                        ? 'ring-2 ring-primary bg-primary/5 border-primary' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => updateFormData({ documentStorageType: option.value })}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <h4 className="font-medium text-foreground mb-2 flex items-center justify-center gap-2">
                        {option.label}
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{option.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
};