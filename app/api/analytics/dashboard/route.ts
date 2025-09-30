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

    // Get total counts
    const totalMembers = await Member.countDocuments()
    const activeMembers = await Member.countDocuments({ status: "active"  })
    const pendingMembers = await Member.countDocuments({ status: "pending"})
    const totalLeaders = await Leader.countDocuments()

    // Calculate monthly growth
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    const newMembersThisMonth = await Member.countDocuments({
      joinedDate: { $gte: lastMonth },
    })
    const totalMembersLastMonth = totalMembers - newMembersThisMonth
    const monthlyGrowth =
      totalMembersLastMonth > 0 ? Math.round((newMembersThisMonth / totalMembersLastMonth) * 100) : 0

    // State distribution
    const stateDistribution = await Member.aggregate([
      { $group: { _id: "$state", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { state: "$_id", count: 1, _id: 0 } },
    ])

    // Top referrers
    const topReferrers = await Member.aggregate([
      { $match: { referredBy: { $exists: true, $ne: null } } },
      { $group: { _id: "$referredBy", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ])

    // Get leader names for top referrers
    const referrerCodes = topReferrers.map((r) => r._id)
    const referrerLeaders = await Leader.find({ referralCode: { $in: referrerCodes } }).select("name referralCode")

    const topReferrersWithNames = topReferrers.map((referrer) => {
      const leader = referrerLeaders.find((l) => l.referralCode === referrer._id)
      return {
        name: leader?.name || "Unknown",
        code: referrer._id,
        referrals: referrer.count,
      }
    })

    // Membership trends (last 6 months)
    const membershipTrends = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

      const membersCount = await Member.countDocuments({
        joinedDate: { $gte: monthStart, $lte: monthEnd },
      })

      const leadersCount = await Leader.countDocuments({
        joinedDate: { $gte: monthStart, $lte: monthEnd },
      })

      membershipTrends.push({
        month: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        members: membersCount,
        leaders: leadersCount,
      })
    }

    // Recent activity (mock data for now - in real app, you'd have an activity log)
    const recentMembers = await Member.find()
      .sort({ joinedDate: -1 })
      .limit(5)
      .select("name joinedDate")

    const recentLeaders = await Leader.find()
      .sort({ joinedDate: -1 })
      .limit(3)
      .select("name joinedDate")

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
