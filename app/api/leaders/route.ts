// app/api/leaders/route.ts
import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Leader from "@/lib/models/Leader";
import { authenticateRequest } from "@/lib/auth";
import { z } from "zod";

// Input validation schemas
const LeaderCreateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["district_convenor", "state_convenor", "national_convenor"]),
  position: z.string().optional(),
  phone:z.string(),
  referralCode: z.string().min(4).optional(),
  permissions: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Parse query parameters with validation
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, Number.parseInt(searchParams.get("limit") || "10")));
    const skip = (page - 1) * limit;

    // Get active leaders with pagination
    const [leaders, total] = await Promise.all([
      Leader.find()
        .select("-password -__v")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Leader.countDocuments({}),
    ]);

    return NextResponse.json({
      success: true,
      data: leaders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
      },
    });
  } catch (error) {
    console.error("GET /api/leaders error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Authentication check
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Authorization check - only admins can create leaders
    const currentLeader = await Leader.findById(auth.leaderId);
    if (!currentLeader?.permissions?.includes("admin_access")) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    

    // Validate request body
    const rawData = await request.json();
    const validation = LeaderCreateSchema.safeParse(rawData);
    
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const leaderData = validation.data;

       // Generate referral code
        const generateReferralCode = (name: string) => {
          const initials = name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
          const year = new Date().getFullYear()
          const random = Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, "0")
          return `${initials}${year}${random}`
        }
    
       leaderData.referralCode = generateReferralCode(leaderData.name)
    
        // Ensure referral code is unique
        while (await Leader.findOne({ referralCode:leaderData.referralCode })) {
          leaderData.referralCode = generateReferralCode(leaderData.name)
        }
        console.log("referralCode",leaderData.referralCode);

    // Check for existing email or referral code
    const existingLeader = await Leader.findOne({
      $or: [
        { email: leaderData.email },
        { referralCode: leaderData.referralCode },
      ],
    });

    if (existingLeader) {
      const conflictField = existingLeader.email === leaderData.email 
        ? "email" 
        : "referralCode";
      return NextResponse.json(
        {
          success: false,
          error: `${conflictField} already exists`,
          field: conflictField,
        },
        { status: 409 }
      );
    }

    // Create new leader
    const leader = new Leader({
      ...leaderData,
      createdBy: auth.leaderId,
    });

    await leader.save();

    // Prepare response without sensitive data
    const responseData = leader.toObject();
    delete responseData.password;
    delete responseData.__v;

    return NextResponse.json(
      {
        success: true,
        message: "Leader created successfully",
        data: responseData,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/leaders error:", error);

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      const field = error.keyValue?.email ? "email" : "referralCode";
      return NextResponse.json(
        {
          success: false,
          error: `${field} already exists`,
          field,
        },
        { status: 400 }
      );
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => ({
        field: err.path,
        message: err.message,
      }));
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: errors,
        },
        { status: 400 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}