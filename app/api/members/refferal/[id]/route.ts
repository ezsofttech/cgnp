import Member from "@/lib/models/Member"
import dbConnect from "@/lib/mongodb"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const member = await Member.find({referredBy: params.id}).populate("referredBy", "name email referralCode")

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    return NextResponse.json({ member })
  } catch (error) {
    console.error("Get member error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
