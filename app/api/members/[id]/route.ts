import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Member from "@/lib/models/Member"
import { authenticateRequest } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const member = await Member.findById(params.id).populate("referredBy", "name email referralCode")

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    return NextResponse.json({ member })
  } catch (error) {
    console.error("Get member error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const auth = await authenticateRequest(request)

    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const updateData = await request.json()

    // Remove sensitive fields that shouldn't be updated
    delete updateData.membershipId
    delete updateData.referralCode
    delete updateData.email

    const member = await Member.findByIdAndUpdate(params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate("referredBy", "name email referralCode")

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Member updated successfully",
      member,
    })
  } catch (error: any) {
    console.error("Update member error:", error)

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ error: "Validation error", details: errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const auth = await authenticateRequest(request)

    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const member = await Member.findByIdAndUpdate(params.id, { status: "inactive" }, { new: true }).populate(
      "referredBy",
      "name email referralCode",
    )

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Member deactivated successfully",
      member,
    })
  } catch (error) {
    console.error("Delete member error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
