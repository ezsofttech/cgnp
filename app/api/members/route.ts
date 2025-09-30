import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Member from "@/lib/models/Member"
import Leader from "@/lib/models/Leader"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    const referredBy = searchParams.get("referredBy") || ""
    const skip = (page - 1) * limit

    // Build query
    const query: any = {}

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { membershipId: { $regex: search, $options: "i" } },
      ]
    }

    if (status) {
      query.status = status
    }

    if (referredBy) {
      query.referredBy = referredBy
    }

    const members = await Member.find(query)
      // .populate("referredByLeader", "name position")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Member.countDocuments(query)

    return NextResponse.json({
      members,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get members error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const memberData = await request.json()

    // If referredBy is provided, validate the referral code
    if (memberData.referredBy) {
      
      const referrer = await Leader.findOne({ referralCode: memberData.referredBy })
      if (referrer) {
        memberData.referredBy = referrer._id
      } else {
        return NextResponse.json({ error: "Invalid referral code" }, { status: 400 })
      }
    }

    const member = new Member(memberData)
    await member.save()

    // Populate the referredBy field for response
    await member.populate("referredBy", "name email referralCode")

    return NextResponse.json(
      {
        message: "Member registered successfully",
        member,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Create member error:", error)

    if (error.code === 11000) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 })
    }

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ error: "Validation error", details: errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
