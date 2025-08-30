import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, city, phone, message } = body;

    if (!name || !email || !city || !phone) {
      return NextResponse.json(
        { success: false, error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    await Enquiry.create({ name, email, city, phone, message });

    return NextResponse.json({
      success: true,
      message: "🎉 Your enquiry has been submitted successfully!",
    });
  } catch (error) {
    console.error("❌ Error in /api/enquiry:", error);
    return NextResponse.json(
      { success: false, error: "Server error while submitting enquiry" },
      { status: 500 }
    );
  }
}
