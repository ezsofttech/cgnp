import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Leader from "@/lib/models/Leader"
import { authenticateRequest } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect()

    const { id } = await params

    const leader = await Leader.findById(id).select("-password")

    if (!leader) {
      return NextResponse.json({ error: "Leader not found" }, { status: 404 })
    }

    return NextResponse.json({ leader })
  } catch (error) {
    console.error("Get leader error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect()

    const auth = await authenticateRequest(request)

    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Check if user is updating their own profile or has admin permissions
    const currentLeader = await Leader.findById(auth.leaderId)
    if (auth.leaderId !== id && !currentLeader?.permissions.includes("admin_access")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const updateData = await request.json()

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updateData.password
    delete updateData.email
    delete updateData.referralCode

    const leader = await Leader.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password")

    if (!leader) {
      return NextResponse.json({ error: "Leader not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Leader updated successfully",
      leader,
    })
  } catch (error: any) {
    console.error("Update leader error:", error)

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ error: "Validation error", details: errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const auth = await authenticateRequest(request);

    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has admin permissions
    const currentLeader = await Leader.findById(auth.leaderId);
    if (!currentLeader?.permissions.includes("admin_access")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const { id } = await params

    // 🧹 Permanently delete the leader from DB
    const leader = await Leader.findByIdAndDelete(id);

    if (!leader) {
      return NextResponse.json({ error: "Leader not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Leader deleted successfully",
      deletedLeaderId: id,
    });
  } catch (error) {
    console.error("Delete leader error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

