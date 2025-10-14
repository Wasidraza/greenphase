import Order from "@/models/Order";
import { connectDB } from "@/lib/mongodb";
import nodemailer from "nodemailer";
import { tempOrders } from "../create-payment/route";

export async function POST(req) {
  console.log("🔄 PhonePe Webhook Received!");

  try {
    await connectDB();

    // Read raw body for verification
    const rawBody = await req.text();
    console.log("📦 Raw webhook body received");

    const body = JSON.parse(rawBody);
    console.log("📦 Parsed webhook data:", JSON.stringify(body, null, 2));

    // Extract data from webhook
    const callbackType = body?.type;
    const payload = body?.payload || body?.data || body;

    const merchantOrderId =
      payload?.originalMerchantOrderId ||
      payload?.merchantOrderId ||
      payload?.merchantTransactionId ||
      body?.merchantOrderId;

    const phonepeOrderId = payload?.orderId || payload?.transactionId || "";
    const state = payload?.state || payload?.status || "";
    const amount = payload?.amount || payload?.transactionAmount || 0;
    const errorCode = payload?.errorCode || payload?.responseCode || "";

    console.log("🔍 Webhook details:", {
      merchantOrderId,
      phonepeOrderId,
      state,
      amount,
      errorCode,
    });

    if (!merchantOrderId) {
      console.error("❌ merchantOrderId missing");
      return Response.json(
        { error: "merchantOrderId missing" },
        { status: 400 }
      );
    }

    // Determine payment status
    let status = "PENDING";
    if (
      state === "COMPLETED" ||
      callbackType === "CHECKOUT_ORDER_COMPLETED" ||
      payload?.code === "PAYMENT_SUCCESS"
    ) {
      status = "SUCCESS";
    } else if (
      state === "FAILED" ||
      callbackType === "CHECKOUT_ORDER_FAILED" ||
      payload?.code === "PAYMENT_ERROR"
    ) {
      status = "FAILED";
    }

    console.log(`🎯 Payment ${status} for order: ${merchantOrderId}`);

    let order;

    // Check if order already exists in database
    order = await Order.findOne({ merchantOrderId });

    if (order) {
      // Update existing order
      order.status = status;
      order.phonepeOrderId = phonepeOrderId || order.phonepeOrderId;
      order.paymentDetails = payload;
      order.errorCode = errorCode;
      order.updatedAt = new Date();
      await order.save();
      console.log("✅ Existing order updated");
    } else {
      // Create new order from temp data (Payment confirmed)
      const tempOrder = tempOrders.get(merchantOrderId);
      if (tempOrder && (status === "SUCCESS" || status === "FAILED")) {
        console.log("📝 Creating new order after payment confirmation");

        order = await Order.create({
          merchantOrderId: tempOrder.merchantOrderId,
          productTitle: tempOrder.productTitle,
          productColor: tempOrder.productColor,
          power: tempOrder.power,
          amount: tempOrder.amount,
          customer: tempOrder.customer,
          status: status,
          phonepeOrderId: phonepeOrderId,
          paymentDetails: payload,
          errorCode: errorCode,
        });

        // Clean up temp storage
        tempOrders.delete(merchantOrderId);
        console.log("✅ Order saved in database");
      } else {
        console.error("❌ Order not found");
        return Response.json({ error: "Order not found" }, { status: 404 });
      }
    }

    // Send email for final status
    if (status === "SUCCESS" || status === "FAILED") {
      await sendEmail(order, status);
    }

    return Response.json({
      success: true,
      message: `Webhook processed - Order ${merchantOrderId} ${status}`,
      orderId: order.merchantOrderId,
      status: status,
    });
  } catch (err) {
    console.error("❌ Webhook processing error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Email sending function
async function sendEmail(order, status) {
  try {
    if (!order.customer?.email) {
      console.log("📧 No email found for customer");
      return;
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = getEmailTemplate(order, status);

    if (mailOptions) {
      await transporter.sendMail(mailOptions);
      console.log(`📧 Email sent for order ${order.merchantOrderId}`);

      // Mark email as sent
      order.emailSent = true;
      await order.save();
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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
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
          <p style="color: #6b7280; font-size: 14px;">
            Best regards,<br>
            Green Chargers Team
          </p>
        </div>
      `,
    };
  }

  if (status === "FAILED") {
    return {
      ...baseEmail,
      subject: `Payment Failed – ${order.productTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
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
          <p style="color: #6b7280; font-size: 14px;">
            Best regards,<br>
            Green Chargers Team
          </p>
        </div>
      `,
    };
  }

  return null;
}
