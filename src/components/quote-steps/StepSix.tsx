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

interface StepSixProps {
  formData: QuoteFormData;
  updateFormData: (updates: Partial<QuoteFormData>) => void;
}

export const StepSix = ({ formData, updateFormData }: StepSixProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Truck className="w-12 h-12 mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">
          When and where should we pick up your items?
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pickup-location" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Pickup Location
                </Label>
                <Input
                  id="pickup-location"
                  placeholder="Enter your pickup address"
                  value={formData.pickupLocation}
                  onChange={(e) => updateFormData({ pickupLocation: e.target.value })}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Please provide the complete address including city and pincode
                </p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Preferred Pickup Date
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
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground">
                  Select your preferred pickup date (must be a future date)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-info/10 border border-info/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-info flex items-center justify-center mt-0.5">
              <span className="text-white text-xs">i</span>
            </div>
            <div>
              <h4 className="font-medium text-info-foreground mb-1">Pickup Information</h4>
              <p className="text-sm text-muted-foreground">
                Our team will contact you to confirm the pickup time and any specific requirements. 
                Pickup is usually scheduled between 9 AM to 6 PM on working days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};