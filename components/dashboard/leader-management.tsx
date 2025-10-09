// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Plus, Search, Edit, Trash2, Shield, Mail, Phone, ChevronLeft, ChevronRight } from "lucide-react"
// import { LeaderForm } from "@/components/forms/leader-form"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"

// interface Leader {
//   _id: string
//   name: string
//   email: string
//   position: string
//   role: string
//   phone: string
//   address: string
//   bio: string
//   isActive: boolean
//   joinedDate: string
//   referralCode: string
//   permissions: string[]
// }

// interface LeaderManagementProps {
//   currentLeader: any
// }

// interface Pagination {
//   page: number
//   limit: number
//   total: number
//   pages: number
//   hasNext: boolean
// }

// export function LeaderManagement({ currentLeader }: LeaderManagementProps) {
//   const [leaders, setLeaders] = useState<Leader[]>([])
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [showAddForm, setShowAddForm] = useState(false)
//   const [editingLeader, setEditingLeader] = useState<Leader | null>(null)
//   const [pagination, setPagination] = useState<Pagination>({
//     page: 1,
//     limit: 10,
//     total: 0,
//     pages: 1,
//     hasNext: false
//   })

//   const canManageLeaders = currentLeader?.permissions?.includes("admin_access")

//   useEffect(() => {
//     fetchLeaders()
//   }, [pagination.page, pagination.limit])

//   const fetchLeaders = async () => {
//     try {
//       setLoading(true)
//       const response = await fetch(
//         `/api/leaders?page=${pagination.page}&limit=${pagination.limit}`
//       )
//       const data = await response.json()
//       if (response.ok) {
//         setLeaders(data.data || [])
//         setPagination({
//           page: data.pagination.page,
//           limit: data.pagination.limit,
//           total: data.pagination.total,
//           pages: data.pagination.pages,
//           hasNext: data.pagination.hasNext
//         })
//       }
//     } catch (error) {
//       console.error("Error fetching leaders:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDeleteLeader = async (leaderId: string) => {
//     try {
//       const response = await fetch(`/api/leaders/${leaderId}`, {
//         method: "DELETE",
//       })

//       if (response.ok) {
//         // Reset to first page after deletion to maintain consistent data
//         setPagination(prev => ({ ...prev, page: 1 }))
//       }
//     } catch (error) {
//       console.error("Error deleting leader:", error)
//     }
//   }

//   const handlePageChange = (newPage: number) => {
//     if (newPage >= 1 && newPage <= pagination.pages) {
//       setPagination(prev => ({ ...prev, page: newPage }))
//     }
//   }

//   const handleLimitChange = (newLimit: number) => {
//     setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }))
//   }

//   const filteredLeaders = leaders.filter(
//     (leader) =>
//       leader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       leader.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       leader.position.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   const getRoleBadgeColor = (role: string) => {
//     const colors = {
//       national_convenor: "bg-red-100 text-red-800",
//       deputy_convenor: "bg-orange-100 text-orange-800",
//       policy_head: "bg-blue-100 text-blue-800",
//       organization_secretary: "bg-green-100 text-green-800",
//       state_convenor: "bg-purple-100 text-purple-800",
//       district_convenor: "bg-gray-100 text-gray-800",
//     }
//     return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800"
//   }

//   const formatRole = (role: string) => {
//     return role
//       .split("_")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ")
//   }

//   if (loading) {
//     return (
//       <Card className="border-0 shadow-lg">
//         <CardContent className="flex items-center justify-center py-12">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         </CardContent>
//       </Card>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <Card className="border-0 shadow-lg">
//         <CardHeader>
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//             <div>
//               <CardTitle className="text-xl text-gray-900">Leader Management</CardTitle>
//               <p className="text-sm text-gray-600">Manage AAP leaders and their roles</p>
//             </div>
//             {canManageLeaders && (
//               <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
//                 <DialogTrigger asChild>
//                   <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
//                     <Plus className="h-4 w-4 mr-2" />
//                     Add Leader
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//                   <DialogHeader>
//                     <DialogTitle>Add New Leader</DialogTitle>
//                   </DialogHeader>
//                   <LeaderForm
//                     onSuccess={() => {
//                       setShowAddForm(false)
//                       // Reset to first page to show the newly added leader
//                       setPagination(prev => ({ ...prev, page: 1 }))
//                     }}
//                   />
//                 </DialogContent>
//               </Dialog>
//             )}
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="flex items-center space-x-2 flex-1">
//                 <Search className="h-4 w-4 text-gray-400" />
//                 <Input
//                   placeholder="Search leaders by name, email, or position..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="flex-1"
//                 />
//               </div>
//               <div className="flex items-center space-x-2">
//                 <span className="text-sm text-gray-600">Show:</span>
//                 <select
//                   value={pagination.limit}
//                   onChange={(e) => handleLimitChange(Number(e.target.value))}
//                   className="border rounded-md px-2 py-1 text-sm"
//                 >
//                   <option value="5">5</option>
//                   <option value="10">10</option>
//                   <option value="20">20</option>
//                   <option value="50">50</option>
//                 </select>
//                 <span className="text-sm text-gray-600">per page</span>
//               </div>
//             </div>

//             {/* Mobile Card View */}
//             <div className="md:hidden space-y-4">
//               {filteredLeaders.map((leader) => (
//                 <Card key={leader._id} className="border border-gray-200">
//                   <CardContent className="p-4">
//                     <div className="flex justify-between items-start mb-3">
//                       <div className="flex-1">
//                         <h3 className="font-semibold text-gray-900">{leader.name}</h3>
//                         <p className="text-sm text-gray-600">{leader.position}</p>
//                       </div>
//                       <Badge className={`text-xs ${getRoleBadgeColor(leader.role)}`}>{formatRole(leader.role)}</Badge>
//                     </div>

//                     <div className="space-y-2 text-sm text-gray-600">
//                       <div className="flex items-center">
//                         <Mail className="h-4 w-4 mr-2" />
//                         <span className="truncate">{leader.email}</span>
//                       </div>
//                       <div className="flex items-center">
//                         <Phone className="h-4 w-4 mr-2" />
//                         <span>{leader.phone}</span>
//                       </div>
//                       <div className="flex items-center">
//                         <Shield className="h-4 w-4 mr-2" />
//                         <span>Code: {leader.referralCode}</span>
//                       </div>
//                     </div>

//                     {canManageLeaders && leader._id !== currentLeader._id && (
//                       <div className="flex space-x-2 mt-4">
//                         <Dialog>
//                           <DialogTrigger asChild>
//                             <Button variant="outline" size="sm" className="flex-1 bg-transparent">
//                               <Edit className="h-4 w-4 mr-1" />
//                               Edit
//                             </Button>
//                           </DialogTrigger>
//                           <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//                             <DialogHeader>
//                               <DialogTitle>Edit Leader</DialogTitle>
//                             </DialogHeader>
//                             <LeaderForm
//                               leader={leader}
//                               onSuccess={() => {
//                                 setEditingLeader(null)
//                                 fetchLeaders()
//                               }}
//                             />
//                           </DialogContent>
//                         </Dialog>

//                         <AlertDialog>
//                           <AlertDialogTrigger asChild>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               className="flex-1 text-red-600 hover:text-red-700 bg-transparent"
//                             >
//                               <Trash2 className="h-4 w-4 mr-1" />
//                               Delete
//                             </Button>
//                           </AlertDialogTrigger>
//                           <AlertDialogContent>
//                             <AlertDialogHeader>
//                               <AlertDialogTitle>Delete Leader</AlertDialogTitle>
//                               <AlertDialogDescription>
//                                 Are you sure you want to delete {leader.name}? This action cannot be undone.
//                               </AlertDialogDescription>
//                             </AlertDialogHeader>
//                             <AlertDialogFooter>
//                               <AlertDialogCancel>Cancel</AlertDialogCancel>
//                               <AlertDialogAction
//                                 onClick={() => handleDeleteLeader(leader._id)}
//                                 className="bg-red-600 hover:bg-red-700"
//                               >
//                                 Delete
//                               </AlertDialogAction>
//                             </AlertDialogFooter>
//                           </AlertDialogContent>
//                         </AlertDialog>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>

//             {/* Desktop Table View */}
//             <div className="hidden md:block">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Name</TableHead>
//                     <TableHead>Position</TableHead>
//                     <TableHead>Role</TableHead>
//                     <TableHead>Contact</TableHead>
//                     <TableHead>Code</TableHead>
//                     <TableHead>Status</TableHead>
//                     {canManageLeaders && <TableHead>Actions</TableHead>}
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredLeaders.map((leader) => (
//                     <TableRow key={leader._id}>
//                       <TableCell>
//                         <div>
//                           <div className="font-medium">{leader.name}</div>
//                           <div className="text-sm text-gray-500">{leader.email}</div>
//                         </div>
//                       </TableCell>
//                       <TableCell>{leader.position}</TableCell>
//                       <TableCell>
//                         <Badge className={`${getRoleBadgeColor(leader.role)}`}>{formatRole(leader.role)}</Badge>
//                       </TableCell>
//                       <TableCell>
//                         <div className="text-sm">
//                           <div>{leader.phone}</div>
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <code className="bg-gray-100 px-2 py-1 rounded text-sm">{leader.referralCode}</code>
//                       </TableCell>
//                       <TableCell>
//                         <Badge variant={leader.isActive ? "default" : "secondary"}>
//                           {leader.isActive ? "Active" : "Inactive"}
//                         </Badge>
//                       </TableCell>
//                       {canManageLeaders && (
//                         <TableCell>
//                           {leader._id !== currentLeader._id && (
//                             <div className="flex space-x-2">
//                               <Dialog>
//                                 <DialogTrigger asChild>
//                                   <Button variant="outline" size="sm">
//                                     <Edit className="h-4 w-4" />
//                                   </Button>
//                                 </DialogTrigger>
//                                 <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//                                   <DialogHeader>
//                                     <DialogTitle>Edit Leader</DialogTitle>
//                                   </DialogHeader>
//                                   <LeaderForm
//                                     leader={leader}
//                                     onSuccess={() => {
//                                       setEditingLeader(null)
//                                       fetchLeaders()
//                                     }}
//                                   />
//                                 </DialogContent>
//                               </Dialog>

//                               <AlertDialog>
//                                 <AlertDialogTrigger asChild>
//                                   <Button
//                                     variant="outline"
//                                     size="sm"
//                                     className="text-red-600 hover:text-red-700 bg-transparent"
//                                   >
//                                     <Trash2 className="h-4 w-4" />
//                                   </Button>
//                                 </AlertDialogTrigger>
//                                 <AlertDialogContent>
//                                   <AlertDialogHeader>
//                                     <AlertDialogTitle>Delete Leader</AlertDialogTitle>
//                                     <AlertDialogDescription>
//                                       Are you sure you want to delete {leader.name}? This action cannot be undone.
//                                     </AlertDialogDescription>
//                                   </AlertDialogHeader>
//                                   <AlertDialogFooter>
//                                     <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                     <AlertDialogAction
//                                       onClick={() => handleDeleteLeader(leader._id)}
//                                       className="bg-red-600 hover:bg-red-700"
//                                     >
//                                       Delete
//                                     </AlertDialogAction>
//                                   </AlertDialogFooter>
//                                 </AlertDialogContent>
//                               </AlertDialog>
//                             </div>
//                           )}
//                         </TableCell>
//                       )}
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>

//             {/* Pagination Controls */}
//             <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
//               <div className="text-sm text-gray-600">
//                 Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
//                 {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
//                 {pagination.total} leaders
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => handlePageChange(pagination.page - 1)}
//                   disabled={pagination.page === 1}
//                 >
//                   <ChevronLeft className="h-4 w-4" />
//                   Previous
//                 </Button>
//                 <div className="flex items-center space-x-1">
//                   {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
//                     let pageNum
//                     if (pagination.pages <= 5) {
//                       pageNum = i + 1
//                     } else if (pagination.page <= 3) {
//                       pageNum = i + 1
//                     } else if (pagination.page >= pagination.pages - 2) {
//                       pageNum = pagination.pages - 4 + i
//                     } else {
//                       pageNum = pagination.page - 2 + i
//                     }
//                     return (
//                       <Button
//                         key={pageNum}
//                         variant={pagination.page === pageNum ? "default" : "outline"}
//                         size="sm"
//                         onClick={() => handlePageChange(pageNum)}
//                       >
//                         {pageNum}
//                       </Button>
//                     )
//                   })}
//                   {pagination.pages > 5 && pagination.page < pagination.pages - 2 && (
//                     <span className="px-2">...</span>
//                   )}
//                   {pagination.pages > 5 && pagination.page < pagination.pages - 2 && (
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => handlePageChange(pagination.pages)}
//                     >
//                       {pagination.pages}
//                     </Button>
//                   )}
//                 </div>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => handlePageChange(pagination.page + 1)}
//                   disabled={!pagination.hasNext}
//                 >
//                   Next
//                   <ChevronRight className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>

//             {filteredLeaders.length === 0 && (
//               <div className="text-center py-12">
//                 <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//                 <p className="text-gray-500 text-lg mb-2">No leaders found</p>
//                 <p className="text-gray-400 text-sm">
//                   {searchTerm ? "Try adjusting your search terms" : "No leaders have been added yet"}
//                 </p>
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// ----------1-------------
// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Plus, Search, Edit, Trash2, Shield, Mail, Phone, ChevronLeft, ChevronRight, Copy, Check, Eye } from "lucide-react"
// import { LeaderForm } from "@/components/forms/leader-form"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
// import { usePartyStore } from "@/lib/stores/party-store"

// interface Leader {
//   _id: string
//   name: string
//   email: string
//   position: string
//   role: string
//   phone: string
//   address: string
//   bio: string
//   isActive: boolean
//   joinedDate: string
//   referralCode: string
//   permissions: string[]
// }

// interface LeaderManagementProps {
//   currentLeader: any
//   referralLink?: string
// }

// interface Pagination {
//   page: number
//   limit: number
//   total: number
//   pages: number
//   hasNext: boolean
// }

// interface LeaderCredentials {
//   email: string
//   password: string
//   referralCode: string
//   name: string
//   referralLink?: string
// }

// export function LeaderManagement({ currentLeader, referralLink }: LeaderManagementProps) {
//   const [leaders, setLeaders] = useState<Leader[]>([])
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [showAddForm, setShowAddForm] = useState(false)
//   const [showCredentialsDialog, setShowCredentialsDialog] = useState(false)
//   const [leaderCredentials, setLeaderCredentials] = useState<LeaderCredentials | null>(null)
//   const [editingLeader, setEditingLeader] = useState<Leader | null>(null)
//   const [copiedField, setCopiedField] = useState<string | null>(null)
//   const [viewDetailsLeader, setViewDetailsLeader] = useState<Leader | null>(null)
//   const [pagination, setPagination] = useState<Pagination>({
//     page: 1,
//     limit: 10,
//     total: 0,
//     pages: 1,
//     hasNext: false
//   })

//   // Use the party store
//   const { getReferralLink } = usePartyStore()

//   const canManageLeaders =
//   currentLeader?.permissions?.includes("admin_access") ||
//   currentLeader?.role === "party_admin"


//   useEffect(() => {
//     fetchLeaders()
//   }, [pagination.page, pagination.limit])

//   const fetchLeaders = async () => {
//     try {
//       setLoading(true)
//       const response = await fetch(
//         `/api/leaders?page=${pagination.page}&limit=${pagination.limit}`
//       )
//       const data = await response.json()
//       if (response.ok) {
//         setLeaders(data.data || [])
//         setPagination({
//           page: data.pagination.page,
//           limit: data.pagination.limit,
//           total: data.pagination.total,
//           pages: data.pagination.pages,
//           hasNext: data.pagination.hasNext
//         })
//       }
//     } catch (error) {
//       console.error("Error fetching leaders:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDeleteLeader = async (leaderId: string) => {
//     try {
//       const response = await fetch(`/api/leaders/${leaderId}`, {
//         method: "DELETE",
//       })

//       if (response.ok) {
//         setPagination(prev => ({ ...prev, page: 1 }))
//       }
//     } catch (error) {
//       console.error("Error deleting leader:", error)
//     }
//   }

//   const handlePageChange = (newPage: number) => {
//     if (newPage >= 1 && newPage <= pagination.pages) {
//       setPagination(prev => ({ ...prev, page: newPage }))
//     }
//   }

//   const handleLimitChange = (newLimit: number) => {
//     setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }))
//   }

//   const handleCopyToClipboard = async (text: string, field: string) => {
//     try {
//       await navigator.clipboard.writeText(text)
//       setCopiedField(field)
//       setTimeout(() => setCopiedField(null), 2000)
//     } catch (err) {
//       console.error('Failed to copy text: ', err)
//     }
//   }

//   const handleFormSuccess = async (credentials: LeaderCredentials) => {
//     setShowAddForm(false)
    
//     try {
//       // Use the getReferralLink method from party store to get the referral link
//       const referralData = await getReferralLink(credentials.referralCode)
      
//       setLeaderCredentials({
//         ...credentials,
//         referralLink: referralData.referralLink // Use the link from getReferralLink
//       })
//     } catch (error) {
//       console.error("Error fetching referral link:", error)
//       // Fallback to the old method if getReferralLink fails
//       setLeaderCredentials({
//         ...credentials,
//         referralLink: referralLink || ""
//       })
//     }
    
//     setShowCredentialsDialog(true)
//     setPagination(prev => ({ ...prev, page: 1 }))
//   }

//   const handleViewDetails = async (leader: Leader) => {
//     setViewDetailsLeader(leader)
//   }

//   const filteredLeaders = leaders.filter(
//     (leader) =>
//       leader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       leader.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       leader.position.toLowerCase().includes(searchTerm.toLowerCase())
//   )

// const getRoleBadgeColor = (role: string) => {
//   const colors = {
//     national_convenor: "bg-red-100 text-red-800",
//     deputy_convenor: "bg-orange-100 text-orange-800",
//     policy_head: "bg-blue-100 text-blue-800",
//     organization_secretary: "bg-green-100 text-green-800",
//     state_convenor: "bg-purple-100 text-purple-800",
//     district_convenor: "bg-gray-100 text-gray-800",
//     party_admin: "bg-yellow-100 text-yellow-800", // ✅ Added new role color
//   }
//   return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800"
// }


//   const formatRole = (role: string) => {
//     return role
//       .split("_")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ")
//   }

//   if (loading) {
//     return (
//       <Card className="border-0 shadow-lg">
//         <CardContent className="flex items-center justify-center py-12">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         </CardContent>
//       </Card>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Credentials Dialog - Removed Referral Code */}
//       <Dialog open={showCredentialsDialog} onOpenChange={setShowCredentialsDialog}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle className="text-center">Leader Created Successfully!</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4 p-4">
//             <div className="text-center mb-4">
//               <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
//                 <Check className="h-6 w-6 text-green-600" />
//               </div>
//               <p className="text-sm text-gray-600">
//                 New leader <span className="font-semibold">{leaderCredentials?.name}</span> has been created successfully.
//               </p>
//             </div>

//             <div className="space-y-3">
//               <div>
//                 <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
//                 <div className="flex items-center gap-2">
//                   <Input
//                     value={leaderCredentials?.email || ''}
//                     readOnly
//                     className="flex-1 font-mono text-sm"
//                   />
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() => handleCopyToClipboard(leaderCredentials?.email || '', 'email')}
//                   >
//                     {copiedField === 'email' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
//                   </Button>
//                 </div>
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
//                 <div className="flex items-center gap-2">
//                   <Input
//                     type="password"
//                     value={leaderCredentials?.password || ''}
//                     readOnly
//                     className="flex-1 font-mono text-sm"
//                   />
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() => handleCopyToClipboard(leaderCredentials?.password || '', 'password')}
//                   >
//                     {copiedField === 'password' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
//                   </Button>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-1">
//                   Make sure to save this password securely. It won't be shown again.
//                 </p>
//               </div>

//               {/* Referral Link Section Only - Removed Referral Code */}
//               <div>
//                 <label className="text-sm font-medium text-gray-700 mb-1 block">Referral Link</label>
//                 <div className="flex items-center gap-2">
//                   <Input
//                     value={leaderCredentials?.referralLink || ''}
//                     readOnly
//                     className="flex-1 font-mono text-sm"
//                   />
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() => handleCopyToClipboard(leaderCredentials?.referralLink || '', 'referralLink')}
//                   >
//                     {copiedField === 'referralLink' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
//                   </Button>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-1">
//                   Share this link to invite members under this leader
//                 </p>
//               </div>
//             </div>

//             <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-4">
//               <p className="text-sm text-yellow-800 text-center">
//                 ⚠️ Please save these credentials securely. They cannot be recovered later.
//               </p>
//             </div>

//             <div className="flex justify-center pt-2">
//               <Button 
//                 onClick={() => setShowCredentialsDialog(false)}
//                 className="bg-blue-600 hover:bg-blue-700"
//               >
//                 Done
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* View Details Dialog */}
//       <Dialog open={!!viewDetailsLeader} onOpenChange={() => setViewDetailsLeader(null)}>
//         <DialogContent className="sm:max-w-2xl">
//           <DialogHeader>
//             <DialogTitle className="text-center">Leader Details</DialogTitle>
//           </DialogHeader>
//           {viewDetailsLeader && (
//             <div className="space-y-6 p-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Name:</span>
//                       <span className="font-medium">{viewDetailsLeader.name}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Email:</span>
//                       <span className="font-medium">{viewDetailsLeader.email}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Phone:</span>
//                       <span className="font-medium">{viewDetailsLeader.phone}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Position:</span>
//                       <span className="font-medium">{viewDetailsLeader.position}</span>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-2">Role & Status</h3>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Role:</span>
//                       <Badge className={`${getRoleBadgeColor(viewDetailsLeader.role)}`}>
//                         {formatRole(viewDetailsLeader.role)}
//                       </Badge>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Status:</span>
//                       <Badge variant={viewDetailsLeader.isActive ? "default" : "secondary"}>
//                         {viewDetailsLeader.isActive ? "Active" : "Inactive"}
//                       </Badge>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Joined Date:</span>
//                       <span className="font-medium">{viewDetailsLeader.joinedDate}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Referral Code:</span>
//                       <code className="bg-gray-100 px-2 py-1 rounded text-sm font-medium">
//                         {viewDetailsLeader.referralCode}
//                       </code>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
//                 <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
//                   {viewDetailsLeader.address}
//                 </p>
//               </div>

//               <div>
//                 <h3 className="font-semibold text-gray-900 mb-2">Bio</h3>
//                 <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
//                   {viewDetailsLeader.bio}
//                 </p>
//               </div>

//               <div>
//                 <h3 className="font-semibold text-gray-900 mb-2">Referral Link</h3>
//                 <div className="flex items-center gap-2">
//                   <Input
//                     value={`${window.location.origin}/join?ref=${viewDetailsLeader.referralCode}`}
//                     readOnly
//                     className="flex-1 font-mono text-sm"
//                   />
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() => handleCopyToClipboard(`${window.location.origin}/join?ref=${viewDetailsLeader.referralCode}`, 'detailsReferralLink')}
//                   >
//                     {copiedField === 'detailsReferralLink' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
//                   </Button>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-1">
//                   Copy and share this link for member referrals
//                 </p>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       <Card className="border-0 shadow-lg">
//         <CardHeader>
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//             <div>
//               <CardTitle className="text-xl text-gray-900">Leader Management</CardTitle>
//               <p className="text-sm text-gray-600">Manage CG NP leaders and their roles</p>
//             </div>
//             {canManageLeaders && (
//               <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
//                 <DialogTrigger asChild>
//                   <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
//                     <Plus className="h-4 w-4 mr-2" />
//                     Add Leader
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//                   <DialogHeader>
//                     <DialogTitle>Add New Leader</DialogTitle>
//                   </DialogHeader>
//                   <LeaderForm
//                     onSuccess={handleFormSuccess}
//                   />
//                 </DialogContent>
//               </Dialog>
//             )}
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="flex items-center space-x-2 flex-1">
//                 <Search className="h-4 w-4 text-gray-400" />
//                 <Input
//                   placeholder="Search leaders by name, email, or position..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="flex-1"
//                 />
//               </div>
//               <div className="flex items-center space-x-2">
//                 <span className="text-sm text-gray-600">Show:</span>
//                 <select
//                   value={pagination.limit}
//                   onChange={(e) => handleLimitChange(Number(e.target.value))}
//                   className="border rounded-md px-2 py-1 text-sm"
//                 >
//                   <option value="5">5</option>
//                   <option value="10">10</option>
//                   <option value="20">20</option>
//                   <option value="50">50</option>
//                 </select>
//                 <span className="text-sm text-gray-600">per page</span>
//               </div>
//             </div>

//             {/* Mobile Card View */}
//             <div className="md:hidden space-y-4">
//               {filteredLeaders.map((leader) => (
//                 <Card key={leader._id} className="border border-gray-200">
//                   <CardContent className="p-4">
//                     <div className="flex justify-between items-start mb-3">
//                       <div className="flex-1">
//                         <h3 className="font-semibold text-gray-900">{leader.name}</h3>
//                         <p className="text-sm text-gray-600">{leader.position}</p>
//                       </div>
//                       <Badge className={`text-xs ${getRoleBadgeColor(leader.role)}`}>{formatRole(leader.role)}</Badge>
//                     </div>

//                     <div className="space-y-2 text-sm text-gray-600">
//                       <div className="flex items-center">
//                         <Mail className="h-4 w-4 mr-2" />
//                         <span className="truncate">{leader.email}</span>
//                       </div>
//                       <div className="flex items-center">
//                         <Phone className="h-4 w-4 mr-2" />
//                         <span>{leader.phone}</span>
//                       </div>
//                     </div>

//                     <div className="flex space-x-2 mt-4">
//                       <Button 
//                         variant="outline" 
//                         size="sm" 
//                         className="flex-1 bg-transparent"
//                         onClick={() => handleViewDetails(leader)}
//                       >
//                         <Eye className="h-4 w-4 mr-1" />
//                         View Details
//                       </Button>
                      
//                       {canManageLeaders && leader._id !== currentLeader._id && (
//                         <>
//                           <Dialog>
//                             <DialogTrigger asChild>
//                               <Button variant="outline" size="sm" className="flex-1 bg-transparent">
//                                 <Edit className="h-4 w-4 mr-1" />
//                                 Edit
//                               </Button>
//                             </DialogTrigger>
//                             <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//                               <DialogHeader>
//                                 <DialogTitle>Edit Leader</DialogTitle>
//                               </DialogHeader>
//                               <LeaderForm
//                                 leader={leader}
//                                 onSuccess={() => {
//                                   setEditingLeader(null)
//                                   fetchLeaders()
//                                 }}
//                               />
//                             </DialogContent>
//                           </Dialog>

//                           <AlertDialog>
//                             <AlertDialogTrigger asChild>
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 className="flex-1 text-red-600 hover:text-red-700 bg-transparent"
//                               >
//                                 <Trash2 className="h-4 w-4 mr-1" />
//                                 Delete
//                               </Button>
//                             </AlertDialogTrigger>
//                             <AlertDialogContent>
//                               <AlertDialogHeader>
//                                 <AlertDialogTitle>Delete Leader</AlertDialogTitle>
//                                 <AlertDialogDescription>
//                                   Are you sure you want to delete {leader.name}? This action cannot be undone.
//                                 </AlertDialogDescription>
//                               </AlertDialogHeader>
//                               <AlertDialogFooter>
//                                 <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                 <AlertDialogAction
//                                   onClick={() => handleDeleteLeader(leader._id)}
//                                   className="bg-red-600 hover:bg-red-700"
//                                 >
//                                   Delete
//                                 </AlertDialogAction>
//                               </AlertDialogFooter>
//                             </AlertDialogContent>
//                           </AlertDialog>
//                         </>
//                       )}
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>

//             {/* Desktop Table View */}
//             <div className="hidden md:block">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Name</TableHead>
//                     <TableHead>Position</TableHead>
//                     <TableHead>Role</TableHead>
//                     <TableHead>Contact</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>View Details</TableHead>
//                     {canManageLeaders && <TableHead>Actions</TableHead>}
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredLeaders.map((leader) => (
//                     <TableRow key={leader._id}>
//                       <TableCell>
//                         <div>
//                           <div className="font-medium">{leader.name}</div>
//                           <div className="text-sm text-gray-500">{leader.email}</div>
//                         </div>
//                       </TableCell>
//                       <TableCell>{leader.position}</TableCell>
//                       <TableCell>
//                         <Badge className={`${getRoleBadgeColor(leader.role)}`}>{formatRole(leader.role)}</Badge>
//                       </TableCell>
//                       <TableCell>
//                         <div className="text-sm">
//                           <div>{leader.phone}</div>
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <Badge variant={leader.isActive ? "default" : "secondary"}>
//                           {leader.isActive ? "Active" : "Inactive"}
//                         </Badge>
//                       </TableCell>
//                       <TableCell>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => handleViewDetails(leader)}
//                         >
//                           <Eye className="h-4 w-4 mr-1" />
//                           Details
//                         </Button>
//                       </TableCell>
//                       {canManageLeaders && (
//                         <TableCell>
//                           {leader._id !== currentLeader._id && (
//                             <div className="flex space-x-2">
//                               <Dialog>
//                                 <DialogTrigger asChild>
//                                   <Button variant="outline" size="sm">
//                                     <Edit className="h-4 w-4" />
//                                   </Button>
//                                 </DialogTrigger>
//                                 <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//                                   <DialogHeader>
//                                     <DialogTitle>Edit Leader</DialogTitle>
//                                   </DialogHeader>
//                                   <LeaderForm
//                                     leader={leader}
//                                     onSuccess={() => {
//                                       setEditingLeader(null)
//                                       fetchLeaders()
//                                     }}
//                                   />
//                                 </DialogContent>
//                               </Dialog>

//                               <AlertDialog>
//                                 <AlertDialogTrigger asChild>
//                                   <Button
//                                     variant="outline"
//                                     size="sm"
//                                     className="text-red-600 hover:text-red-700 bg-transparent"
//                                   >
//                                     <Trash2 className="h-4 w-4" />
//                                   </Button>
//                                 </AlertDialogTrigger>
//                                 <AlertDialogContent>
//                                   <AlertDialogHeader>
//                                     <AlertDialogTitle>Delete Leader</AlertDialogTitle>
//                                     <AlertDialogDescription>
//                                       Are you sure you want to delete {leader.name}? This action cannot be undone.
//                                     </AlertDialogDescription>
//                                   </AlertDialogHeader>
//                                   <AlertDialogFooter>
//                                     <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                     <AlertDialogAction
//                                       onClick={() => handleDeleteLeader(leader._id)}
//                                       className="bg-red-600 hover:bg-red-700"
//                                     >
//                                       Delete
//                                     </AlertDialogAction>
//                                   </AlertDialogFooter>
//                                 </AlertDialogContent>
//                               </AlertDialog>
//                             </div>
//                           )}
//                         </TableCell>
//                       )}
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>

//             {/* Pagination Controls */}
//             <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
//               <div className="text-sm text-gray-600">
//                 Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
//                 {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
//                 {pagination.total} leaders
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => handlePageChange(pagination.page - 1)}
//                   disabled={pagination.page === 1}
//                 >
//                   <ChevronLeft className="h-4 w-4" />
//                   Previous
//                 </Button>
//                 <div className="flex items-center space-x-1">
//                   {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
//                     let pageNum
//                     if (pagination.pages <= 5) {
//                       pageNum = i + 1
//                     } else if (pagination.page <= 3) {
//                       pageNum = i + 1
//                     } else if (pagination.page >= pagination.pages - 2) {
//                       pageNum = pagination.pages - 4 + i
//                     } else {
//                       pageNum = pagination.page - 2 + i
//                     }
//                     return (
//                       <Button
//                         key={pageNum}
//                         variant={pagination.page === pageNum ? "default" : "outline"}
//                         size="sm"
//                         onClick={() => handlePageChange(pageNum)}
//                       >
//                         {pageNum}
//                       </Button>
//                     )
//                   })}
//                   {pagination.pages > 5 && pagination.page < pagination.pages - 2 && (
//                     <span className="px-2">...</span>
//                   )}
//                   {pagination.pages > 5 && pagination.page < pagination.pages - 2 && (
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => handlePageChange(pagination.pages)}
//                     >
//                       {pagination.pages}
//                     </Button>
//                   )}
//                 </div>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => handlePageChange(pagination.page + 1)}
//                   disabled={!pagination.hasNext}
//                 >
//                   Next
//                   <ChevronRight className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>

//             {filteredLeaders.length === 0 && (
//               <div className="text-center py-12">
//                 <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//                 <p className="text-gray-500 text-lg mb-2">No leaders found</p>
//                 <p className="text-gray-400 text-sm">
//                   {searchTerm ? "Try adjusting your search terms" : "No leaders have been added yet"}
//                 </p>
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


// ---------------2----------

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, Edit, Trash2, Shield, Mail, Phone, ChevronLeft, ChevronRight, Copy, Check, Eye } from "lucide-react"
import { LeaderForm } from "@/components/forms/leader-form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { usePartyStore } from "@/lib/stores/party-store"

interface Leader {
  _id: string
  name: string
  email: string
  position: string
  role: string
  phone: string
  address: string
  bio: string
  isActive: boolean
  joinedDate: string
  referralCode: string
  permissions: string[]
}

interface LeaderManagementProps {
  currentLeader: any
  referralLink?: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
  hasNext: boolean
}

interface LeaderCredentials {
  email: string
  password: string
  referralCode: string
  name: string
  referralLink?: string
}

export function LeaderManagement({ currentLeader, referralLink }: LeaderManagementProps) {
  const [leaders, setLeaders] = useState<Leader[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [showCredentialsDialog, setShowCredentialsDialog] = useState(false)
  const [leaderCredentials, setLeaderCredentials] = useState<LeaderCredentials | null>(null)
  const [editingLeader, setEditingLeader] = useState<Leader | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [viewDetailsLeader, setViewDetailsLeader] = useState<Leader | null>(null)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
    hasNext: false
  })

  // Use the party store
  const { getReferralLink } = usePartyStore()

  const canManageLeaders = currentLeader?.permissions?.includes("admin_access")
  
  // Check if current leader has party_admin role
  const isPartyAdmin = currentLeader?.role === "party_admin"

  // Only party_admin should have access to actions
  const canPerformActions = isPartyAdmin

  useEffect(() => {
    fetchLeaders()
  }, [pagination.page, pagination.limit])

  const fetchLeaders = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/leaders?page=${pagination.page}&limit=${pagination.limit}`
      )
      const data = await response.json()
      if (response.ok) {
        setLeaders(data.data || [])
        setPagination({
          page: data.pagination.page,
          limit: data.pagination.limit,
          total: data.pagination.total,
          pages: data.pagination.pages,
          hasNext: data.pagination.hasNext
        })
      }
    } catch (error) {
      console.error("Error fetching leaders:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLeader = async (leaderId: string) => {
    try {
      const response = await fetch(`/api/leaders/${leaderId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Refresh the leaders list after deletion
        await fetchLeaders()
      }
    } catch (error) {
      console.error("Error deleting leader:", error)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }))
    }
  }

  const handleLimitChange = (newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }))
  }

  const handleCopyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleFormSuccess = async (credentials: LeaderCredentials) => {
    setShowAddForm(false)
    
    // Generate the referral link using the referral code
    const generatedReferralLink = `${window.location.origin}/join?ref=${credentials.referralCode}`
    
    setLeaderCredentials({
      ...credentials,
      referralLink: generatedReferralLink
    })
    
    setShowCredentialsDialog(true)
    // Refresh the leaders list after adding new leader
    await fetchLeaders()
  }

  const handleEditFormSuccess = async () => {
    setEditingLeader(null)
    // Refresh the leaders list after editing
    await fetchLeaders()
  }

  const handleViewDetails = async (leader: Leader) => {
    setViewDetailsLeader(leader)
  }

  const filteredLeaders = leaders.filter(
    (leader) =>
      leader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leader.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leader.position.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      national_convenor: "bg-red-100 text-red-800",
      deputy_convenor: "bg-orange-100 text-orange-800",
      policy_head: "bg-blue-100 text-blue-800",
      organization_secretary: "bg-green-100 text-green-800",
      state_convenor: "bg-purple-100 text-purple-800",
      district_convenor: "bg-gray-100 text-gray-800",
      party_admin: "bg-indigo-100 text-indigo-800",
    }
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const formatRole = (role: string) => {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Credentials Dialog - Only showing Referral Link */}
      <Dialog open={showCredentialsDialog} onOpenChange={setShowCredentialsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Leader Created Successfully!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">
                New leader <span className="font-semibold">{leaderCredentials?.name}</span> has been created successfully.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                <div className="flex items-center gap-2">
                  <Input
                    value={leaderCredentials?.email || ''}
                    readOnly
                    className="flex-1 font-mono text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyToClipboard(leaderCredentials?.email || '', 'email')}
                  >
                    {copiedField === 'email' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="password"
                    value={leaderCredentials?.password || ''}
                    readOnly
                    className="flex-1 font-mono text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyToClipboard(leaderCredentials?.password || '', 'password')}
                  >
                    {copiedField === 'password' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Make sure to save this password securely. It won't be shown again.
                </p>
              </div>

              {/* Referral Link Section Only - Removed Referral Code */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Referral Link</label>
                <div className="flex items-center gap-2">
                  <Input
                    value={leaderCredentials?.referralLink || ''}
                    readOnly
                    className="flex-1 font-mono text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyToClipboard(leaderCredentials?.referralLink || '', 'referralLink')}
                  >
                    {copiedField === 'referralLink' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Share this link to invite members under this leader
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-4">
              <p className="text-sm text-yellow-800 text-center">
                ⚠️ Please save these credentials securely. They cannot be recovered later.
              </p>
            </div>

            <div className="flex justify-center pt-2">
              <Button 
                onClick={() => setShowCredentialsDialog(false)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={!!viewDetailsLeader} onOpenChange={() => setViewDetailsLeader(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-center">Leader Details</DialogTitle>
          </DialogHeader>
          {viewDetailsLeader && (
            <div className="space-y-6 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{viewDetailsLeader.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{viewDetailsLeader.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{viewDetailsLeader.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Position:</span>
                      <span className="font-medium">{viewDetailsLeader.position}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Role & Status</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Role:</span>
                      <Badge className={`${getRoleBadgeColor(viewDetailsLeader.role)}`}>
                        {formatRole(viewDetailsLeader.role)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant={viewDetailsLeader.isActive ? "default" : "secondary"}>
                        {viewDetailsLeader.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Joined Date:</span>
                      <span className="font-medium">{viewDetailsLeader.joinedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Referral Code:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-medium">
                        {viewDetailsLeader.referralCode}
                      </code>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                  {viewDetailsLeader.address}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Bio</h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                  {viewDetailsLeader.bio}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Referral Link</h3>
                <div className="flex items-center gap-2">
                  <Input
                    value={`${window.location.origin}/join?ref=${viewDetailsLeader.referralCode}`}
                    readOnly
                    className="flex-1 font-mono text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyToClipboard(`${window.location.origin}/join?ref=${viewDetailsLeader.referralCode}`, 'detailsReferralLink')}
                  >
                    {copiedField === 'detailsReferralLink' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Copy and share this link for member referrals
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-xl text-gray-900">Leader Management</CardTitle>
              <p className="text-sm text-gray-600">Manage CG NP leaders and their roles</p>
            </div>
            {/* Show Add Leader button only for party_admin */}
            {canPerformActions && (
              <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Leader
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Leader</DialogTitle>
                  </DialogHeader>
                  <LeaderForm
                    onSuccess={handleFormSuccess}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center space-x-2 flex-1">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search leaders by name, email, or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Show:</span>
                <select
                  value={pagination.limit}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                  className="border rounded-md px-2 py-1 text-sm"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
                <span className="text-sm text-gray-600">per page</span>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {filteredLeaders.map((leader) => (
                <Card key={leader._id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{leader.name}</h3>
                        <p className="text-sm text-gray-600">{leader.position}</p>
                      </div>
                      <Badge className={`text-xs ${getRoleBadgeColor(leader.role)}`}>{formatRole(leader.role)}</Badge>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        <span className="truncate">{leader.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{leader.phone}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 bg-transparent"
                        onClick={() => handleViewDetails(leader)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      
                      {/* Show edit/delete actions only for party_admin and not for current user */}
                      {canPerformActions && leader._id !== currentLeader._id && (
                        <>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Edit Leader</DialogTitle>
                              </DialogHeader>
                              <LeaderForm
                                leader={leader}
                                onSuccess={handleEditFormSuccess}
                              />
                            </DialogContent>
                          </Dialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 text-red-600 hover:text-red-700 bg-transparent"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Leader</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {leader.name}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteLeader(leader._id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>View Details</TableHead>
                    {/* Show Actions column only for party_admin */}
                    {canPerformActions && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeaders.map((leader) => (
                    <TableRow key={leader._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{leader.name}</div>
                          <div className="text-sm text-gray-500">{leader.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{leader.position}</TableCell>
                      <TableCell>
                        <Badge className={`${getRoleBadgeColor(leader.role)}`}>{formatRole(leader.role)}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{leader.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(leader)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </TableCell>
                      {/* Show action buttons only for party_admin and not for current user */}
                      {canPerformActions && (
                        <TableCell>
                          {leader._id !== currentLeader._id && (
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Edit Leader</DialogTitle>
                                  </DialogHeader>
                                  <LeaderForm
                                    leader={leader}
                                    onSuccess={handleEditFormSuccess}
                                  />
                                </DialogContent>
                              </Dialog>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 bg-transparent"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Leader</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete {leader.name}? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteLeader(leader._id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
              <div className="text-sm text-gray-600">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} leaders
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    let pageNum
                    if (pagination.pages <= 5) {
                      pageNum = i + 1
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1
                    } else if (pagination.page >= pagination.pages - 2) {
                      pageNum = pagination.pages - 4 + i
                    } else {
                      pageNum = pagination.page - 2 + i
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={pagination.page === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                  {pagination.pages > 5 && pagination.page < pagination.pages - 2 && (
                    <span className="px-2">...</span>
                  )}
                  {pagination.pages > 5 && pagination.page < pagination.pages - 2 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.pages)}
                    >
                      {pagination.pages}
                    </Button>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNext}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {filteredLeaders.length === 0 && (
              <div className="text-center py-12">
                <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No leaders found</p>
                <p className="text-gray-400 text-sm">
                  {searchTerm ? "Try adjusting your search terms" : "No leaders have been added yet"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}