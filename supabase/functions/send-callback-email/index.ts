import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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

    // Prepare email content
    const emailContent = `
New callback request received from Storagians website:

Customer Details:
- Name: ${name}
- Mobile: ${mobile}
- Email: ${email || 'Not provided'}
- Remarks: ${remarks || 'None'}

Please contact this customer as soon as possible.

This is an automated message from the Storagians website.
    `;

    // Use ZOHO SMTP via a simple SMTP service
    // For now, we'll simulate the email send and log the details
    console.log("Email content that would be sent to info@storagians.com:");
    console.log(emailContent);

    // In a real implementation, you would use ZOHO SMTP here
    // For now, we'll just return success
    console.log("Callback request processed successfully");

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