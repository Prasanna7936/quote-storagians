import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Package, PackageCheck, Info } from 'lucide-react';
import { QuoteFormData, DocumentBoxRequirement } from '@/types/quote';

interface DocumentStepThreeProps {
  formData: QuoteFormData;
  updateFormData: (updates: Partial<QuoteFormData>) => void;
}

export const DocumentStepThree = ({ formData, updateFormData }: DocumentStepThreeProps) => {
  const boxOptions = [
    {
      value: 'need-fresh' as DocumentBoxRequirement,
      label: 'Need Fresh Boxes',
      description: 'Require new boxes (1.5 x 1.5 x 2 ft) to pack documents',
      icon: Package,
    },
    {
      value: 'ready-to-ship' as DocumentBoxRequirement,
      label: 'Boxes Ready to Ship',
      description: 'Documents are already packed and ready for storage',
      icon: PackageCheck,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-muted-foreground">
          Do you need new boxes or are your documents already packed?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {boxOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = formData.documentBoxRequirement === option.value;
          
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
                    onClick={() => updateFormData({ documentBoxRequirement: option.value })}
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