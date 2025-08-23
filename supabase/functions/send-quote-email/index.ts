import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface QuoteEmailRequest {
  formData: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    storageType: string;
    duration: string;
    pickupLocation: string;
    pickupDate: Date | null;
    deliveryMethod: string;
    furniture?: any;
    appliances?: any;
    boxes?: any;
    documentBoxRequirement?: string;
    documentStorageType?: string;
    documentBoxCount?: string;
  };
  quote: {
    totalVolume?: number;
    rentalCharges?: number;
    packingMaterialCharges?: number;
    pickupCharges?: number;
    recommendedVehicle?: string;
    vehicleCost?: number;
    labourCount?: number;
    labourCost?: number;
    totalCost?: number;
    monthlyRate?: number;
    estimatedVolume?: number;
    totalItems?: number;
    storageType?: string;
    boxCount?: number;
    boxRate?: number;
    boxRental?: number;
    boxCharges?: number;
  };
  type: 'new_quote' | 'booking_confirmation';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { formData, quote, type }: QuoteEmailRequest = await req.json();
    
    console.log(`📧 Received ${type} request for:`, {
      name: formData.customerName,
      email: formData.customerEmail,
      phone: formData.customerPhone,
      storageType: formData.storageType
    });

    // Prepare email content based on type and storage type
    let emailSubject: string;
    let companyEmailHtml: string;
    let customerEmailHtml: string;

    if (type === 'booking_confirmation') {
      emailSubject = `Storage Booking Confirmation - ${formData.customerName}`;
      
      companyEmailHtml = generateCompanyBookingEmail(formData, quote);
      customerEmailHtml = generateCustomerBookingEmail(formData, quote);
      
    } else { // new_quote
      emailSubject = `New Storage Quote Request - ${formData.customerName}`;
      
      companyEmailHtml = generateCompanyQuoteEmail(formData, quote);
      customerEmailHtml = generateCustomerQuoteEmail(formData, quote);
    }

    // Send email to company
    console.log("📧 Sending email to company (info@storagians.com)...");
    
    const companyEmailResponse = await resend.emails.send({
      from: "Storagians Contact <contact@storagians.com>",
      to: ["info@storagians.com"],
      replyTo: "info@storagians.com",
      subject: emailSubject,
      html: companyEmailHtml,
    });

    if (companyEmailResponse.error) {
      console.error("❌ Company email failed:", companyEmailResponse.error);
      throw companyEmailResponse.error;
    }

    console.log("✅ Company email sent successfully with ID:", companyEmailResponse.data?.id);

    // Send email to customer
    console.log("📧 Sending email to customer...");
    
    const customerEmailResponse = await resend.emails.send({
      from: "Storagians Contact <contact@storagians.com>",
      to: [formData.customerEmail],
      replyTo: "info@storagians.com",
      subject: type === 'booking_confirmation' 
        ? "Storage Booking Confirmation - Storagians" 
        : "Your Storage Quote - Storagians",
      html: customerEmailHtml,
    });

    if (customerEmailResponse.error) {
      console.error("❌ Customer email failed:", customerEmailResponse.error);
      // Still continue as company email was successful
    } else {
      console.log("✅ Customer email sent successfully with ID:", customerEmailResponse.data?.id);
    }

    console.log("📧 Emails processed successfully");

    return new Response(
      JSON.stringify({ 
        success: true,
        companyEmailId: companyEmailResponse.data?.id,
        customerEmailId: customerEmailResponse.data?.id || null
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
    
  } catch (error: any) {
    console.error("❌ Error in send-quote-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function generateCompanyQuoteEmail(formData: any, quote: any): string {
  const isHousehold = formData.storageType === 'household';
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #FF8C38, #FFB84D); padding: 20px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; text-align: center;">New Storage Quote Request</h1>
      </div>
      
      <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; border-bottom: 2px solid #FF8C38; padding-bottom: 10px;">Customer Information</h2>
        <p><strong>Name:</strong> ${formData.customerName}</p>
        <p><strong>Phone:</strong> ${formData.customerPhone}</p>
        <p><strong>Email:</strong> ${formData.customerEmail}</p>
        
        <h2 style="color: #333; border-bottom: 2px solid #FF8C38; padding-bottom: 10px; margin-top: 30px;">Quote Details</h2>
        <p><strong>Storage Type:</strong> ${formData.storageType.charAt(0).toUpperCase() + formData.storageType.slice(1)}</p>
        <p><strong>Duration:</strong> ${formData.duration}</p>
        <p><strong>Pickup Location:</strong> ${formData.pickupLocation}</p>
        <p><strong>Pickup Date:</strong> ${formData.pickupDate ? new Date(formData.pickupDate).toLocaleDateString() : 'Not specified'}</p>
        <p><strong>Delivery Method:</strong> ${formData.deliveryMethod}</p>
        
        ${isHousehold ? `
          <h3 style="color: #333; margin-top: 20px;">Quote Summary</h3>
          <p><strong>Total Volume:</strong> ${quote.totalVolume} cft</p>
          <p><strong>Rental:</strong> ₹${quote.rentalCharges?.toLocaleString()} + GST</p>
          <p><strong>Pickup Charges:</strong> ₹${quote.pickupCharges?.toLocaleString()}</p>
          <p style="color: #666; font-size: 14px; margin-top: 10px;">
            (Includes Packing Material, Transportation and Labour Charges)
          </p>
          
          <h3 style="color: #333; margin-top: 20px;">Items Breakdown</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
            <div>
              <h4>Furniture:</h4>
              <p>Extra Large: ${formData.furniture?.extraLarge || 0}</p>
              <p>Large: ${formData.furniture?.large || 0}</p>
              <p>Medium: ${formData.furniture?.medium || 0}</p>
              <p>Small: ${formData.furniture?.small || 0}</p>
            </div>
            <div>
              <h4>Appliances:</h4>
              <p>Extra Large: ${formData.appliances?.extraLarge || 0}</p>
              <p>Large: ${formData.appliances?.large || 0}</p>
              <p>Medium: ${formData.appliances?.medium || 0}</p>
              <p>Small: ${formData.appliances?.small || 0}</p>
            </div>
            <div>
              <h4>Boxes & Luggage:</h4>
              <p>Luggage: ${formData.boxes?.luggage || 0}</p>
              <p>Kitchen: ${formData.boxes?.kitchen || 0}</p>
              <p>Clothes: ${formData.boxes?.clothes || 0}</p>
              <p>Books/Personal: ${formData.boxes?.booksPersonal || 0}</p>
            </div>
          </div>
        ` : `
          <h3 style="color: #333; margin-top: 20px;">Document Storage Details</h3>
          <p><strong>Box Requirement:</strong> ${formData.documentBoxRequirement}</p>
          <p><strong>Storage Type:</strong> ${formData.documentStorageType}</p>
          <p><strong>Box Count:</strong> ${formData.documentBoxCount}</p>
          <p><strong>Monthly Rate:</strong> ₹${quote.monthlyRate?.toLocaleString()}</p>
          <p><strong>Total Cost:</strong> ₹${quote.totalCost?.toLocaleString()}</p>
        `}
        
        <div style="background: #fff; padding: 15px; border-radius: 5px; margin-top: 20px; border-left: 4px solid #FF8C38;">
          <p style="margin: 0; color: #333;"><strong>Action Required:</strong> Please contact the customer within 24 hours to confirm requirements and schedule pickup.</p>
        </div>
      </div>
    </div>
  `;
}

function generateCustomerQuoteEmail(formData: any, quote: any): string {
  const isHousehold = formData.storageType === 'household';
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #FF8C38, #FFB84D); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0;">Your Storage Quote</h1>
        <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Thank you for choosing Storagians!</p>
      </div>
      
      <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px;">
        <p>Dear ${formData.customerName},</p>
        <p>Thank you for your interest in our storage services. Below is your personalized quote:</p>
        
        ${isHousehold ? `
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e0e0e0;">
            <h3 style="color: #FF8C38; margin-top: 0;">Quote Summary</h3>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span>Total Volume:</span>
              <strong>${quote.totalVolume} cft</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span>Rental:</span>
              <strong>₹${quote.rentalCharges?.toLocaleString()} + GST</strong>
            </div>
            <hr style="border: 1px solid #e0e0e0; margin: 15px 0;">
            <div style="display: flex; justify-content: space-between; font-size: 18px;">
              <span>Pickup Charges:</span>
              <strong style="color: #FF8C38;">₹${quote.pickupCharges?.toLocaleString()}</strong>
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 10px;">
              (Includes Packing Material, Transportation and Labour Charges)
            </p>
          </div>
        ` : `
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e0e0e0;">
            <h3 style="color: #FF8C38; margin-top: 0;">Document Storage Quote</h3>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span>Monthly Rate:</span>
              <strong>₹${quote.monthlyRate?.toLocaleString()}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span>Total Items:</span>
              <strong>${quote.totalItems}</strong>
            </div>
            <hr style="border: 1px solid #e0e0e0; margin: 15px 0;">
            <div style="display: flex; justify-content: space-between; font-size: 18px;">
              <span>Total Cost:</span>
              <strong style="color: #FF8C38;">₹${quote.totalCost?.toLocaleString()}</strong>
            </div>
          </div>
        `}
        
        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="color: #2d5016; margin-top: 0;">What's Next?</h4>
          <p style="color: #2d5016; margin-bottom: 0;">Our team will contact you within 24 hours to confirm your requirements and schedule the pickup.</p>
        </div>
        
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h4 style="color: #FF8C38; margin-top: 0;">Need immediate assistance?</h4>
          <p style="font-size: 18px; font-weight: bold; color: #FF8C38; margin: 5px 0;">Call us: +91 9900056394</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="color: #666; font-size: 14px;">
            This quote is valid for 30 days. Final pricing may vary based on actual volume and requirements.
          </p>
          <p style="color: #666; font-size: 14px;">
            Thank you for choosing Storagians - Your trusted storage partner!
          </p>
        </div>
      </div>
    </div>
  `;
}

function generateCompanyBookingEmail(formData: any, quote: any): string {
  return generateCompanyQuoteEmail(formData, quote).replace(
    'New Storage Quote Request',
    'Storage Booking Confirmation - URGENT'
  ).replace(
    'Action Required: Please contact the customer within 24 hours',
    'BOOKING CONFIRMED: Customer is ready to proceed. Contact immediately to schedule pickup'
  );
}

function generateCustomerBookingEmail(formData: any, quote: any): string {
  return generateCustomerQuoteEmail(formData, quote).replace(
    'Your Storage Quote',
    'Booking Confirmation'
  ).replace(
    'Thank you for your interest in our storage services. Below is your personalized quote:',
    'Your storage booking has been confirmed! Our team will connect with you shortly to finalize the details.'
  );
}

serve(handler);