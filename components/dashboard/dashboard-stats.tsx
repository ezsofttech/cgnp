"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingUp, UserCheck, Clock } from "lucide-react"

interface DashboardStatsProps {
  leader: any
  members: any[]
}

export function DashboardStats({ leader, members }: DashboardStatsProps) {
  const activeMembers = members.filter((m) => m.status === "active").length
  const pendingMembers = members.filter((m) => m.status === "pending").length
  const volunteers = members.filter((m) => m.isVolunteer).length
  const growthRate = members.length > 0 ? Math.round((members.length / 12) * 100) : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total Members</CardTitle>
          <Users className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl md:text-3xl font-bold text-gray-900">{members.length}</div>
          <p className="text-xs text-gray-500 mt-1">Referred by you</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Active Members</CardTitle>
          <UserCheck className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl md:text-3xl font-bold text-green-600">{activeMembers}</div>
          <p className="text-xs text-gray-500 mt-1">Verified members</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
          <Clock className="h-4 w-4 md:h-5 md:w-5 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl md:text-3xl font-bold text-yellow-600">{pendingMembers}</div>
          <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Growth Rate</CardTitle>
          <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl md:text-3xl font-bold text-purple-600">+{growthRate}%</div>
          <p className="text-xs text-gray-500 mt-1">This year</p>
        </CardContent>
      </Card>
    </div>
  )
}
