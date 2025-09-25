// import Order from '@/models/Order';

// export async function POST(req) {
//   try {
//     const body = await req.json();

//     const merchantOrderId = body?.merchantOrderId;
//     const status = body?.status;

//     await Order.updateOne(
//       { merchantOrderId },
//       { status, updatedAt: new Date(), phonepeOrderId: body?.orderId || '' }
//     );

//     return new Response(JSON.stringify({ success: true }), { status: 200 });
//   } catch (err) {
//     return new Response(JSON.stringify({ error: err.message }), { status: 500 });
//   }
// }

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
      return new Response(
        JSON.stringify({ error: "merchantOrderId missing" }),
        { status: 400 }
      );
    }

    // Find the order
    const order = await Order.findOne({ merchantOrderId });
    if (!order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
      });
    }

    // Update DB
    order.status = status;
    order.phonepeOrderId = phonepeOrderId;
    order.updatedAt = new Date();
    await order.save();

    // ✅ Send email only if status SUCCESS and email exists
    if (status === "SUCCESS" && order.customer.email) {
      // Nodemailer transporter (Gmail SMTP)
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER, // sale@green.in
          pass: process.env.EMAIL_PASS, // password or app password
        },
      });

      // Email content
      const mailOptions = {
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
            <li><strong>Amount:</strong> ₹${(order.amount / 100).toLocaleString(
              "en-IN"
            )}</li>
            <li><strong>Delivery Address:</strong> ${order.customer.address}, ${
          order.customer.city
        }, ${order.customer.state} - ${order.customer.pincode}</li>
            <li><strong>Phone:</strong> ${order.customer.phone}</li>
          </ul>
          <p>We will deliver your order soon. Thank you for shopping with us!</p>
          <p>– Green Chargers Team</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log("✅ Success email sent to:", order.customer.email);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
