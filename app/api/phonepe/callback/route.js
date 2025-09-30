import Order from "@/models/Order";
import { connectDB } from "@/lib/mongodb";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    console.log("📥 PhonePe callback:", body);

    const { merchantOrderId, code } = body;

    let status = "FAILED";
    if (code === "PAYMENT_SUCCESS") status = "SUCCESS";

    await Order.findOneAndUpdate(
      { merchantOrderId },
      { status },
      { new: true }
    );

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("Callback error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
