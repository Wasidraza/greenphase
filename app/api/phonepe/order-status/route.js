// app/api/phonepe/order-status/route.js
import Order from "@/models/Order";
import { connectDB } from "@/lib/mongodb";
import { phonepeFetchToken } from "../get-token/route";

export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const merchantOrderId = searchParams.get("merchantOrderId");

    console.log(`🔍 Checking order status: ${merchantOrderId}`);

    if (!merchantOrderId) {
      return new Response(
        JSON.stringify({ error: "merchantOrderId required" }),
        { status: 400 }
      );
    }

    // ✅ CORRECT ORDER STATUS ENDPOINT
    try {
      const token = await phonepeFetchToken();
      
      const orderStatusEndpoint = `${process.env.PHONEPE_API_BASE}/checkout/v2/order/${merchantOrderId}/status`;
      console.log("🔄 Calling Order Status API:", orderStatusEndpoint);

      const response = await fetch(orderStatusEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const phonePeData = await response.json();
      
      console.log("📞 Order Status Response:", JSON.stringify(phonePeData, null, 2));

      if (response.ok && phonePeData.data) {
        const orderData = phonePeData.data;
        
        return new Response(
          JSON.stringify({
            success: true,
            merchantOrderId: merchantOrderId,
            status: orderData.status || "PENDING",
            phonepeOrderId: orderData.transactionId || "",
            amount: orderData.amount || 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
          { status: 200 }
        );
      }
    } catch (phonePeError) {
      console.error("❌ PhonePe API error, checking database...");
    }

    // Fallback to database check
    const order = await Order.findOne({ merchantOrderId });
    if (order) {
      return new Response(
        JSON.stringify({
          success: true,
          merchantOrderId: order.merchantOrderId,
          status: order.status,
          phonepeOrderId: order.phonepeOrderId,
          amount: order.amount,
          productTitle: order.productTitle,
        }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ error: "Order not found" }),
      { status: 404 }
    );

  } catch (err) {
    console.error("Order status error:", err);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}