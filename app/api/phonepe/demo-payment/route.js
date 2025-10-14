// app/api/phonepe/demo-payment/route.js
import { NextResponse } from "next/server";
import { tempOrders } from '../create-payment/route';

export async function POST(req) {
  try {
    const body = await req.json();
    const { amountRupees, productTitle, form, productColor = "Standard", power = "-" } = body;

    if (!form || !amountRupees || !productTitle) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const merchantOrderId = `DEMO_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Store in temporary storage
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
    console.log("💾 Demo order saved:", merchantOrderId);

    // Direct to success page
    const redirectUrl = `/order-success?merchantOrderId=${merchantOrderId}&demo=true`;

    return NextResponse.json({
      success: true,
      merchantOrderId,
      redirectUrl,
      message: "DEMO MODE - Payment simulation successful"
    });

  } catch (err) {
    console.error("❌ Demo payment error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}