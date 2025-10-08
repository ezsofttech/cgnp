

import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Member from "@/lib/models/Member"
import Leader from "@/lib/models/Leader"
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.error("FATAL: JWT_SECRET must be at least 32 characters long");
  process.exit(1);
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // 🧩 Step 1: Get token from cookies or headers
    const token =
      request.cookies.get("auth-token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    // 🧩 Step 2: Decode token to get leaderId and role
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET||"R4jP7nYjLwVg2Q0XH2xF0m3pPnlZ5a6yYF8vHtR8b+vOaL1+5KwTgRztUjJZr1Y9");
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const leaderId = decoded.leaderId;
    const leader = await Leader.findById(leaderId);
    if (!leader) {
      return NextResponse.json(
        { error: "Leader not found" },
        { status: 404 }
      );
    }

    const { role } = leader;

    // 🧩 Step 3: Extract query params
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const exportAll = searchParams.get("export") === "all";
    const skip = (page - 1) * limit;

    // 🧩 Step 4: Build base query
    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { membershipId: { $regex: search, $options: "i" } },
        { mobileNumber: { $regex: search, $options: "i" } },
        { district: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      query.status = status;
    }

    // 🧩 Step 5: Apply role-based filter
    if (role !== "party_admin") {
      query.referredBy = leaderId;
    }

    // 🧩 Step 6: Fetch members
    if (exportAll) {
      const allMembers = await Member.find(query)
        .populate("referredBy", "name email referralCode")
        .sort({ createdAt: -1 })
        .lean();

      return NextResponse.json({
        members: allMembers,
        pagination: {
          page: 1,
          limit: allMembers.length,
          total: allMembers.length,
          pages: 1,
        },
      });
    }

    const members = await Member.find(query)
      .populate("referredBy", "name email referralCode")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Member.countDocuments(query);

    // 🧩 Step 7: Return paginated response
    return NextResponse.json({
      members,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get members error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
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