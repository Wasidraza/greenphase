// app/api/phonepe/webhook/route.js
import Order from "@/models/Order";
import { connectDB } from "@/lib/mongodb";
import nodemailer from "nodemailer";

// Temporary storage (create-payment se import karo ya yahi define karo)
const tempOrders = new Map();

export async function POST(req) {
  console.log("🔄 PhonePe Webhook Received!");

  try {
    await connectDB();

    // Webhook verification ke liye headers capture karo
    const headers = {
      authorization: req.headers.get("authorization") || "",
      "content-type": req.headers.get("content-type") || "",
    };

    console.log("📨 Webhook Headers:", headers);

    // Raw body as string capture karo for verification
    const rawBody = await req.text();
    console.log("📦 Raw Webhook Body:", rawBody);

    // Parse JSON body
    const body = JSON.parse(rawBody);
    console.log("📦 Parsed Webhook Body:", JSON.stringify(body, null, 2));

    // ✅ NEW PHONEPE WEBHOOK STRUCTURE (Documentation ke according)
    const callbackType = body?.type;
    const payload = body?.payload || {};

    // Extract data from new structure
    const merchantOrderId =
      payload?.originalMerchantOrderId ||
      payload?.merchantOrderId ||
      payload?.merchantTransactionId;

    const phonepeOrderId = payload?.orderId || "";
    const state = payload?.state || "";
    const amount = payload?.amount || 0;
    const errorCode = payload?.errorCode || "";
    const paymentDetails = payload?.paymentDetails || [];

    console.log(`🔍 Webhook Details:`, {
      callbackType,
      merchantOrderId,
      phonepeOrderId,
      state,
      amount,
      errorCode,
    });

    if (!merchantOrderId) {
      console.error("❌ merchantOrderId missing in webhook");
      return new Response(
        JSON.stringify({ error: "merchantOrderId missing" }),
        { status: 400 }
      );
    }

    // ✅ NEW STATUS MAPPING (PhonePe documentation ke according)
    let status = "PENDING";
    if (state === "COMPLETED" || callbackType === "CHECKOUT_ORDER_COMPLETED") {
      status = "SUCCESS";
    } else if (state === "FAILED" || callbackType === "CHECKOUT_ORDER_FAILED") {
      status = "FAILED";
    }

    console.log(`🎯 Payment ${status} for order: ${merchantOrderId}`);

    // ✅ IMPORTANT: Temporary storage se data lo (payment se pehle ka data)
    const tempOrder = tempOrders.get(merchantOrderId);

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
        status: status,
        phonepeOrderId: phonepeOrderId,
        paymentDetails: paymentDetails, // Store payment details
        errorCode: errorCode, // Store error code if any
      });

      // Temporary data delete karo
      tempOrders.delete(merchantOrderId);
      console.log("✅ Order saved in DB after payment confirmation");
    } else {
      // Agar temp data nahi mila, existing order update karo
      order = await Order.findOne({ merchantOrderId });
      if (order) {
        order.status = status;
        order.phonepeOrderId = phonepeOrderId;
        order.paymentDetails = paymentDetails;
        order.errorCode = errorCode;
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

    // ✅ Webhook verification response (PhonePe ko success batao)
    return new Response(
      JSON.stringify({
        success: true,
        message: `Webhook processed successfully - Order ${merchantOrderId} ${status}`,
        orderId: order.merchantOrderId,
        status: status,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("❌ Webhook processing error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

// Email function update karo
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
            <p><strong>Transaction ID:</strong> ${
              order.phonepeOrderId || "Processing..."
            }</p>
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
            ${
              order.errorCode
                ? `<p><strong>Error Code:</strong> ${order.errorCode}</p>`
                : ""
            }
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

// Export tempOrders for create-payment to use
export { tempOrders };
