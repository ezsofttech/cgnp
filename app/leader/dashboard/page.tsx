// "use client"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { Header } from "@/components/layout/header"
// import { Footer } from "@/components/layout/footer"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { useAuthStore } from "@/lib/stores/auth-store"
// import { usePartyStore } from "@/lib/stores/party-store"
// import { Users, LinkIcon, Copy, Plus, LogOut, Shield, UserPlus, BarChart3, Settings } from "lucide-react"
// import { MemberForm } from "@/components/forms/member-form"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { LeaderManagement } from "@/components/dashboard/leader-management"
// import { MemberManagement } from "@/components/dashboard/member-management"
// import { DashboardStats } from "@/components/dashboard/dashboard-stats"
// import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard"
// import { PartyInfoForm } from "@/components/dashboard/party-info"
// import { toast } from "@/components/ui/use-toast"
// import { AdminDashboard } from "@/components/dashboard/admin-dashboard"

// export default function LeaderDashboard() {
//   const { leader, isInitialized, isAuthenticated, logout, checkAuth } = useAuthStore()
//   const { members, fetchMembers, generateReferralLink } = usePartyStore()
//   const router = useRouter()
//   const [showAddMember, setShowAddMember] = useState(false)
//   const [referralLink, setReferralLink] = useState("")
//   const [copied, setCopied] = useState(false)
//   const [activeTab, setActiveTab] = useState("analytics")

//   useEffect(() => {
//     checkAuth()
//   }, [checkAuth])

//   useEffect(() => {
//     if (isInitialized && !isAuthenticated) {
//       router.push("/leader/login")
//     }

//     if (leader) {
//       const link = generateReferralLink(leader.referralCode)
//       setReferralLink(link)
//       fetchMembers(leader.referralCode)
//     }
//   }, [isAuthenticated, isInitialized, leader, generateReferralLink, fetchMembers, router])

//   const [initialData, setInitialData] = useState(null)

//   useEffect(() => {
//     const fetchPartyInfo = async () => {
//       try {
//         const response = await fetch('/api/party-info')
//         const data = await response.json()
//         if (response.ok) {
//           setInitialData(data.partyInfo)
//         } else {
//           toast({
//             title: "Error",
//             description: data.error || "Failed to load party information",
//             variant: "destructive",
//           })
//         }
//       } catch (error) {
//         console.error("Fetch error:", error)
//         toast({
//           title: "Error",
//           description: "Failed to load party information",
//           variant: "destructive",
//         })
//       }
//     }

//     fetchPartyInfo()
//   }, [])

//   const handleCopyLink = async () => {
//     try {
//       await navigator.clipboard.writeText(referralLink)
//       setCopied(true)
//       setTimeout(() => setCopied(false), 2000)
//     } catch (error) {
//       console.error("Failed to copy link:", error)
//     }
//   }

//   const handleLogout = async () => {
//     await logout()
//     router.push("/")
//   }

//   if (!isInitialized || (!isAuthenticated && isInitialized)) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
//       </div>
//     )
//   }

//   const leaderMembers = members
//   const hasAnalyticsPermission = leader?.permissions?.includes("view_analytics")
//   const hasAdminAccess = leader?.permissions?.includes("admin_access")
//   const isPartyAdmin = leader?.role === "party_admin" || hasAdminAccess

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />
//       <main className="py-4 md:py-8">
//         <div className="container mx-auto px-3 sm:px-4">
//           {/* Header Section - Improved Mobile Responsiveness */}
//           <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl md:rounded-2xl p-4 md:p-8 mb-4 md:mb-8 text-white shadow-xl">
//             <div className="flex flex-col md:flex-row justify-between items-start gap-3 md:gap-4">
//               <div className="space-y-2 flex-1 min-w-0">
//                 <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">JCBP Leader Dashboard</h1>
//                 <p className="text-blue-100 text-sm sm:text-base md:text-lg truncate">Welcome back, {leader?.name}</p>
//                 <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 md:gap-4 text-xs sm:text-sm text-blue-200 flex-wrap">
//                   <span className="flex items-center space-x-1 bg-blue-500/30 px-2 py-1 rounded-full">
//                     <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
//                     <span className="truncate">{leader?.position}</span>
//                   </span>
//                   {isPartyAdmin && (
//                     <span className="flex items-center space-x-1 bg-blue-500 px-2 py-1 rounded-full text-xs">
//                       <Settings className="h-3 w-3" />
//                       <span>Party Admin</span>
//                     </span>
//                   )}
//                   <span className="truncate">Member since {leader?.joinedDate}</span>
//                   <span className="flex items-center space-x-1">
//                     <span className="w-2 h-2 bg-green-400 rounded-full"></span>
//                     <span>Active</span>
//                   </span>
//                 </div>
//               </div>
//               <Button
//                 onClick={handleLogout}
//                 variant="outline"
//                 className="bg-white/10 border-white/20 text-white hover:bg-white/20 w-full md:w-auto mt-3 md:mt-0 text-sm"
//                 size="sm"
//               >
//                 <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
//                 Logout
//               </Button>
//             </div>
//           </div>

//           {/* Dashboard Tabs - Improved Mobile Responsiveness */}
// <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 md:space-y-6">
// <TabsList
//   className="
//     grid w-full shadow-sm p-1 gap-1 rounded-md
//     grid-cols-3 sm:flex sm:flex-nowrap sm:gap-2 mb-16
//     bg-transparent sm:bg-white
//   "
// >

//   {hasAnalyticsPermission && (
//     <TabsTrigger
//       value="analytics"
//       className="flex-1 text-xs p-2 h-auto min-h-[40px] flex items-center justify-center"
//     >
//       <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
//       <span>Analytics</span>
//     </TabsTrigger>
//   )}

//   <TabsTrigger
//     value="leaders"
//     className="flex-1 text-xs p-2 h-auto min-h-[40px] flex items-center justify-center"
//   >
//     <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
//     <span>Leaders</span>
//   </TabsTrigger>

//   <TabsTrigger
//     value="members"
//     className="flex-1 text-xs p-2 h-auto min-h-[40px] flex items-center justify-center"
//   >
//     <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
//     <span>Members</span>
//   </TabsTrigger>

//   <TabsTrigger
//     value="referral"
//     className="flex-1 text-xs p-2 h-auto min-h-[40px] flex items-center justify-center"
//   >
//     <LinkIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
//     <span>Referral</span>
//   </TabsTrigger>

//   {isPartyAdmin && (
//     <TabsTrigger
//       value="admin"
//       className="flex-1 text-xs p-2 h-auto min-h-[40px] flex items-center justify-center"
//     >
//       <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
//       <span>Database</span>
//     </TabsTrigger>
//   )}

//   {hasAdminAccess && (
//     <TabsTrigger
//       value="setting"
//       className="flex-1 text-xs p-2 h-auto min-h-[40px] flex items-center justify-center"
//     >
//       <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
//       <span>Party Info</span>
//     </TabsTrigger>
//   )}
// </TabsList>



//   <TabsContent value="overview" className="space-y-4 md:space-y-6">
//     <DashboardStats leader={leader} members={leaderMembers} />

//     {/* Quick Actions - Improved Mobile Layout */}
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
//       <Card className="border-0 shadow-lg">
//         <CardHeader className="pb-3">
//           <CardTitle className="text-base md:text-lg text-gray-900 flex items-center">
//             <UserPlus className="h-4 w-4 md:h-5 md:w-5 mr-2 text-blue-600" />
//             Quick Add Member
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Button
//             onClick={() => setShowAddMember(!showAddMember)}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-sm"
//             size="sm"
//           >
//             <Plus className="h-3 w-3 md:h-4 md:w-4 mr-2" />
//             Add New Member
//           </Button>
//           {showAddMember && (
//             <div className="mt-4">
//               <MemberForm referralCode={leader?.referralCode} />
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       <Card className="border-0 shadow-lg">
//         <CardHeader className="pb-3">
//           <CardTitle className="text-base md:text-lg text-gray-900 flex items-center">
//             <LinkIcon className="h-4 w-4 md:h-5 md:w-5 mr-2 text-blue-600" />
//             Share Referral
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-3">
//           <div className="flex flex-col xs:flex-row gap-2 xs:space-x-2">
//             <Input 
//               value={referralLink} 
//               readOnly 
//               className="flex-1 bg-gray-50 text-xs md:text-sm min-w-0" 
//             />
//             <Button
//               onClick={handleCopyLink}
//               variant="outline"
//               className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent px-3 text-sm whitespace-nowrap"
//               size="sm"
//             >
//               <Copy className="h-3 w-3 md:h-4 md:w-4" />
//               <span className="ml-1">{copied ? "Copied!" : "Copy"}</span>
//             </Button>
//           </div>
//           <p className="text-xs text-gray-500">Share this link to invite people to join AAP</p>
//         </CardContent>
//       </Card>
//     </div>
//   </TabsContent>

//   {hasAnalyticsPermission && (
//     <TabsContent value="analytics">
//       <AnalyticsDashboard leader={leader} />
//     </TabsContent>
//   )}

//   <TabsContent value="leaders">
//     <LeaderManagement currentLeader={leader} />
//   </TabsContent>

//   <TabsContent value="members">
//     <MemberManagement members={leaderMembers} currentLeader={leader} />
//   </TabsContent>

//   {/* New Party Admin Tab Content */}
//   {isPartyAdmin && (
//     <TabsContent value="admin">
//       <AdminDashboard />
//     </TabsContent>
//   )}

//   <TabsContent value="referral" className="space-y-4 md:space-y-6">
//     <Card className="border-0 shadow-lg">
//       <CardHeader>
//         <CardTitle className="text-lg md:text-xl text-gray-900">Referral Management</CardTitle>
//         <p className="text-xs md:text-sm text-gray-600">Manage your referral link and track your referral performance</p>
//       </CardHeader>
//       <CardContent className="space-y-4 md:space-y-6">
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
//           <div className="bg-blue-50 p-3 md:p-4 rounded-lg text-center">
//             <div className="text-xl md:text-2xl font-bold text-blue-600 truncate">{leader?.referralCode}</div>
//             <div className="text-xs md:text-sm text-blue-700">Your Code</div>
//           </div>
//           <div className="bg-green-50 p-3 md:p-4 rounded-lg text-center">
//             <div className="text-xl md:text-2xl font-bold text-green-600">{leaderMembers?.length}</div>
//             <div className="text-xs md:text-sm text-green-700">Total Referrals</div>
//           </div>
//           <div className="bg-yellow-50 p-3 md:p-4 rounded-lg text-center">
//             <div className="text-xl md:text-2xl font-bold text-yellow-600">
//               {leaderMembers?.filter((m) => m.status === "active").length}
//             </div>
//             <div className="text-xs md:text-sm text-yellow-700">Active Members</div>
//           </div>
//         </div>

//         <div className="space-y-3 md:space-y-4">
//           <h3 className="font-semibold text-gray-900 text-base md:text-lg">Share Your Referral Link</h3>
//           <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
//             <Input value={referralLink} readOnly className="flex-1 bg-gray-50 text-xs md:text-sm" />
//             <Button
//               onClick={handleCopyLink}
//               variant="outline"
//               className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent text-sm whitespace-nowrap"
//               size="sm"
//             >
//               <Copy className="h-3 w-3 md:h-4 md:w-4 mr-2" />
//               {copied ? "Copied!" : "Copy Link"}
//             </Button>
//           </div>
//           <p className="text-xs md:text-sm text-gray-500">
//             Share this link on social media, WhatsApp, or email to invite people to join JC BP through your
//             referral
//           </p>
//         </div>
//       </CardContent>
//     </Card>
//   </TabsContent>

//   <TabsContent value="setting">
//     <PartyInfoForm initialData={initialData} />
//   </TabsContent>
// </Tabs>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   )
// }


// ----------1-


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
  const [membersData, setMembersData] = useState({
    members: [],
    pagination: { page: 1, limit: 10, total: 0, pages: 1 }
  })

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
      loadMembers()
    }
  }, [isAuthenticated, isInitialized, leader, generateReferralLink, router])

  const loadMembers = async (page = 1, limit = 10) => {
    try {
      const response = await fetch(`/api/members?page=${page}&limit=${limit}`)
      const data = await response.json()
      
      if (response.ok) {
        setMembersData({
          members: data.members || [],
          pagination: data.pagination || { page, limit, total: 0, pages: 1 }
        })
      }
    } catch (error) {
      console.error("Error loading members:", error)
    }
  }

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

  const hasAnalyticsPermission = leader?.permissions?.includes("view_analytics")
  const hasAdminAccess = leader?.permissions?.includes("admin_access")
  const isPartyAdmin = leader?.role === "party_admin" || hasAdminAccess

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-4 md:py-8">
        <div className="container mx-auto px-3 sm:px-4">
          {/* Header Section - Improved Mobile Responsiveness */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl md:rounded-2xl p-4 md:p-8 mb-4 md:mb-8 text-white shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-start gap-3 md:gap-4">
              <div className="space-y-2 flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">JCBP Leader Dashboard</h1>
                <p className="text-blue-100 text-sm sm:text-base md:text-lg truncate">Welcome back, {leader?.name}</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 md:gap-4 text-xs sm:text-sm text-blue-200 flex-wrap">
                  <span className="flex items-center space-x-1 bg-blue-500/30 px-2 py-1 rounded-full">
                    <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="truncate">{leader?.position}</span>
                  </span>
                  {isPartyAdmin && (
                    <span className="flex items-center space-x-1 bg-blue-500 px-2 py-1 rounded-full text-xs">
                      <Settings className="h-3 w-3" />
                      <span>Party Admin</span>
                    </span>
                  )}
                  <span className="truncate">Member since {leader?.joinedDate}</span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    <span>Active</span>
                  </span>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 w-full md:w-auto mt-3 md:mt-0 text-sm"
                size="sm"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Dashboard Tabs - Improved Mobile Responsiveness */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 md:space-y-6">
            <TabsList
              className="
                grid w-full shadow-sm p-1 gap-1 rounded-md
                grid-cols-3 sm:flex sm:flex-nowrap sm:gap-2 mb-16
                bg-transparent sm:bg-white
              "
            >

              {hasAnalyticsPermission && (
                <TabsTrigger
                  value="analytics"
                  className="flex-1 text-xs p-2 h-auto min-h-[40px] flex items-center justify-center"
                >
                  <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span>Analytics</span>
                </TabsTrigger>
              )}

              <TabsTrigger
                value="leaders"
                className="flex-1 text-xs p-2 h-auto min-h-[40px] flex items-center justify-center"
              >
                <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span>Leaders</span>
              </TabsTrigger>

              <TabsTrigger
                value="members"
                className="flex-1 text-xs p-2 h-auto min-h-[40px] flex items-center justify-center"
              >
                <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span>Members</span>
              </TabsTrigger>

              <TabsTrigger
                value="referral"
                className="flex-1 text-xs p-2 h-auto min-h-[40px] flex items-center justify-center"
              >
                <LinkIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span>Referral</span>
              </TabsTrigger>

              {isPartyAdmin && (
                <TabsTrigger
                  value="admin"
                  className="flex-1 text-xs p-2 h-auto min-h-[40px] flex items-center justify-center"
                >
                  <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span>Database</span>
                </TabsTrigger>
              )}

              {hasAdminAccess && (
                <TabsTrigger
                  value="setting"
                  className="flex-1 text-xs p-2 h-auto min-h-[40px] flex items-center justify-center"
                >
                  <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span>Party Info</span>
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="overview" className="space-y-4 md:space-y-6">
              <DashboardStats leader={leader} members={membersData.members} />

              {/* Quick Actions - Improved Mobile Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base md:text-lg text-gray-900 flex items-center">
                      <UserPlus className="h-4 w-4 md:h-5 md:w-5 mr-2 text-blue-600" />
                      Quick Add Member
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => setShowAddMember(!showAddMember)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-sm"
                      size="sm"
                    >
                      <Plus className="h-3 w-3 md:h-4 md:w-4 mr-2" />
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
                    <CardTitle className="text-base md:text-lg text-gray-900 flex items-center">
                      <LinkIcon className="h-4 w-4 md:h-5 md:w-5 mr-2 text-blue-600" />
                      Share Referral
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-col xs:flex-row gap-2 xs:space-x-2">
                      <Input 
                        value={referralLink} 
                        readOnly 
                        className="flex-1 bg-gray-50 text-xs md:text-sm min-w-0" 
                      />
                      <Button
                        onClick={handleCopyLink}
                        variant="outline"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent px-3 text-sm whitespace-nowrap"
                        size="sm"
                      >
                        <Copy className="h-3 w-3 md:h-4 md:w-4" />
                        <span className="ml-1">{copied ? "Copied!" : "Copy"}</span>
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
              <MemberManagement 
                initialMembers={membersData.members}
                initialPagination={membersData.pagination}
                currentLeader={leader}
                onMemberDeleted={() => loadMembers(membersData.pagination.page, membersData.pagination.limit)}
              />
            </TabsContent>

            {/* New Party Admin Tab Content */}
            {isPartyAdmin && (
              <TabsContent value="admin">
                <AdminDashboard />
              </TabsContent>
            )}

            <TabsContent value="referral" className="space-y-4 md:space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl text-gray-900">Referral Management</CardTitle>
                  <p className="text-xs md:text-sm text-gray-600">Manage your referral link and track your referral performance</p>
                </CardHeader>
                <CardContent className="space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                    <div className="bg-blue-50 p-3 md:p-4 rounded-lg text-center">
                      <div className="text-xl md:text-2xl font-bold text-blue-600 truncate">{leader?.referralCode}</div>
                      <div className="text-xs md:text-sm text-blue-700">Your Code</div>
                    </div>
                    <div className="bg-green-50 p-3 md:p-4 rounded-lg text-center">
                      <div className="text-xl md:text-2xl font-bold text-green-600">{membersData.members?.length}</div>
                      <div className="text-xs md:text-sm text-green-700">Total Referrals</div>
                    </div>
                    <div className="bg-yellow-50 p-3 md:p-4 rounded-lg text-center">
                      <div className="text-xl md:text-2xl font-bold text-yellow-600">
                        {membersData.members?.filter((m) => m.status === "active").length}
                      </div>
                      <div className="text-xs md:text-sm text-yellow-700">Active Members</div>
                    </div>
                  </div>

                  <div className="space-y-3 md:space-y-4">
                    <h3 className="font-semibold text-gray-900 text-base md:text-lg">Share Your Referral Link</h3>
                    <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
                      <Input value={referralLink} readOnly className="flex-1 bg-gray-50 text-xs md:text-sm" />
                      <Button
                        onClick={handleCopyLink}
                        variant="outline"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent text-sm whitespace-nowrap"
                        size="sm"
                      >
                        <Copy className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                        {copied ? "Copied!" : "Copy Link"}
                      </Button>
                    </div>
                    <p className="text-xs md:text-sm text-gray-500">
                      Share this link on social media, WhatsApp, or email to invite people to join JC BP through your
                      referral
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

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