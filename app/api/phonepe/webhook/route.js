// app/api/phonepe/webhook/route.js
import Order from "@/models/Order";
import { connectDB } from "@/lib/mongodb";
import nodemailer from "nodemailer";
import { getTempOrder, deleteTempOrder } from "../utils/shared-storage/route";

export async function POST(req) {
  console.log("🔄 PhonePe Webhook Received!");

  try {
    await connectDB();

    const body = await req.json();
    console.log("📦 Webhook payload:", JSON.stringify(body, null, 2));

    // PhonePe ke different response formats handle karo
    const responseData = body?.response?.data || body?.data || {};
    const merchantOrderId =
      responseData.merchantTransactionId ||
      responseData.merchantOrderId ||
      body?.merchantOrderId;

    const statusCode = body?.response?.code || body?.code;
    const phonepeOrderId = responseData.transactionId || "";

    console.log(`🔍 Webhook for: ${merchantOrderId}, Status: ${statusCode}`);

    if (!merchantOrderId) {
      console.error("❌ merchantOrderId missing in webhook");
      return new Response(
        JSON.stringify({ error: "merchantOrderId missing" }),
        { status: 400 }
      );
    }

    // Status mapping
    let status = "PENDING";
    if (statusCode === "PAYMENT_SUCCESS") status = "SUCCESS";
    if (statusCode === "PAYMENT_ERROR" || statusCode === "PAYMENT_FAILED")
      status = "FAILED";

    console.log(`🎯 Payment ${status} for order: ${merchantOrderId}`);

    // ✅ IMPORTANT: Temporary storage se data lo
    const tempOrder = getTempOrder(merchantOrderId);

    let order;

    if (tempOrder && (status === "SUCCESS" || status === "FAILED")) {
      console.log("📝 Creating NEW order from temp data after payment");

      // ✅ ACTUAL DATABASE SAVE - Sirf payment success/failed pe
      order = await Order.create({
        merchantOrderId: tempOrder.merchantOrderId,
        productTitle: tempOrder.productTitle,
        productColor: tempOrder.productColor,
        amount: tempOrder.amount,
        customer: tempOrder.customer,
        status: status, // Actual payment status
        phonepeOrderId: phonepeOrderId,
      });

      // Temporary data delete karo
      deleteTempOrder(merchantOrderId);
      console.log("✅ Order saved in DB after payment confirmation");
    } else {
      // Agar temp data nahi mila, existing order update karo
      order = await Order.findOne({ merchantOrderId });
      if (order) {
        order.status = status;
        order.phonepeOrderId = phonepeOrderId;
        order.updatedAt = new Date();
        await order.save();
        console.log("✅ Existing order updated in DB");
      } else {
        console.error("❌ Order not found in temp storage or DB");
        return new Response(JSON.stringify({ error: "Order not found" }), {
          status: 404,
        });
      }
    }

    // Email send karo only for final status
    if (status === "SUCCESS" || status === "FAILED") {
      await sendEmail(order, status);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Order ${merchantOrderId} ${status}`,
        orderId: order.merchantOrderId,
        status: status,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Webhook processing error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

// Email function (same as before)
async function sendEmail(order, status) {
  try {
    if (!order.customer?.email) {
      console.log("📧 No email found for customer");
      return;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_PORT || 587),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = getEmailTemplate(order, status);

    if (mailOptions) {
      await transporter.sendMail(mailOptions);
      console.log(
        `📧 Email sent successfully for order ${order.merchantOrderId}`
      );
    }
  } catch (emailError) {
    console.error("❌ Email sending failed:", emailError);
  }
}

function getEmailTemplate(order, status) {
  if (!order.customer?.email) return null;

  const baseEmail = {
    from: `"Green Chargers" <${process.env.EMAIL_USER}>`,
    to: order.customer.email,
  };

  if (status === "SUCCESS") {
    return {
      ...baseEmail,
      subject: `Order Confirmed – ${order.productTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #22c55e;">Hello ${order.customer.firstName} ${
        order.customer.lastName
      },</h2>
          <p>Your payment was successful! Thank you for your order.</p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
            <h3 style="margin-top: 0; color: #374151;">Order Details:</h3>
            <p><strong>Order ID:</strong> ${order.merchantOrderId}</p>
            <p><strong>Product:</strong> ${order.productTitle}</p>
            <p><strong>Amount:</strong> ₹${(order.amount / 100).toLocaleString(
              "en-IN"
            )}</p>
            <p><strong>Delivery Address:</strong> ${order.customer.address}, ${
        order.customer.city
      }, ${order.customer.state} - ${order.customer.pincode}</p>
          </div>
          <p>We will deliver your order soon. Thank you for shopping with us!</p>
          <br>
          <p style="color: #6b7280; font-size: 14px;">Best regards,<br>Green Chargers Team</p>
        </div>
      `,
    };
  }

  if (status === "FAILED") {
    return {
      ...baseEmail,
      subject: `Payment Failed – ${order.productTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">Hello ${order.customer.firstName} ${
        order.customer.lastName
      },</h2>
          <p>Unfortunately, your payment could not be processed.</p>
          <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
            <p><strong>Order ID:</strong> ${order.merchantOrderId}</p>
            <p><strong>Product:</strong> ${order.productTitle}</p>
            <p><strong>Amount:</strong> ₹${(order.amount / 100).toLocaleString(
              "en-IN"
            )}</p>
          </div>
          <p>Please try again or contact our support team if the issue persists.</p>
          <br>
          <p style="color: #6b7280; font-size: 14px;">Best regards,<br>Green Chargers Team</p>
        </div>
      `,
    };
  }

  return null;
}
