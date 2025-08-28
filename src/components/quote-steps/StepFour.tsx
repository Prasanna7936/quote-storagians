import { QuoteFormData } from '@/types/quote';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Minus, Plus, Zap } from 'lucide-react';

interface StepFourProps {
  formData: QuoteFormData;
  updateFormData: (updates: Partial<QuoteFormData>) => void;
}

export const StepFour = ({ formData, updateFormData }: StepFourProps) => {
  const applianceCategories = [
    {
      key: 'extraLarge' as const,
      title: 'Extra Large Appliances',
      description: 'Fridge 3+ Door / Side-by-Side Refrigerator, TV 65+ inch',
      examples: ['3+ Door Fridge', 'Side-by-Side Refrigerator', '65"+ TV']
    },
    {
      key: 'large' as const,
      title: 'Large Appliances',
      description: 'Fridge 2 Door, TV 55+ inch, Washing Machine, Dishwasher, AC (Split unit)',
      examples: ['2-Door Fridge', '55"+ TV', 'Washing Machine', 'Dishwasher', 'Split AC']
    },
    {
      key: 'medium' as const,
      title: 'Medium Appliances',
      description: 'Fridge Single Door, TV 32+ inch, Cooler, AC Unit',
      examples: ['Single Door Fridge', '32"+ TV', 'Cooler', 'AC Unit']
    },
    {
      key: 'small' as const,
      title: 'Small Appliances',
      description: 'Gas Stove, Microwave Oven/OTG, Mixer/Grinder, Water Purifier, Vacuum Cleaner',
      examples: ['Gas Stove', 'Microwave/OTG', 'Mixer/Grinder', 'Water Purifier', 'Vacuum Cleaner']
    }
  ];

  const updateQuantity = (category: keyof typeof formData.appliances, change: number) => {
    const newValue = Math.max(0, formData.appliances[category] + change);
    updateFormData({
      appliances: {
        ...formData.appliances,
        [category]: newValue
      }
    });
  };

  return (
    <div className="space-y-3">
      <div className="text-center mb-4">
        <Zap className="w-10 h-10 mx-auto mb-3 text-primary" />
        <p className="text-muted-foreground text-sm">
          How many appliances do you need to store?
        </p>
      </div>

      <TooltipProvider>
        <div className="grid gap-3">
          {applianceCategories.map((category) => (
            <Card key={category.key} className="shadow-soft">
              <CardHeader className="pb-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CardTitle className="text-base cursor-help">{category.title}</CardTitle>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-sm">
                      <p className="font-medium mb-1">Examples:</p>
                      <ul className="space-y-1">
                        {category.examples.map((example) => (
                          <li key={example}>• {example}</li>
                        ))}
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(category.key, -1)}
                      disabled={formData.appliances[category.key] === 0}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center font-semibold">
                      {formData.appliances[category.key]}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(category.key, 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
};