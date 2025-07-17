import { QuoteFormData } from '@/types/quote';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MapPin, Calendar as CalendarIcon, Truck } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface StepSevenProps {
  formData: QuoteFormData;
  updateFormData: (updates: Partial<QuoteFormData>) => void;
}

export const StepSeven = ({ formData, updateFormData }: StepSevenProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Truck className="w-12 h-12 mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">
          When and where should we pick up your items?
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Pickup Location */}
        <div className="space-y-2">
          <Label htmlFor="pickup-location" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Pickup Location
          </Label>
          <Input
            id="pickup-location"
            type="text"
            placeholder="Enter your address"
            value={formData.pickupLocation}
            onChange={(e) => updateFormData({ pickupLocation: e.target.value })}
            className="text-base"
          />
        </div>

        {/* Pickup Date */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Pickup Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.pickupDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.pickupDate ? (
                  format(formData.pickupDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.pickupDate || undefined}
                onSelect={(date) => updateFormData({ pickupDate: date || null })}
                disabled={(date) =>
                  date < new Date() || date < new Date("1900-01-01")
                }
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Pickup Information:</p>
              <ul className="space-y-1 text-xs">
                <li>• Our team will contact you to confirm the pickup time</li>
                <li>• Please ensure easy access to your items</li>
                <li>• We provide professional packing materials</li>
                <li>• Pickup is usually completed within 2-4 hours</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};