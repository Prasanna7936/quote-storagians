import { QuoteFormData } from '@/types/quote';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Package className="w-12 h-12 mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">
          How many boxes or bags do you need to store?
        </p>
      </div>

      <div className="grid gap-6">
        {boxCategories.map((category) => (
          <Card key={category.key} className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">{category.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {category.examples.map((example) => (
                      <span key={example} className="text-xs bg-muted px-2 py-1 rounded">
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(category.key, -1)}
                    disabled={formData.boxes[category.key] === 0}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold text-lg">
                    {formData.boxes[category.key]}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(category.key, 1)}
                  >
                    <Plus className="w-4 h-4" />
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