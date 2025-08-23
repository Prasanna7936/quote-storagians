import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CallbackRequest {
  name: string;
  mobile: string;
  email?: string;
  remarks?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, mobile, email, remarks }: CallbackRequest = await req.json();

    console.log("📧 Received callback request:", { name, mobile, email: email || 'Not provided' });

    // Prepare professional email content for ZOHO Mail
    const emailSubject = `🔔 New Callback Request - ${name}`;
    
    const emailHtml = `
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
    <div style="background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0;">📞 New Callback Request - Storagians</h2>
    </div>
    
    <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb;">
        <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <p style="margin: 0; font-weight: bold; color: #dc2626;">⚡ URGENT: Customer requesting callback</p>
        </div>
        
        <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #2563eb;">
            <p><strong>👤 Customer Name:</strong> ${name}</p>
            <p><strong>📱 Mobile Number:</strong> <a href="tel:${mobile}" style="color: #2563eb;">${mobile}</a></p>
            <p><strong>📧 Email Address:</strong> ${email ? `<a href="mailto:${email}" style="color: #2563eb;">${email}</a>` : 'Not provided'}</p>
            <p><strong>💬 Customer Remarks:</strong> ${remarks || 'None provided'}</p>
            <p><strong>⏰ Received:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
        </div>
        
        <div style="background: #dcfce7; padding: 15px; border-radius: 6px; margin-top: 20px;">
            <p style="margin: 0;"><strong>📋 Action Required:</strong> Please contact this customer as soon as possible to provide storage solutions.</p>
        </div>
    </div>
    
    <div style="background: #374151; color: white; padding: 15px; border-radius: 0 0 8px 8px; font-size: 12px;">
        <p style="margin: 0;">This is an automated notification from the Storagians website.</p>
    </div>
</body>
</html>`;

    const emailText = `
New Callback Request - Storagians

Customer Details:
- Name: ${name}
- Mobile: ${mobile}
- Email: ${email || 'Not provided'}
- Remarks: ${remarks || 'None'}
- Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

URGENT: Please contact this customer as soon as possible.
    `;

    // Send email using Resend
    console.log("📧 Sending callback request email...");
    
    const emailResponse = await resend.emails.send({
      from: "Storagians <onboarding@resend.dev>", // Using Resend's verified domain
      to: ["prasanna.7936@gmail.com"], // Send to your verified email
      subject: emailSubject,
      html: emailHtml,
      text: emailText,
    });

    console.log("📧 Resend API response:", JSON.stringify(emailResponse, null, 2));
    
    // Check if there's an error in the response
    if (emailResponse.error) {
      console.error("❌ Resend API error:", emailResponse.error);
      throw new Error(`Email sending failed: ${emailResponse.error.message || emailResponse.error}`);
    }
    
    if (!emailResponse.data) {
      console.error("❌ No data in email response:", emailResponse);
      throw new Error("Email sending failed: No response data");
    }
    
    console.log("✅ Email sent successfully with ID:", emailResponse.data.id);

    return new Response(
      JSON.stringify({ 
        message: "Callback request sent successfully",
        details: { name, mobile, email: email || 'Not provided' }
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
    console.error("Error in send-callback-email function:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send callback request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);