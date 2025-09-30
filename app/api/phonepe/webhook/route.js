import Order from "@/models/Order";
import { connectDB } from "@/lib/mongodb";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const responseData = body?.response?.data || {};
    const merchantOrderId = responseData.merchantTransactionId;
    const statusCode = body?.response?.code;
    const phonepeOrderId = responseData.transactionId || "";

    let status = "PENDING";
    if (statusCode === "PAYMENT_SUCCESS") status = "SUCCESS";
    if (statusCode === "PAYMENT_ERROR") status = "FAILED";

    if (!merchantOrderId) {
      return new Response(
        JSON.stringify({ error: "merchantOrderId missing" }),
        { status: 400 }
      );
    }
    console.log("📦 Webhook payload:", JSON.stringify(body, null, 2));

    const order = await Order.findOne({ merchantOrderId });
    if (!order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
      });
    }

    order.status = status;
    order.phonepeOrderId = phonepeOrderId;
    order.updatedAt = new Date();
    await order.save();

    console.log(
      `📩 Webhook hit for order: ${merchantOrderId}, status: ${status}`
    );

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_PORT || 587),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const getEmailOptions = (status) => {
      if (!order.customer.email) return null;

      if (status === "SUCCESS") {
        return {
          from: `"Green Chargers" <${process.env.EMAIL_USER}>`,
          to: order.customer.email,
          subject: `Thank you for your order – ${order.productTitle}`,
          html: `
            <h2>Hello ${order.customer.firstName} ${
            order.customer.lastName
          },</h2>
            <p>Thank you for your order!</p>
            <h3>Order Details:</h3>
            <ul>
              <li><strong>Order ID:</strong> ${order.merchantOrderId}</li>
              <li><strong>Product:</strong> ${order.productTitle}</li>
              <li><strong>Amount:</strong> ₹${(
                order.amount / 100
              ).toLocaleString("en-IN")}</li>
              <li><strong>Delivery Address:</strong> ${
                order.customer.address
              }, ${order.customer.city}, ${order.customer.state} - ${
            order.customer.pincode
          }</li>
              <li><strong>Phone:</strong> ${order.customer.phone}</li>
            </ul>
            <p>We will deliver your order soon. Thank you for shopping with us!</p>
            <p>– Green Chargers Team</p>
          `,
        };
      }

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

    const mailOptions = getEmailOptions(status);
    if (mailOptions) {
      try {
        await transporter.sendMail(mailOptions);
        console.log(
          `Email sent to: ${order.customer.email} for status: ${status}`
        );
      } catch (mailErr) {
        console.error("Email send failed:", mailErr);
      }
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
