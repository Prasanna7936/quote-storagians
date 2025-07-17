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
- Books & Documents: ${formData.boxes.books}
- Personal Items: ${formData.boxes.personal}

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
    const message = `Hi! I got a storage quote of ₹${quote.totalCost.toLocaleString()} for ${quote.totalItems} items (${quote.estimatedVolume} cubic feet). Monthly rate: ₹${quote.monthlyRate.toLocaleString()}. Please contact me for booking.`;
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
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-muted/50 rounded-lg p-4">
                  <Package className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{quote.totalItems}</div>
                  <div className="text-sm text-muted-foreground">Total Items</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="text-2xl font-bold">{quote.estimatedVolume}</div>
                  <div className="text-sm text-muted-foreground">Cubic Feet</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Monthly Rate:</span>
                  <span className="text-2xl font-bold text-primary">
                    ₹{quote.monthlyRate.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span className="font-medium">Estimated Total:</span>
                  <span className="text-3xl font-bold bg-gradient-secondary bg-clip-text text-transparent">
                    ₹{quote.totalCost.toLocaleString()}
                  </span>
                </div>
              </div>

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
                    <div>Books: {formData.boxes.books}</div>
                    <div>Personal: {formData.boxes.personal}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
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