import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Leader from "@/lib/models/Leader"
import { authenticateRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const auth = await authenticateRequest(request)

    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const leader = await Leader.findById(auth.leaderId).select("-password")

    if (!leader) {
      return NextResponse.json({ error: "Leader not found" }, { status: 404 })
    }

    return NextResponse.json({
      leader: {
        id: leader._id,
        name: leader.name,
        email: leader.email,
        role: leader.role,
        position: leader.position,
        referralCode: leader.referralCode,
        permissions: leader.permissions,
        bio: leader.bio,
        image: leader.image,
        phone: leader.phone,
        address: leader.address,
        joinedDate: leader.joinedDate,
      },
    })
  } catch (error) {
    console.error("Get current leader error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
