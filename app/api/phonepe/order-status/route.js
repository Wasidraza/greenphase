// app/api/phonepe/order-status/route.js
import { phonepeFetchToken } from "../get-token/route";

const API_BASE =
  process.env.PHONEPE_API_BASE ||
  "https://api-preprod.phonepe.com/apis/pg-sandbox";

export async function GET(req) {
  try {
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
    return new Response(JSON.stringify(data), {
      status: r.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
