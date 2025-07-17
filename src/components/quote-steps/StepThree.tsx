import { QuoteFormData } from '@/types/quote';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Sofa } from 'lucide-react';

interface StepThreeProps {
  formData: QuoteFormData;
  updateFormData: (updates: Partial<QuoteFormData>) => void;
}

export const StepThree = ({ formData, updateFormData }: StepThreeProps) => {
  const furnitureCategories = [
    {
      key: 'extraLarge' as const,
      title: 'Extra Large Furniture',
      description: 'L Shape Sofa, Almirah/Cupboard 3Door, King Size cot, Dining Table 8 Seater',
      examples: ['L Shape Sofa', 'King Size Bed', 'Large Dining Table', '3-Door Cupboard']
    },
    {
      key: 'large' as const,
      title: 'Large Furniture',
      description: 'Sofa 3 Seater, Queen cot, Dining Table 6 Seater, Almirah/Cupboard 2 Door',
      examples: ['3 Seater Sofa', 'Queen Bed', '6-Seater Dining Table', '2-Door Wardrobe']
    },
    {
      key: 'medium' as const,
      title: 'Medium Furniture',
      description: 'Sofa 1 & 2 Seater, Single cot, Dining Table 4 Seater, Study/Computer Table, Mattresses',
      examples: ['2 Seater Sofa', 'Single Bed', 'Study Table', 'Mattresses']
    },
    {
      key: 'small' as const,
      title: 'Small Furniture',
      description: 'Foldable Cot, Dining Chair, Side/Centre Table, Office Chair, Plastic Chairs (4 stackable)',
      examples: ['Dining Chairs', 'Coffee Table', 'Office Chair', 'Plastic Chairs']
    }
  ];

  const updateQuantity = (category: keyof typeof formData.furniture, change: number) => {
    const newValue = Math.max(0, formData.furniture[category] + change);
    updateFormData({
      furniture: {
        ...formData.furniture,
        [category]: newValue
      }
    });
  };

  return (
    <div className="space-y-3">
      <div className="text-center mb-4">
        <Sofa className="w-10 h-10 mx-auto mb-3 text-primary" />
        <p className="text-muted-foreground text-sm">
          How many furniture items do you need to store?
        </p>
      </div>

      <div className="grid gap-3">
        {furnitureCategories.map((category) => (
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
                    disabled={formData.furniture[category.key] === 0}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-8 text-center font-semibold">
                    {formData.furniture[category.key]}
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