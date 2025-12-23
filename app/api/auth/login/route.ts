import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Leader from "@/lib/models/Leader";
import { signToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email, password } = await request.json();

    // Validate input
    if (!email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find leader with password field
    const leader = await Leader.findOne({ email: email.trim() }).select(
      "+password"
    );
    if (!leader) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // if (!leader.isActive) {
    //   return NextResponse.json({ error: "In Active Leader " }, { status: 401 });
    // }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, leader.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = await signToken({
      leaderId: leader._id.toString(),
      email: leader.email,
      role: leader.role,
    });

    // Create response
    const response = NextResponse.json({
      message: "Login successful",
      leader: {
        id: leader._id,
        name: leader.name,
        email: leader.email,
        role: leader.role,
        position: leader.position,
        referralCode: leader.referralCode,
        permissions: leader.permissions,
      },
    });

    // Set secure cookie
    response.cookies.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
