import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

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

    console.log("Received callback request:", { name, mobile, email: email || 'Not provided' });

    // Create SMTP client for ZOHO
    const client = new SMTPClient({
      connection: {
        hostname: "smtp.zoho.com",
        port: 587,
        tls: true,
        auth: {
          username: Deno.env.get("ZOHO_EMAIL") || "",
          password: Deno.env.get("ZOHO_EMAIL_PASSWORD") || "",
        },
      },
    });

    // Prepare professional email template
    const emailSubject = "🔔 New Callback Request - Storagians";
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .footer { background: #374151; color: white; padding: 15px; border-radius: 0 0 8px 8px; font-size: 12px; }
        .details { background: white; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #2563eb; }
        .label { font-weight: bold; color: #1f2937; }
        .urgent { color: #dc2626; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>📞 New Callback Request Received</h2>
        </div>
        <div class="content">
            <p class="urgent">⚡ URGENT: Customer requesting callback</p>
            
            <div class="details">
                <p><span class="label">👤 Customer Name:</span> ${name}</p>
                <p><span class="label">📱 Mobile Number:</span> <a href="tel:${mobile}">${mobile}</a></p>
                <p><span class="label">📧 Email Address:</span> ${email ? `<a href="mailto:${email}">${email}</a>` : 'Not provided'}</p>
                <p><span class="label">💬 Customer Remarks:</span> ${remarks || 'None provided'}</p>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 0;"><strong>⏰ Action Required:</strong> Please contact this customer as soon as possible to provide them with storage solutions.</p>
            </div>
        </div>
        <div class="footer">
            <p style="margin: 0;">This is an automated notification from the Storagians website contact form.</p>
            <p style="margin: 5px 0 0 0;">Received on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
        </div>
    </div>
</body>
</html>`;

    // Send email
    await client.send({
      from: Deno.env.get("ZOHO_EMAIL") || "",
      to: "info@storagians.com",
      subject: emailSubject,
      content: "auto",
      html: emailHtml,
    });

    // Close SMTP connection
    await client.close();

    console.log("✅ Email sent successfully to info@storagians.com");
    console.log("Customer details:", { name, mobile, email: email || 'Not provided' });

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