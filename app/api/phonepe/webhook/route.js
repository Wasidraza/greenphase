import Order from "@/models/Order";
import { connectDB } from "@/lib/mongodb";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const merchantOrderId = body?.merchantOrderId;
    const status = body?.status;
    const phonepeOrderId = body?.orderId || "";

    if (!merchantOrderId) {
      return new Response(JSON.stringify({ error: "merchantOrderId missing" }), { status: 400 });
    }

    // Find the order in DB
    const order = await Order.findOne({ merchantOrderId });
    if (!order) {
      return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
    }

    // Update order status
    order.status = status;
    order.phonepeOrderId = phonepeOrderId;
    order.updatedAt = new Date();
    await order.save();

    console.log(`📩 Webhook hit for order: ${merchantOrderId}, status: ${status}`);

    // Nodemailer transporter setup for domain email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_PORT || 587),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // sale@greenphase.in
        pass: process.env.EMAIL_PASS, // app password or actual password
      },
    });

    // Email content function
    const getEmailOptions = (status) => {
      if (!order.customer.email) return null;

      if (status === "SUCCESS") {
        return {
          from: `"Green Chargers" <${process.env.EMAIL_USER}>`,
          to: order.customer.email,
          subject: `Thank you for your order – ${order.productTitle}`,
          html: `
            <h2>Hello ${order.customer.firstName} ${order.customer.lastName},</h2>
            <p>Thank you for your order!</p>
            <h3>Order Details:</h3>
            <ul>
              <li><strong>Order ID:</strong> ${order.merchantOrderId}</li>
              <li><strong>Product:</strong> ${order.productTitle}</li>
              <li><strong>Amount:</strong> ₹${(order.amount / 100).toLocaleString("en-IN")}</li>
              <li><strong>Delivery Address:</strong> ${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}</li>
              <li><strong>Phone:</strong> ${order.customer.phone}</li>
            </ul>
            <p>We will deliver your order soon. Thank you for shopping with us!</p>
            <p>– Green Chargers Team</p>
          `,
        };
      }

      // OPTIONAL: failed payment email
      if (status === "FAILED") {
        return {
          from: `"Green Chargers" <${process.env.EMAIL_USER}>`,
          to: order.customer.email,
          subject: `Payment Failed – ${order.productTitle}`,
          html: `
            <h2>Hello ${order.customer.firstName} ${order.customer.lastName},</h2>
            <p>Unfortunately, your payment could not be processed.</p>
            <p>Order ID: <strong>${order.merchantOrderId}</strong></p>
            <p>Please try again or contact support if needed.</p>
            <p>– Green Chargers Team</p>
          `,
        };
      }

      return null;
    };

    // Send email if applicable
    const mailOptions = getEmailOptions(status);
    if (mailOptions) {
      try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to: ${order.customer.email} for status: ${status}`);
      } catch (mailErr) {
        console.error("Email send failed:", mailErr);
      }
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
