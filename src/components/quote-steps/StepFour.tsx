import { QuoteFormData } from '@/types/quote';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
      description: 'Fridge 3+ Door, TV 80+ inch, Washing Machine 10+ ltrs',
      examples: ['3+ Door Fridge', '80"+ TV', 'Large Washing Machine', 'Industrial Equipment']
    },
    {
      key: 'large' as const,
      title: 'Large Appliances',
      description: 'Fridge 2 Door, TV above 65+ inch, Washing Machine 5+ Ltrs',
      examples: ['2-Door Fridge', '65"+ TV', 'Standard Washing Machine', 'Large AC']
    },
    {
      key: 'medium' as const,
      title: 'Medium Appliances',
      description: 'Fridge Single Door, TV up to 60 inch, AC',
      examples: ['Single Door Fridge', 'Medium TV', 'Split AC', 'Dishwasher']
    },
    {
      key: 'small' as const,
      title: 'Small Appliances',
      description: 'Mini Fridge, Gas Stove, Microwave Oven, Mixer/Grinder',
      examples: ['Mini Fridge', 'Microwave', 'Gas Stove', 'Mixer/Grinder']
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

      <div className="grid gap-3">
        {applianceCategories.map((category) => (
          <Card key={category.key} className="shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{category.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-3">
                  <div className="flex flex-wrap gap-1">
                    {category.examples.map((example) => (
                      <span key={example} className="text-xs bg-muted px-2 py-1 rounded">
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
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
    </div>
  );
};