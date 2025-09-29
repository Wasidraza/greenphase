import { NextResponse } from "next/server";
import Order from "@/models/Order";
import { connectDB } from "@/lib/mongodb";

export async function GET(req) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const status = url.searchParams.get("status"); 

    const filter = status ? { status } : {};

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .select(
        "merchantOrderId productTitle amount status phonepeOrderId customer emailStatus createdAt"
      );

    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (err) {
    console.error("GET /api/admin/orders error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
