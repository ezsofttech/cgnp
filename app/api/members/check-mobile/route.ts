import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Member from "@/lib/models/Member"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const mobileNumber = searchParams.get("mobile")

    if (!mobileNumber) {
      return NextResponse.json(
        { error: "Mobile number is required" },
        { status: 400 }
      )
    }

    // Validate mobile number format
    if (!/^[0-9]{10}$/.test(mobileNumber)) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number" },
        { status: 400 }
      )
    }

    // Check if mobile number exists
    const existingMember = await Member.findOne({ mobileNumber })
    
    return NextResponse.json({
      exists: !!existingMember,
      message: existingMember ? "Mobile number already exists" : "Mobile number is available"
    })
  } catch (error) {
    console.error("Check mobile error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}