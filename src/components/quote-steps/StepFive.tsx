import { QuoteFormData } from '@/types/quote';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Minus, Plus, Package } from 'lucide-react';

interface StepFiveProps {
  formData: QuoteFormData;
  updateFormData: (updates: Partial<QuoteFormData>) => void;
}

export const StepFive = ({ formData, updateFormData }: StepFiveProps) => {
  const boxCategories = [
    {
      key: 'luggage' as const,
      title: 'Luggage & Travel Bags',
      description: 'Suitcases, Travel Bags',
      examples: ['Suitcases', 'Travel Bags', 'Duffel Bags', 'Backpacks']
    },
    {
      key: 'kitchen' as const,
      title: 'Kitchen Items',
      description: 'Kitchen Utensils/Crockery',
      examples: ['Utensils', 'Crockery', 'Pots & Pans', 'Kitchen Appliances']
    },
    {
      key: 'clothes' as const,
      title: 'Clothes & Bedding',
      description: 'Cloths, Pillows, Bedsheets',
      examples: ['Clothing', 'Pillows', 'Bedsheets', 'Blankets']
    },
    {
      key: 'books' as const,
      title: 'Books & Documents',
      description: 'Books, Documents, Gift Articles',
      examples: ['Books', 'Documents', 'Papers', 'Gift Items']
    },
    {
      key: 'personal' as const,
      title: 'Personal Items',
      description: 'Shoes/Slippers/Sanitary Items',
      examples: ['Shoes', 'Slippers', 'Toiletries', 'Personal Care']
    }
  ];

  const updateQuantity = (category: keyof typeof formData.boxes, change: number) => {
    const newValue = Math.max(0, formData.boxes[category] + change);
    updateFormData({
      boxes: {
        ...formData.boxes,
        [category]: newValue
      }
    });
  };

  return (
    <div className="space-y-3">
      <div className="text-center mb-4">
        <Package className="w-10 h-10 mx-auto mb-3 text-primary" />
        <p className="text-muted-foreground text-sm">
          How many boxes or bags do you need to store?
        </p>
      </div>

      <TooltipProvider>
        <div className="grid gap-3">
          {boxCategories.map((category) => (
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
                      disabled={formData.boxes[category.key] === 0}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center font-semibold">
                      {formData.boxes[category.key]}
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