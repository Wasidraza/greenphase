import { NextResponse } from "next/server";
import {connectDB} from "@/lib/mongodb";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();
    const { name, phone, email, password } = await req.json();

    if (!name || !phone || !email || !password) {
      return NextResponse.json({ success: false, message: "All fields required" }, { status: 400 });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json({ success: false, message: "Admin already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({ name, phone, email, password: hashedPassword });
    await admin.save();

    return NextResponse.json({ success: true, message: "Admin created successfully" }, { status: 201 });
  } catch (err) {
    console.error("Admin create error:", err);
    return NextResponse.json({ success: false, message: "Server error", error: err.message }, { status: 500 });
  }
}
