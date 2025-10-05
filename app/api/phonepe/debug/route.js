// app/api/phonepe/debug/route.js
export async function GET() {
  try {
    const envDetails = {
      PHONEPE_CLIENT_ID: process.env.PHONEPE_CLIENT_ID ? "SET" : "MISSING",
      PHONEPE_CLIENT_SECRET: process.env.PHONEPE_CLIENT_SECRET ? "SET" : "MISSING", 
      PHONEPE_MERCHANT_ID: process.env.PHONEPE_MERCHANT_ID ? "SET" : "MISSING",
      PHONEPE_AUTH_BASE: process.env.PHONEPE_AUTH_BASE || "NOT SET",
      PHONEPE_API_BASE: process.env.PHONEPE_API_BASE || "NOT SET",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NOT SET"
    };

    console.log("🔍 Environment Check:", envDetails);

    return new Response(JSON.stringify({
      success: true,
      environment: envDetails,
      message: "Debug information"
    }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}