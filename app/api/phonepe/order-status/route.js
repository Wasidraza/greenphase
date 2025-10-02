import Order from "@/models/Order";
import { connectDB } from "@/lib/mongodb";
import { phonepeFetchToken } from "../get-token/route";

const API_BASE = process.env.PHONEPE_API_BASE;

export async function GET(req) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const merchantOrderId = url.searchParams.get("merchantOrderId");
    if (!merchantOrderId)
      return new Response(
        JSON.stringify({ error: "merchantOrderId required" }),
        { status: 400 }
      );

    const token = await phonepeFetchToken();

    const r = await fetch(
      `${API_BASE}/checkout/v2/order/${encodeURIComponent(
        merchantOrderId
      )}/status?details=false`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `O-Bearer ${token}`,
        },
      }
    );

    const data = await r.json();
    console.log("📩 PhonePe order-status response:", data);

    let finalStatus = "PENDING";
    if (data.code === "PAYMENT_SUCCESS" || data.data?.state === "COMPLETED")
      finalStatus = "SUCCESS";
    else if (
      data.code === "PAYMENT_ERROR" ||
      data.code === "PAYMENT_FAILED" ||
      data.data?.state === "FAILED"
    )
      finalStatus = "FAILED";

    await Order.findOneAndUpdate(
      { merchantOrderId },
      { status: finalStatus },
      { new: true }
    );

    return new Response(JSON.stringify({ status: finalStatus }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("order-status error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
