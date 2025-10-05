// app/api/phonepe/create-payment/route.js
import { connectDB } from "@/lib/mongodb";
import { phonepeFetchToken } from "../get-token/route";

// Temporary storage
const tempOrders = new Map();

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const { amountRupees, productTitle, productColor, form } = body;

    if (!form || !form.email || !form.phone) {
      return new Response(
        JSON.stringify({ error: "Customer details required" }), 
        { status: 400 }
      );
    }

    // Merchant Order ID
    const merchantOrderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    console.log("📝 Creating TEMPORARY order:", merchantOrderId);

    // Temporary storage
    tempOrders.set(merchantOrderId, {
      merchantOrderId,
      productTitle,
      productColor: productColor || "Standard",
      amount: Math.round(Number(amountRupees) * 100),
      customer: {
        firstName: form.firstName || "",
        lastName: form.lastName || "",
        email: form.email || "",
        phone: form.phone || "",
        address: form.address || "",
        city: form.city || "",
        state: form.state || "",
        pincode: form.pincode || "",
      },
      status: "PENDING",
      createdAt: new Date(),
    });

    console.log("💾 Temp order saved");

    // Get Token
    let token;
    try {
      token = await phonepeFetchToken();
      console.log("✅ Token received");
    } catch (tokenError) {
      console.error("❌ Token error:", tokenError);
      return new Response(
        JSON.stringify({ error: "Authentication failed" }), 
        { status: 401 }
      );
    }

    // ✅ FIX: Define baseUrl here
    const baseUrl = process.env.NEXTAUTH_URL || "https://greenphase.in";

    // ✅ CORRECT PAYMENT PAYLOAD
    const payload = {
      merchantOrderId: merchantOrderId,
      amount: Math.round(Number(amountRupees) * 100), // in paise
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      expireAfter: 900, // 15 minutes
      paymentFlow: {
        type: "PG_CHECKOUT",
        redirectUrl: `${baseUrl}/order-success?merchantOrderId=${merchantOrderId}`,
        redirectMode: "GET",
      },
      callbackUrl: `${baseUrl}/api/phonepe/webhook`,
      customer: {
        name: `${form.firstName || ""} ${form.lastName || ""}`.trim(),
        mobile: form.phone || "",
        email: form.email || "",
      },
      products: [{ 
        name: productTitle || "Product", 
        quantity: 1 
      }],
    };

    console.log("📦 Payment Payload:", JSON.stringify(payload, null, 2));

    // ✅ CORRECT PAYMENT ENDPOINT
    const paymentEndpoint = `${process.env.PHONEPE_API_BASE}/checkout/v2/pay`;
    console.log("🔄 Calling PhonePe API:", paymentEndpoint);

    const phonepeResponse = await fetch(paymentEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const phonepeData = await phonepeResponse.json();
    
    console.log("📞 PhonePe API Response:", JSON.stringify(phonepeData, null, 2));

    if (!phonepeResponse.ok) {
      console.error("❌ PhonePe API error:", phonepeData);
      tempOrders.delete(merchantOrderId);
      
      return new Response(
        JSON.stringify({ 
          error: phonepeData?.message || "Payment initiation failed" 
        }), 
        { status: phonepeResponse.status || 500 }
      );
    }

    // Extract redirect URL
    const redirectUrl = phonepeData?.data?.redirectUrl || 
                       phonepeData?.redirectUrl;

    if (!redirectUrl) {
      console.error("❌ No redirect URL:", phonepeData);
      tempOrders.delete(merchantOrderId);
      return new Response(
        JSON.stringify({ error: "No redirect URL received" }), 
        { status: 500 }
      );
    }

    console.log("🔗 Redirect URL:", redirectUrl);

    return new Response(
      JSON.stringify({ 
        success: true,
        merchantOrderId, 
        redirectUrl: redirectUrl,
        phonepeResponse: phonepeData,
      }), 
      { status: 200 }
    );

  } catch (err) {
    console.error("❌ Create payment error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error: " + err.message }), 
      { status: 500 }
    );
  }
}

export { tempOrders };