"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  TrendingUp,
  UserCheck,
  Clock,
  MapPin,
  Calendar,
  Download,
  RefreshCw,
  BarChart3,
  Activity,
} from "lucide-react"

interface AnalyticsDashboardProps {
  leader: any
}

interface AnalyticsData {
  totalMembers: number
  activeMembers: number
  pendingMembers: number
  totalLeaders: number
  monthlyGrowth: number
  stateDistribution: { state: string; count: number }[]
  membershipTrends: { month: string; members: number; leaders: number }[]
  topReferrers: { name: string; referrals: number; code: string }[]
  recentActivity: { type: string; description: string; timestamp: string }[]
}

export function AnalyticsDashboard({ leader }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30")
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analytics/dashboard?range=${timeRange}`)
      const data = await response.json()

      if (response.ok) {
        setAnalytics(data)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchAnalytics()
  }

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/analytics/export?range=${timeRange}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `aap-analytics-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error exporting data:", error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="flex items-center justify-center py-8 md:py-12">
            <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-blue-600"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!analytics) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="flex items-center justify-center py-8 md:py-12">
          <p className="text-gray-500 text-sm md:text-base">Failed to load analytics data</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Analytics Header */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 md:gap-4">
            <div className="space-y-2 flex-1">
              <CardTitle className="text-lg md:text-xl text-gray-900 flex items-center">
                <BarChart3 className="h-5 w-5 md:h-6 md:w-6 mr-2 text-blue-600" />
                Analytics Dashboard
              </CardTitle>
              <p className="text-xs md:text-sm text-gray-600">
                Comprehensive insights into party growth and member engagement
              </p>
            </div>
            <div className="flex flex-col xs:flex-row gap-2 w-full lg:w-auto">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-full lg:w-40 text-sm">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 3 months</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  size="sm"
                  disabled={refreshing}
                  className="bg-transparent flex-1 lg:flex-none text-xs"
                >
                  <RefreshCw className={`h-3 w-3 md:h-4 md:w-4 mr-1 ${refreshing ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button onClick={handleExport} variant="outline" size="sm" className="bg-transparent text-xs">
                  <Download className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-gray-600">Total Members</CardTitle>
            <Users className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">{analytics.totalMembers}</div>
            <p className="text-xs text-green-600 mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />+{analytics.monthlyGrowth}% this month
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-gray-600">Active Members</CardTitle>
            <UserCheck className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl lg:text-3xl font-bold text-green-600">{analytics.activeMembers}</div>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round((analytics.activeMembers / analytics.totalMembers) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-gray-600">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 md:h-5 md:w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl lg:text-3xl font-bold text-yellow-600">{analytics.pendingMembers}</div>
            <p className="text-xs text-gray-500 mt-1">Awaiting verification</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-gray-600">Total Leaders</CardTitle>
            <Activity className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-600">{analytics.totalLeaders}</div>
            <p className="text-xs text-gray-500 mt-1">Active leadership</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        {/* State Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg text-gray-900 flex items-center">
              <MapPin className="h-4 w-4 md:h-5 md:w-5 mr-2 text-blue-600" />
              State-wise Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {analytics.stateDistribution.slice(0, 8).map((state, index) => (
                <div key={state.state} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-600 flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900 text-sm md:text-base truncate">{state.state}</span>
                  </div>
                  <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
                    <div className="w-16 md:w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(state.count / analytics.stateDistribution[0].count) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs md:text-sm font-semibold text-gray-600 w-6 md:w-8 text-right">
                      {state.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Referrers */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg text-gray-900 flex items-center">
              <TrendingUp className="h-4 w-4 md:h-5 md:w-5 mr-2 text-green-600" />
              Top Referrers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {analytics.topReferrers.slice(0, 6).map((referrer, index) => (
                <div key={referrer.code} className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
                    <div
                      className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                            ? "bg-gray-400"
                            : index === 2
                              ? "bg-orange-500"
                              : "bg-blue-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 text-sm md:text-base truncate">{referrer.name}</div>
                      <div className="text-xs text-gray-500 truncate">Code: {referrer.code}</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs md:text-sm flex-shrink-0 ml-2">
                    {referrer.referrals} ref
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Membership Trends */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-base md:text-lg text-gray-900 flex items-center">
            <Calendar className="h-4 w-4 md:h-5 md:w-5 mr-2 text-purple-600" />
            Growth Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 md:space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {analytics.membershipTrends.slice(-4).map((trend, index) => (
                <div key={trend.month} className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 md:p-4 rounded-lg">
                  <div className="text-xs md:text-sm font-medium text-gray-600 truncate">{trend.month}</div>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Members</span>
                      <span className="text-xs md:text-sm font-bold text-blue-600">{trend.members}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Leaders</span>
                      <span className="text-xs md:text-sm font-bold text-purple-600">{trend.leaders}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-base md:text-lg text-gray-900 flex items-center">
            <Activity className="h-4 w-4 md:h-5 md:w-5 mr-2 text-orange-600" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 md:space-y-3">
            {analytics.recentActivity.slice(0, 8).map((activity, index) => (
              <div key={index} className="flex items-start space-x-2 md:space-x-3 p-2 md:p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div
                  className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    activity.type === "member_join"
                      ? "bg-green-500"
                      : activity.type === "leader_add"
                        ? "bg-blue-500"
                        : activity.type === "member_approve"
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                  }`}
                ></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-gray-900 leading-relaxed">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(activity.timestamp).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}