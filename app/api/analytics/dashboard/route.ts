import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Leader from "@/lib/models/Leader"
import Member from "@/lib/models/Member"
import jwt from "jsonwebtoken"

const getJwtSecret = () => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET || JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters long. Please define it in .env.local");
  }
  return JWT_SECRET;
};

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    // 🧩 Step 1: Extract token from cookies or headers
    const token =
      request.cookies.get("auth-token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 })
    }

    // 🧩 Step 2: Decode the token
    let decoded: any
    try {
      decoded = jwt.verify(token, getJwtSecret())
    } catch (err) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    const leaderId = decoded.leaderId
    const currentLeader = await Leader.findById(leaderId)
    if (!currentLeader) {
      return NextResponse.json({ error: "Leader not found" }, { status: 404 })
    }

    // 🧩 Step 3: Verify permission
    if (!currentLeader.permissions.includes("view_analytics")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const { role } = currentLeader

    // 🧩 Step 4: Extract range filter
    const { searchParams } = new URL(request.url)
    const range = Number.parseInt(searchParams.get("range") || "30")

    const dateFrom = new Date()
    dateFrom.setDate(dateFrom.getDate() - range)

    // 🧩 Step 5: Build base query based on role
    const memberQuery: any = {}
    if (role !== "party_admin") {
      memberQuery.referredBy = leaderId
    }

    // 🧩 Step 6: Calculate analytics data
    const totalMembers = await Member.countDocuments(memberQuery)
    const activeMembers = await Member.countDocuments({ ...memberQuery, status: "active" })
    const pendingMembers = await Member.countDocuments({ ...memberQuery, status: "pending" })
    const totalLeaders = role === "party_admin" ? await Leader.countDocuments() : 1

    // Monthly growth
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)

    const newMembersThisMonth = await Member.countDocuments({
      ...memberQuery,
      joinedDate: { $gte: lastMonth },
    })

    const totalMembersLastMonth = totalMembers - newMembersThisMonth
    const monthlyGrowth =
      totalMembersLastMonth > 0
        ? Math.round((newMembersThisMonth / totalMembersLastMonth) * 100)
        : 0

    // State distribution (top 10)
    const stateDistribution = await Member.aggregate([
      { $match: memberQuery },
      { $group: { _id: "$state", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { state: "$_id", count: 1, _id: 0 } },
    ])

    // Top referrers (only for party_admin)
// Top referrers (only for party_admin)
let topReferrersWithNames: { name: string; referrals: number }[] = []

    if (role === "party_admin") {
      const topReferrers = await Member.aggregate([
        { $match: { referredBy: { $exists: true, $ne: null } } },
        { $group: { _id: "$referredBy", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ])

      const referrerIds = topReferrers.map((r) => r._id)
      const referrerLeaders = await Leader.find({ _id: { $in: referrerIds } }).select("name referralCode")

      topReferrersWithNames = topReferrers.map((ref) => {
        const leader = referrerLeaders.find((l) => l._id.toString() === ref._id.toString())
        return {
          name: leader?.name || "Unknown",
          referrals: ref.count,
        }
      })
    }

    // Membership trends (last 6 months)
    const membershipTrends = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

      const membersCount = await Member.countDocuments({
        ...memberQuery,
        joinedDate: { $gte: monthStart, $lte: monthEnd },
      })

      const leadersCount =
        role === "party_admin"
          ? await Leader.countDocuments({
              joinedDate: { $gte: monthStart, $lte: monthEnd },
            })
          : 0

      membershipTrends.push({
        month: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        members: membersCount,
        leaders: leadersCount,
      })
    }

    // Recent activity
    const recentMembers = await Member.find(memberQuery)
      .sort({ joinedDate: -1 })
      .limit(5)
      .select("name joinedDate")

    const recentLeaders =
      role === "party_admin"
        ? await Leader.find().sort({ joinedDate: -1 }).limit(3).select("name joinedDate")
        : []

    const recentActivity = [
      ...recentMembers.map((member) => ({
        type: "member_join",
        description: `${member.name} joined as a new member`,
        timestamp: member.joinedDate,
      })),
      ...recentLeaders.map((leader) => ({
        type: "leader_add",
        description: `${leader.name} was added as a leader`,
        timestamp: leader.joinedDate,
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // 🧩 Step 7: Response
    const analyticsData = {
      totalMembers,
      activeMembers,
      pendingMembers,
      totalLeaders,
      monthlyGrowth,
      stateDistribution,
      membershipTrends,
      topReferrers: topReferrersWithNames,
      recentActivity,
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error("Analytics dashboard error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
