import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Leader from "@/lib/models/Leader"
import Member from "@/lib/models/Member"
import { authenticateRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has analytics permission
    const currentLeader = await Leader.findById(auth.leaderId)
    if (!currentLeader?.permissions.includes("view_analytics")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const range = Number.parseInt(searchParams.get("range") || "30")

    const dateFrom = new Date()
    dateFrom.setDate(dateFrom.getDate() - range)

    // Get members data
    const members = await Member.find({
      joinedDate: { $gte: dateFrom },
      isActive: true,
    }).select("name email phone state district joinedDate status referredBy")

    // Get leaders data
    const leaders = await Leader.find({
      joinedDate: { $gte: dateFrom },
      isActive: true,
    }).select("name email phone position role joinedDate referralCode")

    // Create CSV content
    let csvContent = "Type,Name,Email,Phone,Location,Joined Date,Status,Additional Info\n"

    // Add members
    members.forEach((member) => {
      const location = `${member.district}, ${member.state}`
      const additionalInfo = member.referredBy ? `Referred by: ${member.referredBy}` : ""
      csvContent += `Member,"${member.name}","${member.email}","${member.phone}","${location}","${member.joinedDate.toISOString().split("T")[0]}","${member.status}","${additionalInfo}"\n`
    })

    // Add leaders
    leaders.forEach((leader) => {
      csvContent += `Leader,"${leader.name}","${leader.email}","${leader.phone}","${leader.position}","${leader.joinedDate.toISOString().split("T")[0]}","Active","Role: ${leader.role}, Code: ${leader.referralCode}"\n`
    })

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="aap-analytics-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("Analytics export error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
