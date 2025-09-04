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
import jsPDF from 'jspdf';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface QuoteResultsProps {
  quote: QuoteResult;
  formData: QuoteFormData;
  onReset: () => void;
}

export const QuoteResults = ({ quote, formData, onReset }: QuoteResultsProps) => {
  const { toast } = useToast();
  const downloadQuote = () => {
    const pdf = new jsPDF();
    
    // Design system colors (HSL to RGB conversion)
    const primaryColor = [255, 178, 56] as const; // HSL(32, 95%, 58%) -> RGB
    const primaryGlowColor = [255, 191, 77] as const; // HSL(32, 95%, 68%) -> RGB
    const backgroundLightColor = [254, 248, 237] as const; // HSL(39, 100%, 97%) -> RGB
    const mutedTextColor = [115, 115, 115] as const; // HSL(25, 13%, 54%) -> RGB
    const darkTextColor = [48, 41, 30] as const; // HSL(25, 25%, 12%) -> RGB
    
    // Background gradient effect
    pdf.setFillColor(backgroundLightColor[0], backgroundLightColor[1], backgroundLightColor[2]);
    pdf.rect(0, 0, 210, 297, 'F');
    
    // Header with white background
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(15, 15, 180, 25, 3, 3, 'F');
    
    // Company logo in header - load and add image
    try {
      // Create an image element to load the logo
      const img = new Image();
      img.onload = function() {
        // Add the logo centered in the header
        pdf.addImage(img, 'PNG', 85, 20, 40, 15); // centered position with appropriate size
      };
      img.src = '/lovable-uploads/e21098a7-2133-48a4-a926-675f35fc94ab.png';
      
      // Add the logo immediately if possible (fallback approach)
      pdf.addImage('/lovable-uploads/e21098a7-2133-48a4-a926-675f35fc94ab.png', 'PNG', 85, 20, 40, 15);
    } catch (error) {
      // Fallback to text if image fails to load
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(16);
      pdf.setFont(undefined, 'bold');
      pdf.text('Storage Quote', 105, 32, { align: 'center' });
    }
    
    let yPos = 60;
    
    // Quote Summary Card (Main Card with Gradient Header)
    pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.roundedRect(20, yPos - 5, 170, 15, 2, 2, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text('QUOTE SUMMARY', 105, yPos + 5, { align: 'center' });
    
    // Card body background
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.setLineWidth(0.5);
    pdf.roundedRect(20, yPos + 10, 170, formData.storageType === 'household' ? 75 : 65, 2, 2, 'FD');
    
    yPos += 25;
    
    // Quote details with proper styling
    pdf.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
    pdf.setFontSize(11);
    
    if (formData.storageType === 'household') {
      // Household storage layout matching web UI exactly
      pdf.setFont(undefined, 'normal');
      
      // Total Volume (first, matching web order)
      pdf.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
      pdf.text('Total Volume:', 30, yPos);
      pdf.setFont(undefined, 'bold');
      pdf.text(`${quote.totalVolume} cft`, 160, yPos, { align: 'right' });
      yPos += 10;
      
      // Monthly Storage Charges (matching web label exactly)
      pdf.setFont(undefined, 'normal');
      pdf.text('Monthly Storage Charges:', 30, yPos);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text(`INR ${quote.rentalCharges?.toLocaleString()} + GST`, 160, yPos, { align: 'right' });
      yPos += 6;
      
      // Discount note (matching web exactly)
      pdf.setTextColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
      pdf.setFontSize(9);
      pdf.setFont(undefined, 'normal');
      pdf.text('(Discounts & offers will be shared in the updated quote.)', 30, yPos);
      yPos += 12;
      
      // Separator line
      pdf.setDrawColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
      pdf.line(30, yPos, 180, yPos);
      yPos += 10;
      
      // Pickup/Drop-off Charges (matching web exactly)
      pdf.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
      pdf.setFont(undefined, 'normal');
      pdf.setFontSize(11);
      const chargeLabel = formData.deliveryMethod === 'third-party' ? 'Drop-off Charges:' : 'Pickup Charges:';
      pdf.text(chargeLabel, 30, yPos);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text('To be confirmed', 160, yPos, { align: 'right' });
      yPos += 6;
      
      // Pickup charges note (matching web exactly)
      pdf.setTextColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
      pdf.setFontSize(9);
      pdf.setFont(undefined, 'normal');
      pdf.text('(Includes packing, labour & transport — our team will share details shortly.)', 30, yPos);
      yPos += 10;
      
    } else {
      // Document storage layout
      pdf.setFont(undefined, 'normal');
      
      pdf.text('Storage Type:', 30, yPos);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text(`${quote.storageType}`, 160, yPos, { align: 'right' });
      yPos += 8;
      
      pdf.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
      pdf.setFont(undefined, 'normal');
      pdf.text('Duration:', 30, yPos);
      pdf.setFont(undefined, 'bold');
      pdf.text(`${quote.durationCategory}`, 160, yPos, { align: 'right' });
      yPos += 8;
      
      pdf.setFont(undefined, 'normal');
      pdf.text('Box Count:', 30, yPos);
      pdf.setFont(undefined, 'bold');
      pdf.text(`${formData.documentBoxCount}`, 160, yPos, { align: 'right' });
      yPos += 8;
      
      pdf.setFont(undefined, 'normal');
      pdf.text('Monthly Storage Rental:', 30, yPos);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text(`INR ${quote.boxRate} per box`, 160, yPos, { align: 'right' });
      yPos += 8;
      
      pdf.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
      pdf.setFont(undefined, 'normal');
      pdf.text('One-Time New Box Charge:', 30, yPos);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text(`INR ${quote.boxChargeRate} per box`, 160, yPos, { align: 'right' });
    }
    
    yPos += 25;
    
    // Customer Information Card
    pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.roundedRect(20, yPos, 80, 12, 2, 2, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text('CUSTOMER INFORMATION', 60, yPos + 7, { align: 'center' });
    
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.roundedRect(20, yPos + 12, 80, 30, 2, 2, 'FD');
    
    // Customer details
    pdf.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    
    pdf.text('Name:', 25, yPos + 20);
    pdf.setFont(undefined, 'bold');
    pdf.text(formData.customerName, 45, yPos + 20);
    
    pdf.setFont(undefined, 'normal');
    pdf.text('Phone:', 25, yPos + 27);
    pdf.setFont(undefined, 'bold');
    pdf.text(formData.customerPhone, 45, yPos + 27);
    
    pdf.setFont(undefined, 'normal');
    pdf.text('Email:', 25, yPos + 34);
    pdf.setFont(undefined, 'bold');
    pdf.text(formData.customerEmail, 45, yPos + 34);
    
    // Pickup Details Card
    pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.roundedRect(110, yPos, 80, 12, 2, 2, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    const detailsTitle = formData.deliveryMethod === 'third-party' ? 'DROP BY YOU' : 'PICKUP DETAILS';
    pdf.text(detailsTitle, 150, yPos + 7, { align: 'center' });
    
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.roundedRect(110, yPos + 12, 80, 30, 2, 2, 'FD');
    
    // Pickup details
    pdf.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    
    pdf.text('Type:', 115, yPos + 20);
    pdf.setFont(undefined, 'bold');
    pdf.text(formData.storageType.charAt(0).toUpperCase() + formData.storageType.slice(1), 135, yPos + 20);
    
    pdf.setFont(undefined, 'normal');
    pdf.text('Duration:', 115, yPos + 27);
    pdf.setFont(undefined, 'bold');
    pdf.text(formData.duration, 145, yPos + 27);
    
    pdf.setFont(undefined, 'normal');
    pdf.text('Location:', 115, yPos + 34);
    pdf.setFont(undefined, 'bold');
    pdf.text(formData.pickupLocation, 145, yPos + 34);
    
    yPos += 50;
    
    // Items Breakdown for Household (if applicable)
    if (formData.storageType === 'household') {
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.roundedRect(20, yPos, 170, 12, 2, 2, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text('ITEMS BREAKDOWN', 105, yPos + 7, { align: 'center' });
      
      pdf.setFillColor(255, 255, 255);
      pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.roundedRect(20, yPos + 12, 170, 40, 2, 2, 'FD');
      
      yPos += 22;
      
      // Furniture column
      pdf.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'bold');
      pdf.text('Furniture:', 25, yPos);
      
      pdf.setFont(undefined, 'normal');
      pdf.text(`Extra Large: ${formData.furniture.extraLarge}`, 25, yPos + 6);
      pdf.text(`Large: ${formData.furniture.large}`, 25, yPos + 12);
      pdf.text(`Medium: ${formData.furniture.medium}`, 25, yPos + 18);
      pdf.text(`Small: ${formData.furniture.small}`, 25, yPos + 24);
      
      // Appliances column
      pdf.setFont(undefined, 'bold');
      pdf.text('Appliances:', 80, yPos);
      
      pdf.setFont(undefined, 'normal');
      pdf.text(`Extra Large: ${formData.appliances.extraLarge}`, 80, yPos + 6);
      pdf.text(`Large: ${formData.appliances.large}`, 80, yPos + 12);
      pdf.text(`Medium: ${formData.appliances.medium}`, 80, yPos + 18);
      pdf.text(`Small: ${formData.appliances.small}`, 80, yPos + 24);
      
      // Boxes & Luggage column
      pdf.setFont(undefined, 'bold');
      pdf.text('Boxes & Luggage:', 135, yPos);
      
      pdf.setFont(undefined, 'normal');
      pdf.text(`Luggage: ${formData.boxes.luggage}`, 135, yPos + 6);
      pdf.text(`Kitchen: ${formData.boxes.kitchen}`, 135, yPos + 12);
      pdf.text(`Clothes: ${formData.boxes.clothes}`, 135, yPos + 18);
      pdf.text(`Books/Personal: ${formData.boxes.booksPersonal}`, 135, yPos + 24);
      
      yPos += 35;
    }
    
    // Disclaimer
    yPos += 10;
    pdf.setFillColor(230, 246, 255);
    pdf.setDrawColor(100, 181, 246);
    pdf.roundedRect(20, yPos, 170, 15, 2, 2, 'FD');
    
    pdf.setTextColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
    pdf.setFontSize(9);
    pdf.setFont(undefined, 'normal');
    pdf.text('* This is an estimated quote. Final pricing may vary based on actual', 25, yPos + 6);
    pdf.text('volume and specific requirements.', 25, yPos + 12);
    
    // Generated date
    yPos += 25;
    pdf.setTextColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
    pdf.setFontSize(9);
    pdf.text(`Generated on: ${format(new Date(), 'PPP')}`, 25, yPos);
    
    // Footer with gradient background
    const pageHeight = pdf.internal.pageSize.height;
    pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.rect(0, pageHeight - 25, 210, 25, 'F');
    
    // Footer text - all in single line with different alignments
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    
    // Left aligned text
    pdf.text('Contact: +91-9900056394', 20, pageHeight - 15, { align: 'left' });
    
    // Center aligned text
    pdf.text('www.storagians.com', 105, pageHeight - 15, { align: 'center' });
    
    // Right aligned text
    pdf.text('info@storagians.com', 190, pageHeight - 15, { align: 'right' });
    
    // Save the PDF
    pdf.save(`storage-quote-${formData.customerName.replace(/\s+/g, '-')}.pdf`);
  };

  const sendWhatsApp = () => {
    let message;
    if (formData.storageType === 'household') {
      const chargeType = formData.deliveryMethod === 'third-party' ? 'Drop-off Charges' : 'Pickup Charges';
      const chargeAmount = formData.deliveryMethod === 'third-party' ? '700' : quote.pickupCharges?.toLocaleString();
      message = `Hi! I got a household storage quote:
Total Volume: ${quote.totalVolume} cft
Rental: INR ${quote.rentalCharges?.toLocaleString()} + GST
${chargeType}: INR ${chargeAmount}
Please contact me for booking.`;
    } else {
      message = `Hi! I got a storage quote of INR ${quote.totalCost.toLocaleString()} for ${quote.totalItems} items (${quote.estimatedVolume} cubic feet). Monthly rate: INR ${quote.monthlyRate.toLocaleString()}. Please contact me for booking.`;
    }
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const confirmBooking = async () => {
    try {
      // Show loading toast
      toast({
        title: "Sending confirmation...",
        description: "Please wait while we process your booking request.",
      });

      // Send email notification
      const { error } = await supabase.functions.invoke('send-quote-email', {
        body: {
          formData,
          quote,
          type: 'booking_confirmation'
        }
      });

      if (error) throw error;

      // Show success message
      toast({
        title: "Booking Confirmed!",
        description: "Our team will connect you shortly.",
        variant: "default",
      });

      // Redirect to main page after 2 seconds
      setTimeout(() => {
        onReset();
      }, 2000);

    } catch (error) {
      console.error('Error sending booking confirmation:', error);
      toast({
        title: "Error",
        description: "Failed to send confirmation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/eaecb7b7-1d69-4fc7-8fe1-6b775a4b45ef.png" 
            alt="Storagians Logo" 
            className="h-16 md:h-20 max-w-xs mx-auto mb-6 object-contain"
          />
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
                // Updated household display format per requirements
                <div className="space-y-4">
                  {/* Total Volume first */}
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Volume:</span>
                    <span className="text-lg font-bold">
                      {quote.totalVolume} cft
                    </span>
                  </div>
                  
                  {/* Monthly Storage Charges */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Monthly Storage Charges:</span>
                      <span className="text-lg font-bold text-primary">
                        INR {quote.rentalCharges?.toLocaleString()} + GST
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      (Discounts & offers will be shared in the updated quote.)
                    </p>
                  </div>
                  
                  <Separator />
                  
                  {/* Pickup or Drop-off Charges */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-medium">
                        {formData.deliveryMethod === 'third-party' ? 'Drop-Off Charges:' : 'Pickup Charges:'}
                      </span>
                      <span className="text-2xl font-bold bg-gradient-secondary bg-clip-text text-transparent">
                        To be confirmed
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      (Includes packing, labour & transport — our team will share details shortly.)
                    </p>
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
                      {formData.documentBoxCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Monthly Storage Rental:</span>
                    <span className="text-lg font-bold text-primary">
                      INR {quote.boxRate} per box
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">One-Time New Box Charge:</span>
                    <span className="text-lg font-bold text-primary">
                      INR {quote.boxChargeRate} per box
                    </span>
                  </div>
                  
                  {/* Delivery Method Message */}
                  {formData.deliveryMethod && (
                    <div className="bg-success/10 border border-success/20 rounded-lg p-4 mt-4">
                      <p className="text-success font-bold text-center">
                        Thank you! Our team will be reaching out soon with pickup details and assistance.
                      </p>
                    </div>
                  )}
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
                  {formData.deliveryMethod === 'third-party' ? 'Drop by You' : 'Pickup Details'}
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
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="gradient" onClick={downloadQuote} size="lg">
              <Download className="w-4 h-4 mr-2" />
              Download Quote
            </Button>
            <Button variant="outline" size="lg" onClick={confirmBooking}>
              <Mail className="w-4 h-4 mr-2" />
              Confirm Booking
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
                       <div>Monthly: INR {Math.round(quote.rentalCharges * 0.95).toLocaleString()}</div>
                       <div className="font-medium text-success">
                         Save INR {Math.round(quote.rentalCharges * 3 * 0.05).toLocaleString()}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                       <div>Monthly: INR {Math.round(quote.monthlyRate * 0.95).toLocaleString()}</div>
                       <div className="font-medium text-success">
                         Save INR {Math.round(quote.monthlyRate * 3 * 0.05).toLocaleString()}
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
                       <div>Monthly: INR {Math.round(quote.rentalCharges * 0.9).toLocaleString()}</div>
                       <div className="font-medium text-success">
                         Save INR {Math.round(quote.rentalCharges * 6 * 0.1).toLocaleString()}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                       <div>Monthly: INR {Math.round(quote.monthlyRate * 0.9).toLocaleString()}</div>
                       <div className="font-medium text-success">
                         Save INR {Math.round(quote.monthlyRate * 6 * 0.1).toLocaleString()}
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
                       <div>Monthly: INR {Math.round(quote.rentalCharges * 0.85).toLocaleString()}</div>
                       <div className="font-medium text-success">
                         Save INR {Math.round(quote.rentalCharges * 12 * 0.15).toLocaleString()}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                       <div>Monthly: INR {Math.round(quote.monthlyRate * 0.85).toLocaleString()}</div>
                       <div className="font-medium text-success">
                         Save INR {Math.round(quote.monthlyRate * 12 * 0.15).toLocaleString()}
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

        {/* Call us section */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-primary/10 border-2 border-primary/30 rounded-lg p-4">
            <p className="text-center text-lg font-semibold text-primary">
              Call us: +91 9900056394
            </p>
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