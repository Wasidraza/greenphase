// app/api/phonepe/create-payment/route.js
import { connectDB } from "@/lib/mongodb";
import { phonepeFetchToken } from "../get-token/route";
import { setTempOrder, deleteTempOrder } from "../utils/shared-storage/route";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const { amountRupees, productTitle, productColor, form } = body;

    if (!form || !form.email || !form.phone) {
      return new Response(
        JSON.stringify({ error: "Customer email and phone are required" }), 
        { status: 400 }
      );
    }

    // Merchant Order ID
    const merchantOrderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    console.log("📝 Creating TEMPORARY order:", merchantOrderId);

    // ✅ Temporary storage mein save karo (Database mein nahi)
    setTempOrder(merchantOrderId, {
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

    // ✅ CORRECT URLS
    const baseUrl = process.env.NEXTAUTH_URL;
    const redirectUrl = `${baseUrl}/order-success`;
    const callbackUrl = `${baseUrl}/api/phonepe/webhook`;

    console.log("🔗 Using URLs:", { baseUrl, redirectUrl, callbackUrl });

    const payload = {
      merchantOrderId,
      amount: Math.round(Number(amountRupees) * 100),
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      expireAfter: 900,
      paymentFlow: {
        type: "PG_CHECKOUT",
        redirectUrl: `${redirectUrl}?merchantOrderId=${merchantOrderId}`,
        redirectMode: "REDIRECT",
      },
      callbackUrl: callbackUrl,
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

    console.log("🔄 Calling PhonePe API...");

    const token = await phonepeFetchToken();

    const phonepeResponse = await fetch(`${process.env.PHONEPE_API_BASE}/checkout/v2/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `O-Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const phonepeData = await phonepeResponse.json();

    if (!phonepeResponse.ok) {
      console.error("❌ PhonePe API error:", phonepeData);
      deleteTempOrder(merchantOrderId);
      
      return new Response(
        JSON.stringify({ 
          error: phonepeData?.error?.message || "Payment initiation failed" 
        }), 
        { status: phonepeResponse.status || 500 }
      );
    }

    console.log("✅ PhonePe response received");

    // ✅ PhonePe se redirect URL extract karo
    const phonepeRedirectUrl = 
      phonepeData?.data?.redirectUrl || 
      phonepeData?.redirectUrl ||
      phonepeData?.redirect_url;

    if (!phonepeRedirectUrl) {
      console.error("❌ No redirect URL from PhonePe");
      deleteTempOrder(merchantOrderId);
      return new Response(
        JSON.stringify({ 
          error: "No redirect URL received from payment gateway"
        }), 
        { status: 500 }
      );
    }

    console.log("🔗 PhonePe Redirect URL:", phonepeRedirectUrl);

    return new Response(
      JSON.stringify({ 
        success: true,
        merchantOrderId, 
        redirectUrl: phonepeRedirectUrl,
        phonepeResponse: phonepeData,
      }), 
      { 
        status: 200, 
        headers: { "Content-Type": "application/json" } 
      }
    );

  } catch (err) {
    console.error("❌ Create payment error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error: " + err.message }), 
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
}