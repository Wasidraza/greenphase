import Order from "@/models/Order";
import { connectDB } from "@/lib/mongodb";
import nodemailer from "nodemailer";

export async function POST(req) {
  console.log("📩 Webhook hit!");

  try {
    await connectDB();

    const body = await req.json();
    console.log("📦 Raw Webhook Body:", JSON.stringify(body, null, 2));

    // 🔍 Handle all possible PhonePe payload shapes
    const data =
      body.data || body.response?.data || body.response || body || {};

    // 🧠 Extract merchantOrderId safely (from any structure)
    const merchantOrderId =
      data.merchantTransactionId ||
      data.merchantOrderId ||
      data.merchantOrderID ||
      data.orderId ||
      body.merchantTransactionId ||
      body.merchantOrderId;

    const statusCode =
      data.code || data.responseCode || body.code || body.responseCode || "";

    const phonepeOrderId =
      data.transactionId || data.transaction_id || body.transactionId || "";

    if (!merchantOrderId) {
      console.error("No merchantOrderId found in webhook!");
      return new Response(
        JSON.stringify({ error: "merchantOrderId missing" }),
        { status: 400 }
      );
    }

    // 🔁 Determine payment status
    let status = "PENDING";
    if (
      statusCode === "PAYMENT_SUCCESS" ||
      data.state === "COMPLETED" ||
      data.status === "SUCCESS"
    ) {
      status = "SUCCESS";
    } else if (
      statusCode === "PAYMENT_FAILED" ||
      statusCode === "PAYMENT_ERROR" ||
      data.state === "FAILED" ||
      data.status === "FAILED"
    ) {
      status = "FAILED";
    }

    // 🧾 Find order and update it
    const order = await Order.findOne({ merchantOrderId });
    if (!order) {
      console.error("Order not found for merchantOrderId:", merchantOrderId);
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
      });
    }

    order.status = status;
    order.phonepeOrderId = phonepeOrderId;
    order.updatedAt = new Date();
    await order.save();

    console.log(`Order updated: ${merchantOrderId} → ${status}`);

    // 📧 Optional: Send email if order has customer email
    if (order.customer?.email) {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || "smtp.gmail.com",
        port: Number(process.env.EMAIL_PORT || 587),
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const emailSubject =
        status === "SUCCESS"
          ? `Payment Successful – ${order.productTitle}`
          : `Payment Failed – ${order.productTitle}`;

      const emailHTML =
        status === "SUCCESS"
          ? `<h2>Hello ${order.customer.firstName} ${
              order.customer.lastName
            },</h2>
             <p>Your payment for <strong>${
               order.productTitle
             }</strong> was successful!</p>
             <p>Order ID: <strong>${order.merchantOrderId}</strong></p>
             <p>Amount: ₹${(order.amount / 100).toLocaleString("en-IN")}</p>`
          : `<h2>Hello ${order.customer.firstName} ${order.customer.lastName},</h2>
             <p>Unfortunately, your payment could not be completed.</p>
             <p>Order ID: <strong>${order.merchantOrderId}</strong></p>`;

      await transporter.sendMail({
        from: `"Green Chargers" <${process.env.EMAIL_USER}>`,
        to: order.customer.email,
        subject: emailSubject,
        html: emailHTML,
      });

      console.log("Email sent to:", order.customer.email);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
