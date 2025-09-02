// app/api/verify-payment/route.js
import crypto from "crypto";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Setup transporter once (example: SendGrid SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendConfirmationEmail(toEmail, orderDetails) {
  const html = `
    <p>Hi,</p>
    <p>Thank you — your order has been received.</p>
    <p><b>Order ID:</b> ${orderDetails.razorpay_order_id}</p>
    <p><b>Payment ID:</b> ${orderDetails.razorpay_payment_id}</p>
    <p>Regards,<br/>Your Company</p>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: toEmail,
    subject: "Your order is confirmed",
    html,
  });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email, meta } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment data" }, { status: 400 });
    }

    // verify signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      console.warn("Signature mismatch", generated_signature, razorpay_signature);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // TODO: mark order as paid in DB (save razorpay_* fields + meta/user info)
    // Example: await OrderModel.create({ ... })

    // Send confirmation email if email present
    if (email) {
      try {
        await sendConfirmationEmail(email, { razorpay_order_id, razorpay_payment_id, meta });
      } catch (mailErr) {
        console.error("Email send error:", mailErr);
        // don't fail the whole flow for email errors
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("verify-payment error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
