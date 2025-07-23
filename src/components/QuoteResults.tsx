import { QuoteResult, QuoteFormData } from '@/types/quote';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  Mail, 
  MessageCircle, 
  RefreshCw, 
  Package, 
  Calculator,
  Clock,
  MapPin,
  User
} from 'lucide-react';
import { format } from 'date-fns';

interface QuoteResultsProps {
  quote: QuoteResult;
  formData: QuoteFormData;
  onReset: () => void;
}

export const QuoteResults = ({ quote, formData, onReset }: QuoteResultsProps) => {
  const downloadQuote = () => {
    const quoteSummary = `
STORAGE QUOTE SUMMARY
====================

Customer Information:
Name: ${formData.customerName}
Phone: ${formData.customerPhone}
Email: ${formData.customerEmail}

Storage Details:
Type: ${formData.storageType.charAt(0).toUpperCase() + formData.storageType.slice(1)} Storage
Duration: ${formData.duration}
Pickup Location: ${formData.pickupLocation}
Pickup Date: ${formData.pickupDate ? format(formData.pickupDate, 'PPP') : 'Not specified'}

Items Summary:
Total Items: ${quote.totalItems}
Estimated Volume: ${quote.estimatedVolume} cubic feet

Furniture:
- Extra Large: ${formData.furniture.extraLarge}
- Large: ${formData.furniture.large}
- Medium: ${formData.furniture.medium}
- Small: ${formData.furniture.small}

Appliances:
- Extra Large: ${formData.appliances.extraLarge}
- Large: ${formData.appliances.large}
- Medium: ${formData.appliances.medium}
- Small: ${formData.appliances.small}

Boxes & Luggage:
- Luggage: ${formData.boxes.luggage}
- Kitchen Items: ${formData.boxes.kitchen}
- Clothes & Bedding: ${formData.boxes.clothes}
- Books/Document and Personal Items: ${formData.boxes.booksPersonal}

PRICING:
Monthly Rate: ₹${quote.monthlyRate.toLocaleString()}
Total Estimated Cost: ₹${quote.totalCost.toLocaleString()}

Generated on: ${format(new Date(), 'PPP')}
    `.trim();

    const blob = new Blob([quoteSummary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `storage-quote-${formData.customerName.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sendWhatsApp = () => {
    let message;
    if (formData.storageType === 'household' && quote.pickupCharges) {
      message = `Hi! I got a household storage quote:
Rental Charges: ₹${quote.rentalCharges?.toLocaleString()}
Packing Material: ₹${quote.packingMaterialCharges?.toLocaleString()}
Total Volume: ${quote.totalVolume} cft
Vehicle: ${quote.recommendedVehicle} (₹${quote.vehicleCost?.toLocaleString()})
Labour: ${quote.labourCount} persons (₹${quote.labourCost?.toLocaleString()})
Pickup Charges: ₹${quote.pickupCharges.toLocaleString()}
Please contact me for booking.`;
    } else {
      message = `Hi! I got a storage quote of ₹${quote.totalCost.toLocaleString()} for ${quote.totalItems} items (${quote.estimatedVolume} cubic feet). Monthly rate: ₹${quote.monthlyRate.toLocaleString()}. Please contact me for booking.`;
    }
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
            <Calculator className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
            Your Storage Quote
          </h1>
          <p className="text-lg text-muted-foreground">
            Here's your instant storage estimate
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
          {/* Quote Summary */}
          <Card className="shadow-strong">
            <CardHeader className="text-center bg-gradient-primary text-primary-foreground rounded-t-lg">
              <CardTitle className="text-2xl font-bold">Quote Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {formData.storageType === 'household' ? (
                // New household display format
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Rental Charges:</span>
                    <span className="text-lg font-bold text-primary">
                      ₹{quote.rentalCharges?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Packing Material Charges:</span>
                    <span className="text-lg font-bold text-primary">
                      ₹{quote.packingMaterialCharges?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Volume:</span>
                    <span className="text-lg font-bold">
                      {quote.totalVolume} cft
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Recommended Vehicle:</span>
                    <span className="text-lg font-bold">
                      {quote.recommendedVehicle} (₹{quote.vehicleCost?.toLocaleString()})
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Labour Required:</span>
                    <span className="text-lg font-bold">
                      {quote.labourCount} (₹{quote.labourCost?.toLocaleString()})
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-medium">Pickup Charges:</span>
                    <span className="text-2xl font-bold bg-gradient-secondary bg-clip-text text-transparent">
                      ₹{quote.pickupCharges?.toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : formData.storageType === 'business' ? (
                // Business storage display format
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Storage Space Selected:</span>
                    <span className="text-lg font-bold text-primary">
                      {quote.spaceSize}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Duration:</span>
                    <span className="text-lg font-bold">
                      {formData.duration.replace('months', ' Months').replace('>', 'More than ')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Rate per Sq. Ft:</span>
                    <span className="text-lg font-bold">
                      ₹{quote.ratePerSqFt}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-medium">Monthly Rent:</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold bg-gradient-secondary bg-clip-text text-transparent">
                        ₹{quote.monthlyRent?.toLocaleString()}
                      </span>
                      <div className="text-sm text-muted-foreground mt-1">
                        ({quote.spaceSize?.replace('Sq. Ft', '').trim()} Sq. Ft × ₹{quote.ratePerSqFt})
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Document storage display format
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Storage Type:</span>
                    <span className="text-lg font-bold text-primary">
                      {quote.storageType}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Duration:</span>
                    <span className="text-lg font-bold">
                      {quote.durationCategory}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Box Count:</span>
                    <span className="text-lg font-bold">
                      {quote.boxCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Box Rate:</span>
                    <span className="text-lg font-bold">
                      ₹{quote.boxRate}/box/month
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Box Rental:</span>
                    <span className="text-lg font-bold text-primary">
                      ₹{quote.boxRental?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Box Charges:</span>
                    <span className="text-lg font-bold text-primary">
                      ₹{quote.boxCharges?.toLocaleString()}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-medium">Total Storage Cost:</span>
                    <span className="text-2xl font-bold bg-gradient-secondary bg-clip-text text-transparent">
                      ₹{quote.totalCost.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  * This is an estimated quote. Final pricing may vary based on actual volume and specific requirements.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Customer & Pickup Details */}
          <div className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium">Name:</span> {formData.customerName}
                </div>
                <div>
                  <span className="font-medium">Phone:</span> {formData.customerPhone}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {formData.customerEmail}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Pickup Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium">Storage Type:</span> {formData.storageType.charAt(0).toUpperCase() + formData.storageType.slice(1)}
                </div>
                <div>
                  <span className="font-medium">Duration:</span> {formData.duration}
                </div>
                <div>
                  <span className="font-medium">Location:</span> {formData.pickupLocation}
                </div>
                <div>
                  <span className="font-medium">Date:</span> {formData.pickupDate ? format(formData.pickupDate, 'PPP') : 'Not specified'}
                </div>
              </CardContent>
            </Card>

            {formData.storageType === 'household' && (
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Items Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="font-medium mb-2">Furniture:</div>
                      <div>Extra Large: {formData.furniture.extraLarge}</div>
                      <div>Large: {formData.furniture.large}</div>
                      <div>Medium: {formData.furniture.medium}</div>
                      <div>Small: {formData.furniture.small}</div>
                    </div>
                    <div>
                      <div className="font-medium mb-2">Appliances:</div>
                      <div>Extra Large: {formData.appliances.extraLarge}</div>
                      <div>Large: {formData.appliances.large}</div>
                      <div>Medium: {formData.appliances.medium}</div>
                      <div>Small: {formData.appliances.small}</div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="font-medium mb-2">Boxes & Luggage:</div>
                    <div className="grid grid-cols-2 gap-1">
                      <div>Luggage: {formData.boxes.luggage}</div>
                      <div>Kitchen: {formData.boxes.kitchen}</div>
                      <div>Clothes: {formData.boxes.clothes}</div>
                      <div>Books/Personal: {formData.boxes.booksPersonal}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="grid gap-4 md:grid-cols-4">
            <Button variant="gradient" onClick={downloadQuote} size="lg">
              <Download className="w-4 h-4 mr-2" />
              Download Quote
            </Button>
            <Button variant="success" onClick={sendWhatsApp} size="lg">
              <MessageCircle className="w-4 h-4 mr-2" />
              Share on WhatsApp
            </Button>
            <Button variant="outline" size="lg">
              <Mail className="w-4 h-4 mr-2" />
              Email Quote
            </Button>
            <Button variant="outline" onClick={onReset} size="lg">
              <RefreshCw className="w-4 h-4 mr-2" />
              New Quote
            </Button>
          </div>
        </div>

        {/* Prepay Discount Section */}
        <div className="max-w-4xl mx-auto mt-8">
          <Card className="shadow-strong">
            <CardHeader className="text-center bg-gradient-secondary text-primary-foreground rounded-t-lg">
              <CardTitle className="text-2xl font-bold">Prepay & Save!</CardTitle>
              <p className="text-sm opacity-90">Pay in advance and get exclusive discounts</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-3">
                {/* 3 Months */}
                <div className="bg-muted/30 rounded-lg p-4 text-center border-2 hover:border-primary/50 transition-colors">
                  <div className="text-lg font-bold text-primary mb-2">3 Months Advance</div>
                  <div className="text-3xl font-bold text-success mb-2">5% OFF</div>
                  {formData.storageType === 'household' && quote.rentalCharges ? (
                    <div className="text-sm text-muted-foreground">
                      <div>Monthly: ₹{Math.round(quote.rentalCharges * 0.95).toLocaleString()}</div>
                      <div className="font-medium text-success">
                        Save ₹{Math.round(quote.rentalCharges * 3 * 0.05).toLocaleString()}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      <div>Monthly: ₹{Math.round(quote.monthlyRate * 0.95).toLocaleString()}</div>
                      <div className="font-medium text-success">
                        Save ₹{Math.round(quote.monthlyRate * 3 * 0.05).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>

                {/* 6 Months */}
                <div className="bg-muted/30 rounded-lg p-4 text-center border-2 border-primary/70 relative overflow-hidden">
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                    Popular
                  </div>
                  <div className="text-lg font-bold text-primary mb-2">6 Months Advance</div>
                  <div className="text-3xl font-bold text-success mb-2">10% OFF</div>
                  {formData.storageType === 'household' && quote.rentalCharges ? (
                    <div className="text-sm text-muted-foreground">
                      <div>Monthly: ₹{Math.round(quote.rentalCharges * 0.9).toLocaleString()}</div>
                      <div className="font-medium text-success">
                        Save ₹{Math.round(quote.rentalCharges * 6 * 0.1).toLocaleString()}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      <div>Monthly: ₹{Math.round(quote.monthlyRate * 0.9).toLocaleString()}</div>
                      <div className="font-medium text-success">
                        Save ₹{Math.round(quote.monthlyRate * 6 * 0.1).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>

                {/* 12 Months */}
                <div className="bg-muted/30 rounded-lg p-4 text-center border-2 hover:border-primary/50 transition-colors">
                  <div className="text-lg font-bold text-primary mb-2">12 Months Advance</div>
                  <div className="text-3xl font-bold text-success mb-2">15% OFF</div>
                  {formData.storageType === 'household' && quote.rentalCharges ? (
                    <div className="text-sm text-muted-foreground">
                      <div>Monthly: ₹{Math.round(quote.rentalCharges * 0.85).toLocaleString()}</div>
                      <div className="font-medium text-success">
                        Save ₹{Math.round(quote.rentalCharges * 12 * 0.15).toLocaleString()}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      <div>Monthly: ₹{Math.round(quote.monthlyRate * 0.85).toLocaleString()}</div>
                      <div className="font-medium text-success">
                        Save ₹{Math.round(quote.monthlyRate * 12 * 0.15).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  * Discounts apply to monthly rental charges only
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto mt-8 text-center">
          <div className="bg-success/10 border border-success/20 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2 text-success">What's Next?</h3>
            <p className="text-muted-foreground mb-4">
              Our team will contact you within 24 hours to confirm your requirements and schedule the pickup.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-success" />
                <span>24/7 Customer Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-success" />
                <span>Professional Packing</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-success" />
                <span>Secure Storage Facility</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};