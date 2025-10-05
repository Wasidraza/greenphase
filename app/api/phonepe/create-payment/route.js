import Order from "@/models/Order";
import { connectDB } from "@/lib/mongodb";
import { phonepeFetchToken } from "../get-token/route";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const { amountRupees, productTitle, form } = body;

    if (!form) {
      return NextResponse.json({ error: "Form data missing" }, { status: 400 });
    }
    if (!amountRupees || !productTitle) {
      return NextResponse.json(
        { error: "Amount or product title missing" },
        { status: 400 }
      );
    }

    // 🧾 Generate unique merchant order ID
    const merchantOrderId = `ORDER_${Date.now()}_${Math.floor(
      Math.random() * 10000
    )}`;

    // ✅ Build the payload according to PhonePe v2 format
    const payload = {
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      merchantOrderId,
      amount: Math.round(Number(amountRupees) * 100),
      currency: "INR",
      expireAfter: 900,
      redirectUrl: `${process.env.MERCHANT_REDIRECT_URL}?merchantOrderId=${merchantOrderId}`,
      redirectMode: "GET",
      callbackUrl: process.env.PHONEPE_CALLBACK_URL,
      paymentInstrument: { type: "PAY_PAGE" },
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

    // 🧠 Save Order in DB (Pending)
    const newOrder = await Order.create({
      merchantOrderId,
      productTitle,
      amount: payload.amount,
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
    });

    console.log("Order saved:", newOrder.merchantOrderId);

    // 🔑 Fetch access token
    const token = await phonepeFetchToken();

    // 🚀 Send payment request
    const res = await fetch(`${process.env.PHONEPE_API_BASE}/checkout/v2/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `O-Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("PhonePe payment failed:", data);
      return NextResponse.json(
        { error: data?.error || data?.message || "PhonePe pay failed" },
        { status: res.status || 500 }
      );
    }

    return NextResponse.json(
      { merchantOrderId, phonepeResponse: data },
      { status: 200 }
    );
  } catch (err) {
    console.error("🔥 Error in /api/phonepe/create-payment:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

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
