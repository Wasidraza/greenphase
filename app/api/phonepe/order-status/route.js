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
      return new Response(
        JSON.stringify({ error: "merchantOrderId required" }),
        { status: 400 }
      );
    }

    // 🪙 Fetch token for PhonePe API
    const token = await phonepeFetchToken();

    // 🔍 Check order status from PhonePe
    const res = await fetch(
      `${API_BASE}/checkout/v2/order/${encodeURIComponent(
        merchantOrderId
      )}/status?details=false`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Some PhonePe envs accept "Bearer", others "O-Bearer"
          Authorization: `O-Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    console.log(
      "📩 PhonePe order-status response:",
      JSON.stringify(data, null, 2)
    );

    // 🧠 Determine final status
    const code = data.code || data.responseCode;
    const state =
      data.data?.state || data.state || data.data?.status || data.status;

    let finalStatus = "PENDING";
    if (
      code === "PAYMENT_SUCCESS" ||
      state === "COMPLETED" ||
      state === "SUCCESS"
    ) {
      finalStatus = "SUCCESS";
    } else if (
      code === "PAYMENT_ERROR" ||
      code === "PAYMENT_FAILED" ||
      state === "FAILED"
    ) {
      finalStatus = "FAILED";
    }

    // 🧾 Update DB record
    await Order.findOneAndUpdate(
      { merchantOrderId },
      { status: finalStatus, updatedAt: new Date() },
      { new: true }
    );

    console.log(`Order ${merchantOrderId} updated to → ${finalStatus}`);

    return new Response(
      JSON.stringify({
        status: finalStatus,
        emailStatus: "UNKNOWN", 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("/api/phonepe/order-status error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
