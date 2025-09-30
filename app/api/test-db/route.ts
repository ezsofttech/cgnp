// app/api/test-db/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";

export async function GET() {
  try {
    console.log("Connecting to MongoDB...");
    await dbConnect();
    console.log("MongoDB connected successfully!");

    return NextResponse.json({ success: true, message: "MongoDB connected successfully!" });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    return NextResponse.json(
      { success: false, message: "MongoDB connection failed", error },
      { status: 500 }
    );
  }
}
