import Order from "@/models/Order";
import { connectDB } from "@/lib/mongodb";
import { getTempOrder } from "../utils/shared-storage/route";

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

    // Pehle database mein check karo (payment complete hone ke baad)
    let order = await Order.findOne({ merchantOrderId });
    
    if (order) {
      console.log(`✅ Order found in DB: ${order.status}`);
      return new Response(
        JSON.stringify({
          success: true,
          merchantOrderId: order.merchantOrderId,
          status: order.status,
          phonepeOrderId: order.phonepeOrderId,
          amount: order.amount,
          productTitle: order.productTitle,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        }),
        { status: 200 }
      );
    }

    // Agar database mein nahi mila, temporary storage mein check karo
    const tempOrder = getTempOrder(merchantOrderId);
    if (tempOrder) {
      console.log(`⏳ Order found in temp storage: PENDING`);
      return new Response(
        JSON.stringify({
          success: true,
          merchantOrderId: tempOrder.merchantOrderId,
          status: "PENDING",
          message: "Payment in progress - order not saved in DB yet",
          productTitle: tempOrder.productTitle,
          amount: tempOrder.amount,
        }),
        { status: 200 }
      );
    }

    console.log(`❌ Order not found anywhere: ${merchantOrderId}`);
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