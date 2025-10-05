import Order from "@/models/Order";
import { connectDB } from "@/lib/mongodb";
import { phonepeFetchToken } from "../get-token/route";

const API_BASE = process.env.PHONEPE_API_BASE;

export async function GET(req) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const merchantOrderId = url.searchParams.get("merchantOrderId");
    
    if (!merchantOrderId) {
      return Response.json(
        { error: "merchantOrderId required" },
        { status: 400 }
      );
    }

    console.log("🔍 Checking order status for:", merchantOrderId);

    // ✅ Pehle database se order check karo
    let order = await Order.findOne({ merchantOrderId });
    
    // Agar order database mein nahi hai, lekin payment ho chuka hai
    if (!order) {
      console.log("📦 Order not in DB, checking with PhonePe...");
    }

    // ✅ PhonePe se latest status check karo
    const token = await phonepeFetchToken();

    const phonepeResponse = await fetch(
      `${API_BASE}/checkout/v2/order/${encodeURIComponent(merchantOrderId)}/status?details=false`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `O-Bearer ${token}`,
        },
      }
    );

    const phonepeData = await phonepeResponse.json();
    console.log("📩 PhonePe order-status response:", JSON.stringify(phonepeData, null, 2));

    // ✅ IMPROVED: Better status mapping
    let finalStatus = "PENDING";
    let phonepeOrderId = "";
    let paymentDetails = phonepeData;

    if (phonepeData.code === "PAYMENT_SUCCESS" || 
        phonepeData.data?.state === "COMPLETED" ||
        phonepeData.state === "COMPLETED") {
      finalStatus = "SUCCESS";
      phonepeOrderId = phonepeData.data?.orderId || phonepeData.orderId;
    } else if (phonepeData.code === "PAYMENT_ERROR" ||
               phonepeData.code === "PAYMENT_FAILED" ||
               phonepeData.data?.state === "FAILED" ||
               phonepeData.state === "FAILED") {
      finalStatus = "FAILED";
      phonepeOrderId = phonepeData.data?.orderId || phonepeData.orderId;
    }

    console.log(`🎯 Determined status: ${finalStatus} for order: ${merchantOrderId}`);

    // ✅ Database mein update/create karo
    if (order) {
      // Existing order update karo
      order.status = finalStatus;
      order.phonepeOrderId = phonepeOrderId || order.phonepeOrderId;
      order.paymentDetails = paymentDetails;
      order.errorCode = phonepeData.errorCode || phonepeData.data?.errorCode;
      await order.save();
      console.log("✅ Existing order updated in DB");
    } else {
      // ✅ IMPORTANT: Agar webhook ne order create nahi kiya, lekin payment ho gaya hai
      // Toh yahan create karo (temporary storage check karo)
      const { tempOrders } = await import('../create-payment/route');
      const tempOrder = tempOrders.get(merchantOrderId);
      
      if (tempOrder && (finalStatus === "SUCCESS" || finalStatus === "FAILED")) {
        console.log("📝 Creating order from temp data in order-status API");
        order = await Order.create({
          merchantOrderId: tempOrder.merchantOrderId,
          productTitle: tempOrder.productTitle,
          productColor: tempOrder.productColor,
          power: tempOrder.power,
          amount: tempOrder.amount,
          customer: tempOrder.customer,
          status: finalStatus,
          phonepeOrderId: phonepeOrderId,
          paymentDetails: paymentDetails,
          errorCode: phonepeData.errorCode || phonepeData.data?.errorCode,
        });
        
        // Clean up temp storage
        tempOrders.delete(merchantOrderId);
        console.log("✅ Order created in DB from temp data");
      }
    }

    // ✅ Email status check (agar email send hua hai ya nahi)
    const emailStatus = order?.emailSent ? "SENT" : "PENDING";

    return Response.json({ 
      status: finalStatus,
      order: order ? {
        merchantOrderId: order.merchantOrderId,
        productTitle: order.productTitle,
        productColor: order.productColor,
        amount: order.amount,
        status: order.status,
        customer: order.customer,
        phonepeOrderId: order.phonepeOrderId,
        createdAt: order.createdAt
      } : null,
      emailStatus,
      phonepeResponse: phonepeData
    }, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("❌ order-status API error:", err);
    
    // ✅ Agar API call fail hui, toh database se status check karo
    try {
      await connectDB();
      const merchantOrderId = new URL(req.url).searchParams.get("merchantOrderId");
      const order = await Order.findOne({ merchantOrderId });
      
      if (order) {
        return Response.json({ 
          status: order.status,
          order: {
            merchantOrderId: order.merchantOrderId,
            productTitle: order.productTitle,
            amount: order.amount,
            status: order.status
          },
          emailStatus: order.emailSent ? "SENT" : "PENDING",
          note: "Status from database (PhonePe API unavailable)"
        });
      }
    } catch (dbErr) {
      console.error("Database fallback also failed:", dbErr);
    }

    return Response.json({ 
      error: "Failed to check order status",
      details: err.message 
    }, {
      status: 500,
    });
  }
}