// app/api/phonepe/get-token/route.js
export async function phonepeFetchToken() {
  try {
    console.log("🔐 Fetching token...");
    
    const authPayload = {
      clientId: process.env.PHONEPE_CLIENT_ID,
      clientSecret: process.env.PHONEPE_CLIENT_SECRET,
      merchantId: process.env.PHONEPE_MERCHANT_ID
    };

    console.log("📦 Auth payload details:", {
      clientId: process.env.PHONEPE_CLIENT_ID ? "SET" : "MISSING",
      clientSecret: process.env.PHONEPE_CLIENT_SECRET ? "SET" : "MISSING", 
      merchantId: process.env.PHONEPE_MERCHANT_ID ? "SET" : "MISSING",
      authBase: process.env.PHONEPE_AUTH_BASE
    });

    // ✅ CORRECT AUTH ENDPOINT
    const authUrl = `${process.env.PHONEPE_AUTH_BASE}/v1/oauth/token`;
    console.log("🔄 Calling Auth API:", authUrl);

    const response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authPayload),
    });

    console.log("🔑 Auth API Status:", response.status);
    
    const data = await response.json();
    console.log("🔑 Auth API Response:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.status} - ${data.message || 'Unknown error'}`);
    }

    if (!data.access_token) {
      throw new Error(`No access token received: ${data.message || 'Token missing'}`);
    }

    console.log("✅ Token received successfully");
    return data.access_token;
  } catch (error) {
    console.error('❌ Token fetch error:', error.message);
    throw error;
  }
}