import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();

    const { name, email, phone, password } = await req.json();

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { success: false, message: "All fields required" },
        { status: 400 }
      );
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 400 }
      );
    }

    // ✅ Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ 
      name, 
      email, 
      phone, 
      password: hashedPassword 
    });
    await user.save();

    return NextResponse.json(
      { success: true, message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup API error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}


// GET request - fetch all users
export async function GET() {
  try {
    await connectDB();

    const users = await User.find().sort({ createdAt: -1 }).select("-password"); // hide passwords

    return NextResponse.json(
      { success: true, users },
      { status: 200 }
    );
  } catch (error) {
    console.error("Signup GET API error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}