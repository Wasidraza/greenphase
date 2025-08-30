import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, phone, email, message } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, error: "Required fields missing" },
        { status: 400 }
      );
    }

    const newContact = new Contact({ name, phone, email, message });
    await newContact.save();

    return NextResponse.json(
      { success: true, message: "Contact saved successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error saving contact:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
