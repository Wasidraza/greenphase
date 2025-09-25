// import Order from "@/models/Order";
// import { connectDB } from "@/lib/mongodb";
// import { phonepeFetchToken } from "../get-token/route";

// export async function POST(req) {
//   try {
//     await connectDB();
//     const body = await req.json();
//     const { amountRupees, productTitle, form } = body;
//     const merchantOrderId = `ORDER_${Date.now()}_${Math.floor(
//       Math.random() * 10000
//     )}`;

//     const payload = {
//       merchantOrderId,
//       amount: Math.round(Number(amountRupees) * 100),
//       merchantId: process.env.PHONEPE_MERCHANT_ID,
//       expireAfter: 900,
//       paymentFlow: {
//         type: "PG_CHECKOUT",
//         redirectUrl: process.env.MERCHANT_REDIRECT_URL,
//         redirectMode: "GET",
//       },
//       customer: {
//         name: `${form?.firstName || ""} ${form?.lastName || ""}`.trim(),
//         mobile: form?.phone || "",
//         email: form?.email || "",
//       },
//       products: [{ name: productTitle || "Product", quantity: 1 }],
//     };

//     // **Save order as PENDING**
//     await Order.create({
//       merchantOrderId,
//       productTitle,
//       amount: payload.amount,
//       customer: {
//         firstName: form?.firstName,
//         lastName: form?.lastName,
//         email: form?.email,
//         phone: form?.phone,
//         address: form?.address,
//         city: form?.city,
//         state: form?.state,
//         pincode: form?.pincode,
//       },
//       status: "PENDING",
//     });

//     const token = await phonepeFetchToken();

//     const res = await fetch(`${process.env.PHONEPE_API_BASE}/checkout/v2/pay`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `O-Bearer ${token}`,
//         "X-CALLBACK-URL": process.env.PHONEPE_CALLBACK_URL || "",
//       },
//       body: JSON.stringify(payload),
//     });

//     const data = await res.json();
//     if (!res.ok) {
//       return new Response(
//         JSON.stringify({ error: data || "PhonePe pay failed" }),
//         { status: res.status || 500 }
//       );
//     }

//     return new Response(
//       JSON.stringify({ merchantOrderId, phonepeResponse: data }),
//       { status: 200, headers: { "Content-Type": "application/json" } }
//     );
//   } catch (err) {
//     return new Response(JSON.stringify({ error: err.message }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }

// export async function GET() {
//   try {
//     await connectDB();

//     const orders = await Order.find().sort({ createdAt: -1 });

//     return NextResponse.json({ success: true, orders }, { status: 200 });
//   } catch (err) {
//     console.error("GET /api/phonepe/create-payment error:", err);
//     return NextResponse.json(
//       { success: false, error: "Server error while fetching orders" },
//       { status: 500 }
//     );
//   }
// }



import Order from "@/models/Order";
import { connectDB } from "@/lib/mongodb";
import { phonepeFetchToken } from "../get-token/route";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    console.log("📥 Incoming checkout body:", body);

    const { amountRupees, productTitle, form } = body;

    if (!form) {
      return new Response(JSON.stringify({ error: "Form data missing" }), {
        status: 400,
      });
    }

    const merchantOrderId = `ORDER_${Date.now()}_${Math.floor(
      Math.random() * 10000
    )}`;

    const payload = {
      merchantOrderId,
      amount: Math.round(Number(amountRupees) * 100),
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      expireAfter: 900,
      paymentFlow: {
        type: "PG_CHECKOUT",
        redirectUrl: process.env.MERCHANT_REDIRECT_URL,
        redirectMode: "GET",
      },
      customer: {
        name: `${form.firstName || ""} ${form.lastName || ""}`.trim(),
        mobile: form.phone || "",
        email: form.email || "",
      },
      products: [{ name: productTitle || "Product", quantity: 1 }],
    };

    // ✅ Save order in DB
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

    console.log("✅ Order saved in DB:", newOrder);

    const token = await phonepeFetchToken();

    const res = await fetch(`${process.env.PHONEPE_API_BASE}/checkout/v2/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `O-Bearer ${token}`,
        "X-CALLBACK-URL": process.env.PHONEPE_CALLBACK_URL || "",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("❌ PhonePe payment failed:", data);
      return new Response(
        JSON.stringify({ error: data || "PhonePe pay failed" }),
        { status: res.status || 500 }
      );
    }

    return new Response(
      JSON.stringify({ merchantOrderId, phonepeResponse: data }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("❌ POST /api/phonepe/create-payment error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (err) {
    console.error("❌ GET /api/phonepe/create-payment error:", err);
    return NextResponse.json(
      { success: false, error: "Server error while fetching orders" },
      { status: 500 }
    );
  }
}
