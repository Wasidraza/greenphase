import Order from "@/models/Order";
import { connectDB } from "@/lib/mongodb";
import { phonepeFetchToken } from "../get-token/route";
import { NextResponse } from "next/server";

// ✅ Temporary storage for order data (payment confirm hone tak)
const tempOrders = new Map();

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      amountRupees,
      productTitle,
      form,
      productColor = "Standard",
      power = "-",
    } = body;

    if (!form) {
      return NextResponse.json({ error: "Form data missing" }, { status: 400 });
    }
    if (!amountRupees || !productTitle) {
      return NextResponse.json(
        { error: "Amount or product title missing" },
        { status: 400 }
      );
    }

    const merchantOrderId = `ORDER_${Date.now()}_${Math.floor(
      Math.random() * 10000
    )}`;

    // ✅ TEMPORARY STORAGE
    const tempOrderData = {
      merchantOrderId,
      productTitle,
      productColor,
      power,
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
      createdAt: new Date(),
    };

    tempOrders.set(merchantOrderId, tempOrderData);
    console.log("💾 Order data saved in temp storage:", merchantOrderId);

    const payload = {
      merchantOrderId,
      amount: tempOrderData.amount,
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      expireAfter: 900,
      paymentFlow: {
        type: "PG_CHECKOUT",
        redirectUrl: `${process.env.MERCHANT_REDIRECT_URL}?merchantOrderId=${merchantOrderId}`,
        redirectMode: "GET",
      },
      callbackUrl: process.env.PHONEPE_CALLBACK_URL,
      customer: {
        name: `${form.firstName || ""} ${form.lastName || ""}`.trim(),
        mobile: form.phone || "",
        email: form.email || "",
      },
      products: [
        {
          name: productTitle || "Product",
          quantity: 1,
          color: productColor,
          power: power,
        },
      ],
    };

    console.log("📦 Payment payload to PhonePe:", payload);

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

    console.log(
      "📩 PhonePe API Response:",
      JSON.stringify(phonepeData, null, 2)
    );

    if (!phonepeResponse.ok) {
      console.error("❌ PhonePe payment failed:", phonepeData);
      tempOrders.delete(merchantOrderId);
      return NextResponse.json(
        {
          error:
            phonepeData?.error?.message ||
            phonepeData?.message ||
            "PhonePe payment initiation failed",
          details: phonepeData,
        },
        { status: phonepeResponse.status || 500 }
      );
    }

    console.log("✅ PhonePe payment initiated successfully:", merchantOrderId);

    // ✅ FIX: PhonePe UAT ke liye direct URL generate karo
    const finalRedirectUrl = `https://mercury-uat.phonepe.com/transact/checkout?orderId=${merchantOrderId}&merchantId=${process.env.PHONEPE_MERCHANT_ID}`;

    console.log("🎯 Redirect URL:", finalRedirectUrl);

    return NextResponse.json({
      success: true,
      merchantOrderId,
      redirectUrl: finalRedirectUrl,
      message: "Payment initiated successfully - redirecting to PhonePe",
      phonepeResponse: phonepeData, // Debug ke liye
    });
  } catch (err) {
    console.error("❌ POST /api/phonepe/create-payment error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ... remaining code ...

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (err) {
    console.error("GET /api/phonepe/create-payment error:", err);
    return NextResponse.json(
      { success: false, error: "Server error while fetching orders" },
      { status: 500 }
    );
  }
}

// ✅ Export tempOrders for webhook to use
export { tempOrders };
