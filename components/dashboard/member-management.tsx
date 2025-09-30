// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Search, Users, Mail, Phone, MapPin, Calendar, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight } from "lucide-react"
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
// import { Member } from "@/types"

// interface MemberManagementProps {
//   initialMembers: Member[]
//   initialPagination: {
//     page: number
//     limit: number
//     total: number
//     pages: number
//   }
//   currentLeader?: any
// }

// export function MemberManagement({ 
//   initialMembers = [], 
//   initialPagination = { page: 1, limit: 10, total: 0, pages: 1 },
//   currentLeader 
// }: MemberManagementProps) {
//   const [members, setMembers] = useState<Member[]>(initialMembers)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [pagination, setPagination] = useState(initialPagination)
//   const [loading, setLoading] = useState(false)

//   const canManageMembers =
//     currentLeader?.permissions?.includes("manage_members") || 
//     currentLeader?.permissions?.includes("admin_access")

//   useEffect(() => {
//     fetchMembers()
//   }, [pagination.page, pagination.limit, statusFilter])

//   const fetchMembers = async () => {
//     try {
//       setLoading(true)
//       const params = new URLSearchParams({
//         page: pagination.page.toString(),
//         limit: pagination.limit.toString(),
//         ...(statusFilter !== "all" && { status: statusFilter }),
//         ...(searchTerm && { search: searchTerm }),
//         // ...(currentLeader?.referralCode && { referredBy: currentLeader.referralCode })
//       })

//       const response = await fetch(`/api/members?${params}`)
//       const data = await response.json()
// console.log("data",data);

//       if (response.ok) {
//         setMembers(data.members || [])
//         setPagination(data.pagination)
//       }
//     } catch (error) {
//       console.error("Error fetching members:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleStatusUpdate = async (memberId: string, newStatus: string) => {
//     try {
//       const response = await fetch(`/api/members/${memberId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ status: newStatus }),
//       })

//       if (response.ok) {
//         fetchMembers() // Refresh the data
//       }
//     } catch (error) {
//       console.error("Error updating member status:", error)
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

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault()
//     setPagination(prev => ({ ...prev, page: 1 }))
//   }

//   const getStatusBadgeColor = (status: string) => {
//     const colors = {
//       active: "bg-green-100 text-green-800",
//       pending: "bg-yellow-100 text-yellow-800",
//       inactive: "bg-gray-100 text-gray-800",
//     }
//     return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
//   }

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "active":
//         return <CheckCircle className="h-4 w-4 text-green-600" />
//       case "pending":
//         return <Clock className="h-4 w-4 text-yellow-600" />
//       case "inactive":
//         return <XCircle className="h-4 w-4 text-gray-600" />
//       default:
//         return null
//     }
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
//               <CardTitle className="text-xl text-gray-900">Member Management</CardTitle>
//               <p className="text-sm text-gray-600">View and manage your referred members</p>
//             </div>
//             <div className="flex flex-col md:flex-row items-start md:items-center gap-4 text-sm text-gray-600">
//               <div className="flex gap-4">
//                 <span>Total: {pagination.total}</span>
//                 <span>Page: {pagination.page} of {pagination.pages}</span>
//               </div>
//               {canManageMembers && (
//                 <div className="flex gap-2">
//                   <Button
//                     variant={statusFilter === "all" ? "default" : "outline"}
//                     size="sm"
//                     onClick={() => setStatusFilter("all")}
//                   >
//                     All
//                   </Button>
//                   <Button
//                     variant={statusFilter === "pending" ? "default" : "outline"}
//                     size="sm"
//                     onClick={() => setStatusFilter("pending")}
//                   >
//                     Pending
//                   </Button>
//                   <Button
//                     variant={statusFilter === "active" ? "default" : "outline"}
//                     size="sm"
//                     onClick={() => setStatusFilter("active")}
//                   >
//                     Active
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
//               <div className="flex items-center space-x-2 flex-1">
//                 <Search className="h-4 w-4 text-gray-400" />
//                 <Input
//                   placeholder="Search members by name, email, phone, or location..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="flex-1"
//                 />
//                 <Button type="submit" variant="outline">
//                   Search
//                 </Button>
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
//             </form>

//             {/* Mobile Card View */}
//             <div className="md:hidden space-y-4">
//               {members.map((member) => (
//                 <Card key={member._id} className="border border-gray-200">
//                   <CardContent className="p-4">
//                     <div className="flex justify-between items-start mb-3">
//                       <div className="flex-1">
//                         <h3 className="font-semibold text-gray-900">{member.name}</h3>
//                         <p className="text-sm text-gray-600">ID: {member.membershipId}</p>
//                       </div>
//                       <div className="flex flex-col items-end space-y-1">
//                         <Badge className={`text-xs ${getStatusBadgeColor(member.status)} flex items-center gap-1`}>
//                           {getStatusIcon(member.status)}
//                           {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
//                         </Badge>
//                         {member.isVolunteer && (
//                           <Badge variant="outline" className="text-xs">
//                             Volunteer
//                           </Badge>
//                         )}
//                       </div>
//                     </div>

//                     <div className="space-y-2 text-sm text-gray-600">
//                       <div className="flex items-center">
//                         <Mail className="h-4 w-4 mr-2" />
//                         <span className="truncate">{member.email}</span>
//                       </div>
//                       <div className="flex items-center">
//                         <Phone className="h-4 w-4 mr-2" />
//                         <span>{member.phone}</span>
//                       </div>
//                       <div className="flex items-center">
//                         <MapPin className="h-4 w-4 mr-2" />
//                         <span className="truncate">
//                           {member.district}, {member.state}
//                         </span>
//                       </div>
//                       <div className="flex items-center">
//                         <Calendar className="h-4 w-4 mr-2" />
//                         <span>{new Date(member.joinedDate).toLocaleDateString("en-IN")}</span>
//                       </div>
//                     </div>

//                     {canManageMembers && member.status === "pending" && (
//                       <div className="flex space-x-2 mt-4">
//                         <AlertDialog>
//                           <AlertDialogTrigger asChild>
//                             <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
//                               <CheckCircle className="h-4 w-4 mr-1" />
//                               Approve
//                             </Button>
//                           </AlertDialogTrigger>
//                           <AlertDialogContent>
//                             <AlertDialogHeader>
//                               <AlertDialogTitle>Approve Member</AlertDialogTitle>
//                               <AlertDialogDescription>
//                                 Are you sure you want to approve {member.name} as an active member?
//                               </AlertDialogDescription>
//                             </AlertDialogHeader>
//                             <AlertDialogFooter>
//                               <AlertDialogCancel>Cancel</AlertDialogCancel>
//                               <AlertDialogAction
//                                 onClick={() => handleStatusUpdate(member._id, "active")}
//                                 className="bg-green-600 hover:bg-green-700"
//                               >
//                                 Approve
//                               </AlertDialogAction>
//                             </AlertDialogFooter>
//                           </AlertDialogContent>
//                         </AlertDialog>

//                         <AlertDialog>
//                           <AlertDialogTrigger asChild>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               className="flex-1 text-red-600 hover:text-red-700 bg-transparent"
//                             >
//                               <XCircle className="h-4 w-4 mr-1" />
//                               Reject
//                             </Button>
//                           </AlertDialogTrigger>
//                           <AlertDialogContent>
//                             <AlertDialogHeader>
//                               <AlertDialogTitle>Reject Member</AlertDialogTitle>
//                               <AlertDialogDescription>
//                                 Are you sure you want to reject {member.name}'s membership application?
//                               </AlertDialogDescription>
//                             </AlertDialogHeader>
//                             <AlertDialogFooter>
//                               <AlertDialogCancel>Cancel</AlertDialogCancel>
//                               <AlertDialogAction
//                                 onClick={() => handleStatusUpdate(member._id, "inactive")}
//                                 className="bg-red-600 hover:bg-red-700"
//                               >
//                                 Reject
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
//                     <TableHead>Member</TableHead>
//                     <TableHead>Contact</TableHead>
//                     <TableHead>Location</TableHead>
//                     <TableHead>Joined</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Type</TableHead>
//                     {canManageMembers && <TableHead>Actions</TableHead>}
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {members.map((member) => (
//                     <TableRow key={member._id}>
//                       <TableCell>
//                         <div>
//                           <div className="font-medium">{member.name}</div>
//                           <div className="text-sm text-gray-500">ID: {member.membershipId}</div>
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <div className="text-sm">
//                           <div>{member.email}</div>
//                           <div className="text-gray-500">{member.phone}</div>
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <div className="text-sm">
//                           <div>{member.district}</div>
//                           <div className="text-gray-500">{member.state}</div>
//                         </div>
//                       </TableCell>
//                       <TableCell>{new Date(member.joinedDate).toLocaleDateString("en-IN")}</TableCell>
//                       <TableCell>
//                         <Badge className={`${getStatusBadgeColor(member.status)} flex items-center gap-1 w-fit`}>
//                           {getStatusIcon(member.status)}
//                           {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
//                         </Badge>
//                       </TableCell>
//                       <TableCell>
//                         {member.isVolunteer ? (
//                           <Badge variant="outline">Volunteer</Badge>
//                         ) : (
//                           <span className="text-gray-500">Member</span>
//                         )}
//                       </TableCell>
//                       {canManageMembers && (
//                         <TableCell>
//                           {member.status === "pending" && (
//                             <div className="flex space-x-2">
//                               <AlertDialog>
//                                 <AlertDialogTrigger asChild>
//                                   <Button size="sm" className="bg-green-600 hover:bg-green-700">
//                                     <CheckCircle className="h-4 w-4" />
//                                   </Button>
//                                 </AlertDialogTrigger>
//                                 <AlertDialogContent>
//                                   <AlertDialogHeader>
//                                     <AlertDialogTitle>Approve Member</AlertDialogTitle>
//                                     <AlertDialogDescription>
//                                       Are you sure you want to approve {member.name} as an active member?
//                                     </AlertDialogDescription>
//                                   </AlertDialogHeader>
//                                   <AlertDialogFooter>
//                                     <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                     <AlertDialogAction
//                                       onClick={() => handleStatusUpdate(member._id, "active")}
//                                       className="bg-green-600 hover:bg-green-700"
//                                     >
//                                       Approve
//                                     </AlertDialogAction>
//                                   </AlertDialogFooter>
//                                 </AlertDialogContent>
//                               </AlertDialog>

//                               <AlertDialog>
//                                 <AlertDialogTrigger asChild>
//                                   <Button
//                                     variant="outline"
//                                     size="sm"
//                                     className="text-red-600 hover:text-red-700 bg-transparent"
//                                   >
//                                     <XCircle className="h-4 w-4" />
//                                   </Button>
//                                 </AlertDialogTrigger>
//                                 <AlertDialogContent>
//                                   <AlertDialogHeader>
//                                     <AlertDialogTitle>Reject Member</AlertDialogTitle>
//                                     <AlertDialogDescription>
//                                       Are you sure you want to reject {member.name}'s membership application?
//                                     </AlertDialogDescription>
//                                   </AlertDialogHeader>
//                                   <AlertDialogFooter>
//                                     <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                     <AlertDialogAction
//                                       onClick={() => handleStatusUpdate(member._id, "inactive")}
//                                       className="bg-red-600 hover:bg-red-700"
//                                     >
//                                       Reject
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
//                 {pagination.total} members
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
//                   disabled={pagination.page >= pagination.pages}
//                 >
//                   Next
//                   <ChevronRight className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>

//             {members.length === 0 && (
//               <div className="text-center py-12">
//                 <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//                 <p className="text-gray-500 text-lg mb-2">No members found</p>
//                 <p className="text-gray-400 text-sm">
//                   {searchTerm ? "Try adjusting your search terms" : "No members have been referred yet"}
//                 </p>
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// ----------------1-------------------
// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Search, Users, Mail, Phone, MapPin, Calendar, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, Download, Eye, FileDown } from "lucide-react"
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
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Member } from "@/types"

// interface MemberManagementProps {
//   initialMembers: Member[]
//   initialPagination: {
//     page: number
//     limit: number
//     total: number
//     pages: number
//   }
//   currentLeader?: any
// }

// export function MemberManagement({ 
//   initialMembers = [], 
//   initialPagination = { page: 1, limit: 10, total: 0, pages: 1 },
//   currentLeader 
// }: MemberManagementProps) {
//   const [members, setMembers] = useState<Member[]>(initialMembers)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [pagination, setPagination] = useState(initialPagination)
//   const [loading, setLoading] = useState(false)
//   const [exportLoading, setExportLoading] = useState(false)
//   const [selectedMember, setSelectedMember] = useState<Member | null>(null)
//   const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

//   const canManageMembers =
//     currentLeader?.permissions?.includes("manage_members") || 
//     currentLeader?.permissions?.includes("admin_access")

//   useEffect(() => {
//     fetchMembers()
//   }, [pagination.page, pagination.limit, statusFilter])

//   const fetchMembers = async () => {
//     try {
//       setLoading(true)
//       const params = new URLSearchParams({
//         page: pagination.page.toString(),
//         limit: pagination.limit.toString(),
//         ...(statusFilter !== "all" && { status: statusFilter }),
//         ...(searchTerm && { search: searchTerm }),
//       })

//       const response = await fetch(`/api/members?${params}`)
//       const data = await response.json()

//       if (response.ok) {
//         setMembers(data.members || [])
//         setPagination(data.pagination)
//       }
//     } catch (error) {
//       console.error("Error fetching members:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleStatusUpdate = async (memberId: string, newStatus: string) => {
//     try {
//       const response = await fetch(`/api/members/${memberId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ status: newStatus }),
//       })

//       if (response.ok) {
//         fetchMembers() // Refresh the data
//       }
//     } catch (error) {
//       console.error("Error updating member status:", error)
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

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault()
//     setPagination(prev => ({ ...prev, page: 1 }))
//   }

//   const exportToExcel = async () => {
//     try {
//       setExportLoading(true)
//       const params = new URLSearchParams({
//         export: "excel",
//         ...(statusFilter !== "all" && { status: statusFilter }),
//         ...(searchTerm && { search: searchTerm }),
//       })

//       const response = await fetch(`/api/members?${params}`)
//       const data = await response.json()

//       if (response.ok) {
//         // Create CSV content
//         const headers = ["Name", "Email", "Phone", "District", "State", "Status", "Membership ID", "Joined Date", "Is Volunteer"]
//         const csvContent = [
//           headers.join(","),
//           ...data.members.map((member: Member) => [
//             `"${member.name || ''}"`,
//             `"${member.email || ''}"`,
//             `"${member.phone || ''}"`,
//             `"${member.district || ''}"`,
//             `"${member.state || ''}"`,
//             `"${member.status || ''}"`,
//             `"${member.membershipId || ''}"`,
//             `"${member.joinedDate ? new Date(member.joinedDate).toLocaleDateString("en-IN") : ''}"`,
//             `"${member.isVolunteer ? "Yes" : "No"}"`
//           ].join(","))
//         ].join("\n")

//         // Create and download file
//         const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
//         const link = document.createElement("a")
//         const url = URL.createObjectURL(blob)
//         link.setAttribute("href", url)
//         link.setAttribute("download", `members-${new Date().toISOString().split('T')[0]}.csv`)
//         link.style.visibility = "hidden"
//         document.body.appendChild(link)
//         link.click()
//         document.body.removeChild(link)
//       }
//     } catch (error) {
//       console.error("Error exporting members:", error)
//     } finally {
//       setExportLoading(false)
//     }
//   }

//   const exportSingleMemberToExcel = async (member: Member) => {
//     try {
//       // Create CSV content for single member
//       const headers = ["Name", "Email", "Phone", "District", "State", "Status", "Membership ID", "Joined Date", "Is Volunteer", "Address", "Date of Birth"]
//       const csvContent = [
//         headers.join(","),
//         [
//           `"${member.name || ''}"`,
//           `"${member.email || ''}"`,
//           // `"${member.phone || ''}"`,
//           `"${member.district || ''}"`,
//           // `"${member.state || ''}"`,
//           `"${member.status || ''}"`,
//           `"${member.membershipId || ''}"`,
//           `"${member.joinedDate ? new Date(member.joinedDate).toLocaleDateString("en-IN") : ''}"`,
//           `"${member.isVolunteer ? "Yes" : "No"}"`,
//           `"${member.address || ''}"`,
//           `"${member.dateOfBirth ? new Date(member.dateOfBirth).toLocaleDateString("en-IN") : ''}"`
//         ].join(",")
//       ].join("\n")

//       // Create and download file
//       const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
//       const link = document.createElement("a")
//       const url = URL.createObjectURL(blob)
//       link.setAttribute("href", url)
//       link.setAttribute("download", `member-${member.membershipId || member.name}-${new Date().toISOString().split('T')[0]}.csv`)
//       link.style.visibility = "hidden"
//       document.body.appendChild(link)
//       link.click()
//       document.body.removeChild(link)
//     } catch (error) {
//       console.error("Error exporting single member:", error)
//     }
//   }

//   const showMemberDetails = (member: Member) => {
//     setSelectedMember(member)
//     setIsDetailDialogOpen(true)
//   }

//   const getStatusBadgeColor = (status: string) => {
//     const colors = {
//       active: "bg-green-100 text-green-800",
//       pending: "bg-yellow-100 text-yellow-800",
//       inactive: "bg-gray-100 text-gray-800",
//     }
//     return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
//   }

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "active":
//         return <CheckCircle className="h-4 w-4 text-green-600" />
//       case "pending":
//         return <Clock className="h-4 w-4 text-yellow-600" />
//       case "inactive":
//         return <XCircle className="h-4 w-4 text-gray-600" />
//       default:
//         return null
//     }
//   }

//   // Safe data display functions
//   // const displayPhone = (phone: string | undefined) => phone || "Not provided"
//   // const displayState = (state: string | undefined) => state || "Not provided"
//   const displayDistrict = (district: string | undefined) => district || "Not provided"

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
//       {/* Member Details Dialog */}
//       <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
//         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Member Details</DialogTitle>
//             <DialogDescription>
//               Complete information about the selected member
//             </DialogDescription>
//           </DialogHeader>
//           {selectedMember && (
//             <div className="space-y-6">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h3 className="font-semibold text-lg">{selectedMember.name}</h3>
//                   <p className="text-sm text-gray-600">ID: {selectedMember.membershipId}</p>
//                 </div>
//                 <Button
//                   onClick={() => exportSingleMemberToExcel(selectedMember)}
//                   variant="outline"
//                   size="sm"
//                   className="flex items-center gap-2"
//                 >
//                   <FileDown className="h-4 w-4" />
//                   Export
//                 </Button>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <div className="space-y-3">
//                     <div className="flex items-center">
//                       <Mail className="h-4 w-4 mr-3 text-gray-500" />
//                       <div>
//                         <p className="text-sm font-medium">Email</p>
//                         <p className="text-sm text-gray-600">{selectedMember.email}</p>
//                       </div>
//                     </div>
                    
//                     {/* <div className="flex items-center">
//                       <Phone className="h-4 w-4 mr-3 text-gray-500" />
//                       <div>
//                         <p className="text-sm font-medium">Phone</p>
//                         <p className="text-sm text-gray-600">{displayPhone(selectedMember.phone)}</p>
//                       </div>
//                     </div> */}
                    
//                     <div className="flex items-center">
//                       <MapPin className="h-4 w-4 mr-3 text-gray-500" />
//                       <div>
//                         <p className="text-sm font-medium">Location</p>
//                         <p className="text-sm text-gray-600">
//                           {displayDistrict(selectedMember.district)},
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <Badge className={`${getStatusBadgeColor(selectedMember.status)} flex items-center gap-1`}>
//                       {getStatusIcon(selectedMember.status)}
//                       {selectedMember.status.charAt(0).toUpperCase() + selectedMember.status.slice(1)}
//                     </Badge>
//                     {selectedMember.isVolunteer && (
//                       <Badge variant="outline" className="bg-blue-50">
//                         Volunteer
//                       </Badge>
//                     )}
//                   </div>

//                   <div className="space-y-3">
//                     <div className="flex items-center">
//                       <Calendar className="h-4 w-4 mr-3 text-gray-500" />
//                       <div>
//                         <p className="text-sm font-medium">Joined Date</p>
//                         <p className="text-sm text-gray-600">
//                           {selectedMember.joinedDate ? new Date(selectedMember.joinedDate).toLocaleDateString("en-IN", {
//                             weekday: 'long',
//                             year: 'numeric',
//                             month: 'long',
//                             day: 'numeric'
//                           }) : 'Not available'}
//                         </p>
//                       </div>
//                     </div>

//                     {selectedMember.dateOfBirth && (
//                       <div className="flex items-center">
//                         <Calendar className="h-4 w-4 mr-3 text-gray-500" />
//                         <div>
//                           <p className="text-sm font-medium">Date of Birth</p>
//                           <p className="text-sm text-gray-600">
//                             {new Date(selectedMember.dateOfBirth).toLocaleDateString("en-IN")}
//                           </p>
//                         </div>
//                       </div>
//                     )}

//                     {selectedMember.address && (
//                       <div>
//                         <p className="text-sm font-medium mb-1">Address</p>
//                         <p className="text-sm text-gray-600">{selectedMember.address}</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Additional fields can be added here */}
//               <div className="border-t pt-4">
//                 <h4 className="font-semibold mb-3">Additional Information</h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                   <div>
//                     <span className="font-medium">Membership Type: </span>
//                     <span>{selectedMember.isVolunteer ? "Volunteer" : "Regular Member"}</span>
//                   </div>
//                   <div>
//                     <span className="font-medium">Status: </span>
//                     <span className="capitalize">{selectedMember.status}</span>
//                   </div>
//                   {/* Add more fields as needed */}
//                 </div>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       <Card className="border-0 shadow-lg">
//         <CardHeader>
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//             <div>
//               <CardTitle className="text-xl text-gray-900">Member Management</CardTitle>
//               <p className="text-sm text-gray-600">View and manage your referred members</p>
//             </div>
//             <div className="flex flex-col md:flex-row items-start md:items-center gap-4 text-sm text-gray-600">
//               <div className="flex gap-4">
//                 <span>Total: {pagination.total}</span>
//                 <span>Page: {pagination.page} of {pagination.pages}</span>
//               </div>
//               {canManageMembers && (
//                 <div className="flex gap-2">
//                   <Button
//                     variant={statusFilter === "all" ? "default" : "outline"}
//                     size="sm"
//                     onClick={() => setStatusFilter("all")}
//                   >
//                     All
//                   </Button>
//                   <Button
//                     variant={statusFilter === "pending" ? "default" : "outline"}
//                     size="sm"
//                     onClick={() => setStatusFilter("pending")}
//                   >
//                     Pending
//                   </Button>
//                   <Button
//                     variant={statusFilter === "active" ? "default" : "outline"}
//                     size="sm"
//                     onClick={() => setStatusFilter("active")}
//                   >
//                     Active
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <div className="flex flex-col md:flex-row gap-4 justify-between">
//               <form onSubmit={handleSearch} className="flex items-center space-x-2 flex-1">
//                 <Search className="h-4 w-4 text-gray-400" />
//                 <Input
//                   placeholder="Search members by name, email, phone, or location..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="flex-1"
//                 />
//                 <Button type="submit" variant="outline">
//                   Search
//                 </Button>
//               </form>

//               <div className="flex items-center gap-2">
//                 <Button
//                   onClick={exportToExcel}
//                   disabled={exportLoading}
//                   variant="outline"
//                   size="sm"
//                   className="flex items-center gap-2"
//                 >
//                   <Download className="h-4 w-4" />
//                   {exportLoading ? "Exporting..." : "Export All"}
//                 </Button>
                
//                 <div className="flex items-center space-x-2">
//                   <span className="text-sm text-gray-600">Show:</span>
//                   <select
//                     value={pagination.limit}
//                     onChange={(e) => handleLimitChange(Number(e.target.value))}
//                     className="border rounded-md px-2 py-1 text-sm"
//                   >
//                     <option value="5">5</option>
//                     <option value="10">10</option>
//                     <option value="20">20</option>
//                     <option value="50">50</option>
//                   </select>
//                   <span className="text-sm text-gray-600">per page</span>
//                 </div>
//               </div>
//             </div>

//             {/* Mobile Card View */}
//             <div className="md:hidden space-y-4">
//               {members.map((member) => (
//                 <Card key={member._id} className="border border-gray-200">
//                   <CardContent className="p-4">
//                     <div className="flex justify-between items-start mb-3">
//                       <div className="flex-1">
//                         <h3 className="font-semibold text-gray-900">{member.name}</h3>
//                         <p className="text-sm text-gray-600">ID: {member.membershipId}</p>
//                       </div>
//                       <div className="flex flex-col items-end space-y-1">
//                         <Badge className={`text-xs ${getStatusBadgeColor(member.status)} flex items-center gap-1`}>
//                           {getStatusIcon(member.status)}
//                           {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
//                         </Badge>
//                         {member.isVolunteer && (
//                           <Badge variant="outline" className="text-xs">
//                             Volunteer
//                           </Badge>
//                         )}
//                       </div>
//                     </div>

//                     <div className="space-y-2 text-sm text-gray-600">
//                       <div className="flex items-center">
//                         <Mail className="h-4 w-4 mr-2" />
//                         <span className="truncate">{member.email}</span>
//                       </div>
//                       <div className="flex items-center">
//                         <Phone className="h-4 w-4 mr-2" />
//                         {/* <span>{displayPhone(member.phone)}</span> */}
//                       </div>
//                       <div className="flex items-center">
//                         <MapPin className="h-4 w-4 mr-2" />
//                         <span className="truncate">
//                           {displayDistrict(member.district)},
//                         </span>
//                       </div>
//                       <div className="flex items-center">
//                         <Calendar className="h-4 w-4 mr-2" />
//                         <span>{member.joinedDate ? new Date(member.joinedDate).toLocaleDateString("en-IN") : 'N/A'}</span>
//                       </div>
//                     </div>

//                     <div className="flex space-x-2 mt-4">
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         className="flex-1"
//                         onClick={() => showMemberDetails(member)}
//                       >
//                         <Eye className="h-4 w-4 mr-1" />
//                         View
//                       </Button>

//                       <Button
//                         size="sm"
//                         variant="outline"
//                         className="flex-1"
//                         onClick={() => exportSingleMemberToExcel(member)}
//                       >
//                         <FileDown className="h-4 w-4 mr-1" />
//                         Export
//                       </Button>
                      
//                       {canManageMembers && member.status === "pending" && (
//                         <>
//                           <AlertDialog>
//                             <AlertDialogTrigger asChild>
//                               <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
//                                 <CheckCircle className="h-4 w-4 mr-1" />
//                                 Approve
//                               </Button>
//                             </AlertDialogTrigger>
//                             <AlertDialogContent>
//                               <AlertDialogHeader>
//                                 <AlertDialogTitle>Approve Member</AlertDialogTitle>
//                                 <AlertDialogDescription>
//                                   Are you sure you want to approve {member.name} as an active member?
//                                 </AlertDialogDescription>
//                               </AlertDialogHeader>
//                               <AlertDialogFooter>
//                                 <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                 <AlertDialogAction
//                                   onClick={() => handleStatusUpdate(member._id, "active")}
//                                   className="bg-green-600 hover:bg-green-700"
//                                 >
//                                   Approve
//                                 </AlertDialogAction>
//                               </AlertDialogFooter>
//                             </AlertDialogContent>
//                           </AlertDialog>

//                           <AlertDialog>
//                             <AlertDialogTrigger asChild>
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 className="flex-1 text-red-600 hover:text-red-700 bg-transparent"
//                               >
//                                 <XCircle className="h-4 w-4 mr-1" />
//                                 Reject
//                               </Button>
//                             </AlertDialogTrigger>
//                             <AlertDialogContent>
//                               <AlertDialogHeader>
//                                 <AlertDialogTitle>Reject Member</AlertDialogTitle>
//                                 <AlertDialogDescription>
//                                   Are you sure you want to reject {member.name}'s membership application?
//                                 </AlertDialogDescription>
//                               </AlertDialogHeader>
//                               <AlertDialogFooter>
//                                 <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                 <AlertDialogAction
//                                   onClick={() => handleStatusUpdate(member._id, "inactive")}
//                                   className="bg-red-600 hover:bg-red-700"
//                                 >
//                                   Reject
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
//                     <TableHead>Member</TableHead>
//                     <TableHead>Contact</TableHead>
//                     <TableHead>Location</TableHead>
//                     <TableHead>Joined</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Type</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {members.map((member) => (
//                     <TableRow key={member._id}>
//                       <TableCell>
//                         <div>
//                           <div className="font-medium">{member.name}</div>
//                           <div className="text-sm text-gray-500">ID: {member.membershipId}</div>
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <div className="text-sm">
//                           <div>{member.email}</div>
//                           <div className="text-gray-500"></div>
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <div className="text-sm">
//                           <div>{displayDistrict(member.district)}</div>
//                           <div className="text-gray-500"></div>
//                         </div>
//                       </TableCell>
//                       <TableCell>{member.joinedDate ? new Date(member.joinedDate).toLocaleDateString("en-IN") : 'N/A'}</TableCell>
//                       <TableCell>
//                         <Badge className={`${getStatusBadgeColor(member.status)} flex items-center gap-1 w-fit`}>
//                           {getStatusIcon(member.status)}
//                           {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
//                         </Badge>
//                       </TableCell>
//                       <TableCell>
//                         {member.isVolunteer ? (
//                           <Badge variant="outline">Volunteer</Badge>
//                         ) : (
//                           <span className="text-gray-500">Member</span>
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex space-x-2">
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() => showMemberDetails(member)}
//                             title="View Details"
//                           >
//                             <Eye className="h-4 w-4" />
//                           </Button>

//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() => exportSingleMemberToExcel(member)}
//                             title="Export to Excel"
//                           >
//                             <FileDown className="h-4 w-4" />
//                           </Button>
                          
//                           {canManageMembers && member.status === "pending" && (
//                             <>
//                               <AlertDialog>
//                                 <AlertDialogTrigger asChild>
//                                   <Button size="sm" className="bg-green-600 hover:bg-green-700" title="Approve Member">
//                                     <CheckCircle className="h-4 w-4" />
//                                   </Button>
//                                 </AlertDialogTrigger>
//                                 <AlertDialogContent>
//                                   <AlertDialogHeader>
//                                     <AlertDialogTitle>Approve Member</AlertDialogTitle>
//                                     <AlertDialogDescription>
//                                       Are you sure you want to approve {member.name} as an active member?
//                                     </AlertDialogDescription>
//                                   </AlertDialogHeader>
//                                   <AlertDialogFooter>
//                                     <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                     <AlertDialogAction
//                                       onClick={() => handleStatusUpdate(member._id, "active")}
//                                       className="bg-green-600 hover:bg-green-700"
//                                     >
//                                       Approve
//                                     </AlertDialogAction>
//                                   </AlertDialogFooter>
//                                 </AlertDialogContent>
//                               </AlertDialog>

//                               <AlertDialog>
//                                 <AlertDialogTrigger asChild>
//                                   <Button
//                                     variant="outline"
//                                     size="sm"
//                                     className="text-red-600 hover:text-red-700 bg-transparent"
//                                     title="Reject Member"
//                                   >
//                                     <XCircle className="h-4 w-4" />
//                                   </Button>
//                                 </AlertDialogTrigger>
//                                 <AlertDialogContent>
//                                   <AlertDialogHeader>
//                                     <AlertDialogTitle>Reject Member</AlertDialogTitle>
//                                     <AlertDialogDescription>
//                                       Are you sure you want to reject {member.name}'s membership application?
//                                     </AlertDialogDescription>
//                                   </AlertDialogHeader>
//                                   <AlertDialogFooter>
//                                     <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                     <AlertDialogAction
//                                       onClick={() => handleStatusUpdate(member._id, "inactive")}
//                                       className="bg-red-600 hover:bg-red-700"
//                                     >
//                                       Reject
//                                     </AlertDialogAction>
//                                   </AlertDialogFooter>
//                                 </AlertDialogContent>
//                               </AlertDialog>
//                             </>
//                           )}
//                         </div>
//                       </TableCell>
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
//                 {pagination.total} members
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
//                   disabled={pagination.page >= pagination.pages}
//                 >
//                   Next
//                   <ChevronRight className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>

//             {members.length === 0 && (
//               <div className="text-center py-12">
//                 <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//                 <p className="text-gray-500 text-lg mb-2">No members found</p>
//                 <p className="text-gray-400 text-sm">
//                   {searchTerm ? "Try adjusting your search terms" : "No members have been referred yet"}
//                 </p>
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// ------------2-------------------------


"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Users, Mail, Phone, MapPin, Calendar, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, Download, Eye, FileDown } from "lucide-react"
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
import { Member } from "@/types"

interface MemberManagementProps {
  initialMembers: Member[]
  initialPagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  currentLeader?: any
}

export function MemberManagement({ 
  initialMembers = [], 
  initialPagination = { page: 1, limit: 10, total: 0, pages: 1 },
  currentLeader 
}: MemberManagementProps) {
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [pagination, setPagination] = useState(initialPagination)
  const [loading, setLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const router = useRouter()

  const canManageMembers =
    currentLeader?.permissions?.includes("manage_members") || 
    currentLeader?.permissions?.includes("admin_access")

  useEffect(() => {
    fetchMembers()
  }, [pagination.page, pagination.limit, statusFilter])

  const fetchMembers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
      })

      const response = await fetch(`/api/members?${params}`)
      const data = await response.json()

      if (response.ok) {
        setMembers(data.members || [])
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error("Error fetching members:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (memberId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/members/${memberId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchMembers() // Refresh the data
      }
    } catch (error) {
      console.error("Error updating member status:", error)
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPagination(prev => ({ ...prev, page: 1 }))
  }

const handleViewMember = (memberId: string) => {
  window.open(`/members/${memberId}`, "_blank", "noopener,noreferrer")
}


  const exportToExcel = async () => {
    try {
      setExportLoading(true)
      const params = new URLSearchParams({
        export: "excel",
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
      })

      const response = await fetch(`/api/members?${params}`)
      const data = await response.json()

      if (response.ok) {
        // Create CSV content with all fields
        const headers = [
          "Name", 
          "Email", 
          "Phone", 
          "Mobile Number", 
          "WhatsApp Number", 
          "Is WhatsApp Same",
          "Address", 
          "State", 
          "District", 
          "Lok Sabha Constituency", 
          "Vidhan Sabha Constituency", 
          "Ward", 
          "Tehsil", 
          "Pincode", 
          "Date of Birth", 
          "Age", 
          "Gender", 
          "Member Type", 
          "Occupation", 
          "Membership ID", 
          "Referral Code",
          "Referred By",
          "Joined Date", 
          "Status", 
          "Is Volunteer", 
          "Volunteer Skills",
          "Additional Info",
          "Created At",
          "Updated At"
        ]
        
        const csvContent = [
          headers.join(","),
          ...data.members.map((member: Member) => [
            `"${member.name || ''}"`,
            `"${member.email || ''}"`,
            `"${member.phone || ''}"`,
            `"${member.mobileNumber || ''}"`,
            `"${member.whatsappNumber || ''}"`,
            `"${member.isWhatsAppSame ? 'Yes' : 'No'}"`,
            `"${member.address || ''}"`,
            `"${member.state || ''}"`,
            `"${member.district || ''}"`,
            `"${member.lokSabha || ''}"`,
            `"${member.vidhanSabha || ''}"`,
            `"${member.ward || ''}"`,
            `"${member.tehsil || ''}"`,
            `"${member.pincode || ''}"`,
            `"${member.dateOfBirth ? new Date(member.dateOfBirth).toLocaleDateString("en-IN") : ''}"`,
            `"${member.age || ''}"`,
            `"${member.gender || ''}"`,
            `"${member.memberType || ''}"`,
            `"${member.occupation || ''}"`,
            `"${member.membershipId || ''}"`,
            `"${member.referralCode || ''}"`,
            `"${member.referredBy || ''}"`,
            `"${member.joinedDate ? new Date(member.joinedDate).toLocaleDateString("en-IN") : ''}"`,
            `"${member.status || ''}"`,
            `"${member.isVolunteer ? "Yes" : "No"}"`,
            `"${member.volunteerSkills?.join(', ') || ''}"`,
            `"${member.additionalInfo || ''}"`,
            `"${member.createdAt ? new Date(member.createdAt).toLocaleDateString("en-IN") : ''}"`,
            `"${member.updatedAt ? new Date(member.updatedAt).toLocaleDateString("en-IN") : ''}"`
          ].join(","))
        ].join("\n")

        // Create and download file
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `members-${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      console.error("Error exporting members:", error)
    } finally {
      setExportLoading(false)
    }
  }

  const exportSingleMemberToExcel = async (member: Member) => {
    try {
      // Create CSV content for single member with all fields
      const headers = [
        "Name", 
        "Email", 
        "Phone", 
        "Mobile Number", 
        "WhatsApp Number", 
        "Is WhatsApp Same",
        "Address", 
        "State", 
        "District", 
        "Lok Sabha Constituency", 
        "Vidhan Sabha Constituency", 
        "Ward", 
        "Tehsil", 
        "Pincode", 
        "Date of Birth", 
        "Age", 
        "Gender", 
        "Member Type", 
        "Occupation", 
        "Membership ID", 
        "Referral Code",
        "Referred By",
        "Joined Date", 
        "Status", 
        "Is Volunteer", 
        "Volunteer Skills",
        "Additional Info",
        "Social Media - Facebook",
        "Social Media - Twitter", 
        "Social Media - Instagram",
        "Created At",
        "Updated At"
      ]
      
      const csvContent = [
        headers.join(","),
        [
          `"${member.name || ''}"`,
          `"${member.email || ''}"`,
          `"${member.phone || ''}"`,
          `"${member.mobileNumber || ''}"`,
          `"${member.whatsappNumber || ''}"`,
          `"${member.isWhatsAppSame ? 'Yes' : 'No'}"`,
          `"${member.address || ''}"`,
          `"${member.state || ''}"`,
          `"${member.district || ''}"`,
          `"${member.lokSabha || ''}"`,
          `"${member.vidhanSabha || ''}"`,
          `"${member.ward || ''}"`,
          `"${member.tehsil || ''}"`,
          `"${member.pincode || ''}"`,
          `"${member.dateOfBirth ? new Date(member.dateOfBirth).toLocaleDateString("en-IN") : ''}"`,
          `"${member.age || ''}"`,
          `"${member.gender || ''}"`,
          `"${member.memberType || ''}"`,
          `"${member.occupation || ''}"`,
          `"${member.membershipId || ''}"`,
          `"${member.referralCode || ''}"`,
          `"${member.referredBy || ''}"`,
          `"${member.joinedDate ? new Date(member.joinedDate).toLocaleDateString("en-IN") : ''}"`,
          `"${member.status || ''}"`,
          `"${member.isVolunteer ? "Yes" : "No"}"`,
          `"${member.volunteerSkills?.join(', ') || ''}"`,
          `"${member.additionalInfo || ''}"`,
          `"${member.socialMedia?.facebook || ''}"`,
          `"${member.socialMedia?.twitter || ''}"`,
          `"${member.socialMedia?.instagram || ''}"`,
          `"${member.createdAt ? new Date(member.createdAt).toLocaleDateString("en-IN") : ''}"`,
          `"${member.updatedAt ? new Date(member.updatedAt).toLocaleDateString("en-IN") : ''}"`
        ].join(",")
      ].join("\n")

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `member-${member.membershipId || member.name}-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error exporting single member:", error)
    }
  }

  const getStatusBadgeColor = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      inactive: "bg-gray-100 text-gray-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "inactive":
        return <XCircle className="h-4 w-4 text-gray-600" />
      default:
        return null
    }
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
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-xl text-gray-900">Member Management</CardTitle>
              <p className="text-sm text-gray-600">View and manage your referred members</p>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 text-sm text-gray-600">
              <div className="flex gap-4">
                <span>Total: {pagination.total}</span>
                <span>Page: {pagination.page} of {pagination.pages}</span>
              </div>
              {canManageMembers && (
                <div className="flex gap-2">
                  <Button
                    variant={statusFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={statusFilter === "pending" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("pending")}
                  >
                    Pending
                  </Button>
                  <Button
                    variant={statusFilter === "active" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("active")}
                  >
                    Active
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <form onSubmit={handleSearch} className="flex items-center space-x-2 flex-1">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search members by name, email, phone, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" variant="outline">
                  Search
                </Button>
              </form>

              <div className="flex items-center gap-2">
                <Button
                  onClick={exportToExcel}
                  disabled={exportLoading}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {exportLoading ? "Exporting..." : "Export All"}
                </Button>
                
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
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {members.map((member) => (
                <Card key={member._id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-600">ID: {member.membershipId}</p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge className={`text-xs ${getStatusBadgeColor(member.status)} flex items-center gap-1`}>
                          {getStatusIcon(member.status)}
                          {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                        </Badge>
                        {member.isVolunteer && (
                          <Badge variant="outline" className="text-xs">
                            Volunteer
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{member.mobileNumber || member.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="truncate">
                          {member.district}, {member.state}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{member.joinedDate ? new Date(member.joinedDate).toLocaleDateString("en-IN") : 'N/A'}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleViewMember(member._id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>

                      {/* <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => exportSingleMemberToExcel(member)}
                      >
                        <FileDown className="h-4 w-4 mr-1" />
                        Export
                      </Button> */}
                      
                      {canManageMembers && member.status === "pending" && (
                        <>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Approve Member</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to approve {member.name} as an active member?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleStatusUpdate(member._id, "active")}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Approve
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 text-red-600 hover:text-red-700 bg-transparent"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Reject Member</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to reject {member.name}'s membership application?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleStatusUpdate(member._id, "inactive")}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Reject
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
                    <TableHead>Member</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-gray-500">ID: {member.membershipId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{member.email}</div>
                          <div className="text-gray-500">{member.mobileNumber || member.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{member.district}</div>
                          <div className="text-gray-500">{member.state}</div>
                        </div>
                      </TableCell>
                      <TableCell>{member.joinedDate ? new Date(member.joinedDate).toLocaleDateString("en-IN") : 'N/A'}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusBadgeColor(member.status)} flex items-center gap-1 w-fit`}>
                          {getStatusIcon(member.status)}
                          {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {member.isVolunteer ? (
                          <Badge variant="outline">Volunteer</Badge>
                        ) : (
                          <span className="text-gray-500">Member</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewMember(member._id)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>

                          {/* <Button
                            size="sm"
                            variant="outline"
                            onClick={() => exportSingleMemberToExcel(member)}
                            title="Export to Excel"
                          >
                            <FileDown className="h-4 w-4" />
                          </Button> */}
                          
                          {canManageMembers && member.status === "pending" && (
                            <>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" className="bg-green-600 hover:bg-green-700" title="Approve Member">
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Approve Member</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to approve {member.name} as an active member?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleStatusUpdate(member._id, "active")}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      Approve
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 bg-transparent"
                                    title="Reject Member"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Reject Member</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to reject {member.name}'s membership application?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleStatusUpdate(member._id, "inactive")}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Reject
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                        </div>
                      </TableCell>
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
                {pagination.total} members
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
                  disabled={pagination.page >= pagination.pages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {members.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No members found</p>
                <p className="text-gray-400 text-sm">
                  {searchTerm ? "Try adjusting your search terms" : "No members have been referred yet"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}