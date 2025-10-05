import { connectDB } from "@/lib/mongodb";
import { phonepeFetchToken } from "../get-token/route";
import { tempOrders } from "../webhook/route"; 

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

    if (!amountRupees || !productTitle) {
      return new Response(
        JSON.stringify({ error: "Amount and product title are required" }),
        { status: 400 }
      );
    }

    // Merchant Order ID generate karo
    const merchantOrderId = `ORDER_${Date.now()}_${Math.floor(
      Math.random() * 10000
    )}`;

    console.log("📝 Creating TEMPORARY order (not in DB):", merchantOrderId);

    // ✅ IMPORTANT: Database mein MAT save karo
    // Sirf memory mein temporary store karo
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

    console.log("✅ Temporary order stored in memory");

    // PhonePe payload
    const payload = {
      merchantOrderId,
      amount: Math.round(Number(amountRupees) * 100),
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      expireAfter: 900,
      paymentFlow: {
        type: "PG_CHECKOUT",
        redirectUrl: `${process.env.NEXTAUTH_URL}/order-status?merchantOrderId=${merchantOrderId}`,
        redirectMode: "GET",
      },
      callbackUrl: `${process.env.NEXTAUTH_URL}/api/phonepe/webhook`,
      customer: {
        name: `${form.firstName || ""} ${form.lastName || ""}`.trim(),
        mobile: form.phone || "",
        email: form.email || "",
      },
      products: [
        {
          name: productTitle || "Product",
          quantity: 1,
        },
      ],
    };

    console.log("🔄 Calling PhonePe API...");

    // PhonePe API Call
    const token = await phonepeFetchToken();

    const phonepeResponse = await fetch(
      `${process.env.PHONEPE_API_BASE}/checkout/v2/pay`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `O-Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const phonepeData = await phonepeResponse.json();

    if (!phonepeResponse.ok) {
      console.error("❌ PhonePe API error:", phonepeData);

      // Rollback - temporary order delete karo
      tempOrders.delete(merchantOrderId);
      console.log("🗑️ Temporary order deleted due to PhonePe failure");

      return new Response(
        JSON.stringify({
          error:
            phonepeData?.error?.message ||
            phonepeData?.message ||
            "Payment initiation failed",
        }),
        { status: phonepeResponse.status || 500 }
      );
    }

    console.log("✅ PhonePe payment initiated successfully");

    return new Response(
      JSON.stringify({
        success: true,
        merchantOrderId,
        phonepeResponse: phonepeData,
        message:
          "Payment initiated - order will save after payment confirmation",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("❌ Create payment error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error: " + err.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
