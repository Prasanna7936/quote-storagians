import { QuoteFormData } from '@/types/quote';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Calendar as CalendarIcon, Truck, Package2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface StepSevenProps {
  formData: QuoteFormData;
  updateFormData: (updates: Partial<QuoteFormData>) => void;
}

export const StepSeven = ({ formData, updateFormData }: StepSevenProps) => {
  const isSelfDrop = formData.deliveryMethod === 'self-drop';

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Truck className="w-12 h-12 mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">
          {isSelfDrop 
            ? "When and where will you drop off your items?"
            : "When and where should we pick up your items?"
          }
        </p>
      </div>

      {isSelfDrop && (
        <Alert className="border-primary/20 bg-primary/5">
          <Package2 className="h-4 w-4" />
          <AlertDescription>
            Please ensure your items are securely packed and labeled before drop-off.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {isSelfDrop ? 'Drop Location' : 'Pickup Location'}
          </Label>
          {isSelfDrop ? (
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Drop Address</Label>
                <div className="p-3 rounded-md border bg-muted/30 text-sm">
                  #123/4, Pipeline Rd, Janashakthi Nagar, Kamath Layout, Vivekanandanagar, Bengaluru, Karnataka 562130
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Google Location Link</Label>
                <div className="p-3 rounded-md border bg-muted/30">
                  <a 
                    href="https://share.google/b0pCBCcBg0UkZWn4c" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm break-all"
                  >
                    https://share.google/b0pCBCcBg0UkZWn4c
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <Input
              id="location"
              type="text"
              placeholder="Enter your address"
              value={formData.pickupLocation}
              onChange={(e) => updateFormData({ pickupLocation: e.target.value })}
              className="text-base"
            />
          )}
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            {isSelfDrop ? 'Drop Date' : 'Pickup Date'}
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
              <p className="font-medium mb-1">{isSelfDrop ? 'Drop Information:' : 'Pickup Information:'}</p>
              {isSelfDrop ? (
                <ul className="space-y-1 text-xs">
                  <li>• Drop-off is available during business hours (9 AM - 6 PM)</li>
                  <li>• Please bring a valid ID for verification</li>
                  <li>• Our team will assist you with unloading</li>
                  <li>• Drop-off usually takes 30-60 minutes</li>
                </ul>
              ) : (
                <ul className="space-y-1 text-xs">
                  <li>• Our team will contact you to confirm the pickup time</li>
                  <li>• Please ensure easy access to your items</li>
                  <li>• We provide professional packing materials</li>
                  <li>• Pickup is usually completed within 2-4 hours</li>
                </ul>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};