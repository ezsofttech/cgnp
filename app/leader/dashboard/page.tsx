"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuthStore } from "@/lib/stores/auth-store"
import { usePartyStore } from "@/lib/stores/party-store"
import { Users, LinkIcon, Copy, Plus, LogOut, Shield, UserPlus, BarChart3, Settings } from "lucide-react"
import { MemberForm } from "@/components/forms/member-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LeaderManagement } from "@/components/dashboard/leader-management"
import { MemberManagement } from "@/components/dashboard/member-management"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard"
import { PartyInfoForm } from "@/components/dashboard/party-info"
import { toast } from "@/components/ui/use-toast"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"

export default function LeaderDashboard() {
  const { leader, isInitialized, isAuthenticated, logout, checkAuth } = useAuthStore()
  const { members, fetchMembers, generateReferralLink } = usePartyStore()
  const router = useRouter()
  const [showAddMember, setShowAddMember] = useState(false)
  const [referralLink, setReferralLink] = useState("")
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("analytics")

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push("/leader/login")
    }

    if (leader) {
      const link = generateReferralLink(leader.referralCode)
      setReferralLink(link)
      fetchMembers(leader.referralCode)
    }
  }, [isAuthenticated, isInitialized, leader, generateReferralLink, fetchMembers, router])

  const [initialData, setInitialData] = useState(null)

  useEffect(() => {
    const fetchPartyInfo = async () => {
      try {
        const response = await fetch('/api/party-info')
        const data = await response.json()
        if (response.ok) {
          setInitialData(data.partyInfo)
        } else {
          toast({
            title: "Error",
            description: data.error || "Failed to load party information",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Fetch error:", error)
        toast({
          title: "Error",
          description: "Failed to load party information",
          variant: "destructive",
        })
      }
    }

    fetchPartyInfo()
  }, [])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy link:", error)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  if (!isInitialized || (!isAuthenticated && isInitialized)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const leaderMembers = members
  const hasAnalyticsPermission = leader?.permissions?.includes("view_analytics")
  const hasAdminAccess = leader?.permissions?.includes("admin_access")
  const isPartyAdmin = leader?.role === "party_admin" || hasAdminAccess

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-4 md:py-8">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl md:rounded-2xl p-4 md:p-8 mb-6 md:mb-8 text-white shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold">CG NP Leader Dashboard</h1>
                <p className="text-blue-100 text-base md:text-lg">Welcome back, {leader?.name}</p>
                <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-4 text-sm text-blue-200">
                  <span className="flex items-center space-x-1">
                    <Shield className="h-4 w-4" />
                    <span>{leader?.position}</span>
                  </span>
                  {isPartyAdmin && (
                    <span className="flex items-center space-x-1 bg-blue-500 px-2 py-1 rounded-full text-xs">
                      <Settings className="h-3 w-3" />
                      <span>Party Admin</span>
                    </span>
                  )}
                  <span>Member since {leader?.joinedDate}</span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    <span>Active</span>
                  </span>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 w-full md:w-auto"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Dashboard Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="flex justify-around w-full bg-white shadow-sm">
              {hasAnalyticsPermission && (
                <TabsTrigger value="analytics" className="text-xs md:text-sm">
                  <BarChart3 className="h-4 w-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Analytics</span>
                  <span className="sm:hidden">Charts</span>
                </TabsTrigger>
              )}
              
              <TabsTrigger value="leaders" className="text-xs md:text-sm">
                <Shield className="h-4 w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Leaders</span>
                <span className="sm:hidden">Leaders</span>
              </TabsTrigger>
              
              <TabsTrigger value="members" className="text-xs md:text-sm">
                <Users className="h-4 w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Members</span>
                <span className="sm:hidden">Members</span>
              </TabsTrigger>
              
              <TabsTrigger value="referral" className="text-xs md:text-sm">
                <LinkIcon className="h-4 w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Referral</span>
                <span className="sm:hidden">Refer</span>
              </TabsTrigger>

              {/* New Party Admin Tab */}
              {isPartyAdmin && (
                <TabsTrigger value="admin" className="text-xs md:text-sm">
                  <Settings className="h-4 w-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Member Database</span>
                  <span className="sm:hidden">Member Database</span>
                </TabsTrigger>
              )}

              {hasAdminAccess && (
                <TabsTrigger value="setting" className="text-xs md:text-sm">
                  <BarChart3 className="h-4 w-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Setting</span>
                  <span className="sm:hidden">Party Info</span>
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <DashboardStats leader={leader} members={leaderMembers} />

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-gray-900 flex items-center">
                      <UserPlus className="h-5 w-5 mr-2 text-blue-600" />
                      Quick Add Member
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => setShowAddMember(!showAddMember)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Member
                    </Button>
                    {showAddMember && (
                      <div className="mt-4">
                        <MemberForm referralCode={leader?.referralCode} />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-gray-900 flex items-center">
                      <LinkIcon className="h-5 w-5 mr-2 text-blue-600" />
                      Share Referral
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex space-x-2">
                      <Input value={referralLink} readOnly className="flex-1 bg-gray-50 text-xs md:text-sm" />
                      <Button
                        onClick={handleCopyLink}
                        variant="outline"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent px-3"
                      >
                        <Copy className="h-4 w-4" />
                        <span className="hidden md:inline ml-1">{copied ? "Copied!" : "Copy"}</span>
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">Share this link to invite people to join AAP</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {hasAnalyticsPermission && (
              <TabsContent value="analytics">
                <AnalyticsDashboard leader={leader} />
              </TabsContent>
            )}

            <TabsContent value="leaders">
              <LeaderManagement currentLeader={leader} />
            </TabsContent>

            <TabsContent value="members">
              <MemberManagement members={leaderMembers} currentLeader={leader} />
            </TabsContent>

            {/* New Party Admin Tab Content */}
            {isPartyAdmin && (
              <TabsContent value="admin">
                <AdminDashboard />
              </TabsContent>
            )}

            <TabsContent value="referral" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Referral Management</CardTitle>
                  <p className="text-sm text-gray-600">Manage your referral link and track your referral performance</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{leader?.referralCode}</div>
                      <div className="text-sm text-blue-700">Your Code</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">{leaderMembers?.length}</div>
                      <div className="text-sm text-green-700">Total Referrals</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {leaderMembers?.filter((m) => m.status === "active").length}
                      </div>
                      <div className="text-sm text-yellow-700">Active Members</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Share Your Referral Link</h3>
                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                      <Input value={referralLink} readOnly className="flex-1 bg-gray-50" />
                      <Button
                        onClick={handleCopyLink}
                        variant="outline"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        {copied ? "Copied!" : "Copy Link"}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">
                      Share this link on social media, WhatsApp, or email to invite people to join AAP through your
                      referral
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* New Party Admin Tab Content */}
            {/* {isPartyAdmin && (
              <TabsContent value="admin">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900 flex items-center">
                      <Settings className="h-5 w-5 mr-2 text-blue-600" />
                      Party Administration
                    </CardTitle>
                    <p className="text-sm text-gray-600">Manage party-wide settings and configurations</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Card className="border border-gray-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">System Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-4">Configure party-wide system settings</p>
                          <Button className="w-full bg-blue-600 hover:bg-blue-700">
                            Manage Settings
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="border border-gray-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">User Management</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-4">Manage all users and permissions</p>
                          <Button variant="outline" className="w-full">
                            View All Users
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="border border-gray-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Reports</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-4">Generate party-wide reports</p>
                          <Button variant="outline" className="w-full">
                            Generate Reports
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Quick Actions</h3>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm">
                          Backup Data
                        </Button>
                        <Button variant="outline" size="sm">
                          System Logs
                        </Button>
                        <Button variant="outline" size="sm">
                          Audit Trail
                        </Button>
                        <Button variant="outline" size="sm">
                          Export Data
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )} */}

            <TabsContent value="setting">
              <PartyInfoForm initialData={initialData} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}