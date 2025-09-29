import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, city, phone, message } = body;

    // Validation
    if (!name || !email || !city || !phone) {
      return NextResponse.json(
        { success: false, error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    const newEnquiry = new Enquiry({
      name,
      email,
      city,
      phone,
      message,
      createdAt: new Date(),
    });

    await newEnquiry.save();

    return NextResponse.json({
      success: true,
      message: "Your enquiry has been submitted successfully!",
    });
  } catch (error) {
    console.error("Error in /api/enquiry:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: true,
          message:
            "Your enquiry has been submitted successfully!",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Server error while submitting enquiry" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const enquiries = await Enquiry.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, enquiries }, { status: 200 });
  } catch (error) {
    console.error("GET /api/enquiry error:", error);
    return NextResponse.json(
      { success: false, error: "Server error while fetching enquiries" },
      { status: 500 }
    );
  }
}
