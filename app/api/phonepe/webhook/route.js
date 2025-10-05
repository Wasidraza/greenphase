import Order from "@/models/Order";
import { connectDB } from "@/lib/mongodb";
import nodemailer from "nodemailer";

export async function POST(req) {
  console.log("Webhook received from PhonePe");

  try {
    await connectDB();
    const body = await req.json();

    console.log("📦 Webhook Raw Body:", JSON.stringify(body, null, 2));

    const data =
      body.data || body.response?.data || body.response || body || {};

    const merchantOrderId =
      data.merchantTransactionId ||
      data.merchantOrderId ||
      data.merchantOrderID ||
      data.orderId ||
      body.merchantTransactionId ||
      body.merchantOrderId;

    const phonepeOrderId =
      data.transactionId ||
      data.transaction_id ||
      body.transactionId ||
      body.transaction_id ||
      null;

    const statusCode =
      data.code || data.responseCode || body.code || body.responseCode || "";

    const state = data.state || body.state || data.status || body.status || "";

    if (!merchantOrderId) {
      console.error("Missing merchantOrderId in webhook payload");
      return new Response(
        JSON.stringify({ error: "merchantOrderId missing" }),
        { status: 400 }
      );
    }

    // 🧠 Determine status properly
    let status = "PENDING";
    if (
      statusCode === "PAYMENT_SUCCESS" ||
      state === "COMPLETED" ||
      state === "SUCCESS"
    ) {
      status = "SUCCESS";
    } else if (
      statusCode === "PAYMENT_FAILED" ||
      state === "FAILED" ||
      state === "PAYMENT_ERROR"
    ) {
      status = "FAILED";
    }

    // 🔍 Find & update the order
    const order = await Order.findOne({ merchantOrderId });
    if (!order) {
      console.error(`Order not found: ${merchantOrderId}`);
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
      });
    }

    // 📝 Update DB
    order.status = status;
    order.phonepeOrderId = phonepeOrderId || order.phonepeOrderId;
    order.updatedAt = new Date();
    await order.save();

    console.log(`✅ Order updated → ${merchantOrderId} : ${status}`);

    // 📧 Send confirmation email (if customer email exists)
    if (order.customer?.email) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST || "smtp.gmail.com",
          port: Number(process.env.EMAIL_PORT || 587),
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const subject =
          status === "SUCCESS"
            ? `Payment Successful – ${order.productTitle}`
            : `Payment Failed – ${order.productTitle}`;

        const html =
          status === "SUCCESS"
            ? `
              <h2>Hello ${order.customer.firstName} ${
                order.customer.lastName
              },</h2>
              <p>Your payment for <strong>${
                order.productTitle
              }</strong> was successful!</p>
              <p><strong>Order ID:</strong> ${order.merchantOrderId}</p>
              <p><strong>Amount:</strong> ₹${(
                order.amount / 100
              ).toLocaleString("en-IN")}</p>
              <p>Thank you for shopping with <strong>Green Phase</strong> ⚡</p>
            `
            : `
              <h2>Hello ${order.customer.firstName} ${order.customer.lastName},</h2>
              <p>Unfortunately, your payment for <strong>${order.productTitle}</strong> failed.</p>
              <p><strong>Order ID:</strong> ${order.merchantOrderId}</p>
              <p>You can retry the payment on our website anytime.</p>
            `;

        await transporter.sendMail({
          from: `"Green Phase" <${process.env.EMAIL_USER}>`,
          to: order.customer.email,
          subject,
          html,
        });

        console.log("📧 Email sent →", order.customer.email);
      } catch (emailErr) {
        console.warn("Email sending failed:", emailErr.message);
      }
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(" Webhook error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
