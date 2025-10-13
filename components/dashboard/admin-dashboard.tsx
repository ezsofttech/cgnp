// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Settings, Eye, Search, Filter, Download, Plus, Edit, Trash2, X, Save, User, Phone, MapPin, MoreVertical } from "lucide-react"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { useState, useEffect } from "react"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { useUserManagementStore, type User, type CreateUserData, type UpdateUserData } from "@/lib/stores/user-store"
// import { toast } from "@/components/ui/use-toast"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// export function AdminDashboard() {
//   const {
//     users,
//     isLoading,
//     error,
//     filters,
//     fetchUsers,
//     createUser,
//     updateUser,
//     deleteUser,
//     setFilters,
//     exportUsers,
//     getUserStats
//   } = useUserManagementStore()

//   const [selectedUser, setSelectedUser] = useState<User | null>(null)
//   const [showDetails, setShowDetails] = useState(false)
//   const [showAddModal, setShowAddModal] = useState(false)
//   const [showEditModal, setShowEditModal] = useState(false)
//   const [showDeleteModal, setShowDeleteModal] = useState(false)
//   const [userToDelete, setUserToDelete] = useState<User | null>(null)
//   const [isExporting, setIsExporting] = useState(false)

//   // Form state for add/edit
//   const [formData, setFormData] = useState<CreateUserData>({
//     name: "",
//     contactNo: "",
//     address: "",
//     village: "",
//     city: "",
//     district: "",
//     loksabha: "",
//     vidhansabha: "",
//     boothNo: "",
//     state: "Chhattisgarh",
//     category: "General",
//     politicalParty: "CG NP",
//     remarks: "",
//     mobileNumber: "",
//     pincode: "",
//     gender: "male"
//   })

//   const [formErrors, setFormErrors] = useState<Record<string, string>>({})

//   // Fetch users on component mount - set high limit to show all users
//   useEffect(() => {
//     setFilters({ limit: 10000 }) // Set high limit to show all users
//     fetchUsers()
//   }, [fetchUsers, setFilters])

//   // Handle errors
//   useEffect(() => {
//     if (error) {
//       toast({
//         title: "Error",
//         description: error,
//         variant: "destructive",
//       })
//     }
//   }, [error])

//   // CRUD Operations
//   const handleViewDetails = (user: User) => {
//     setSelectedUser(user)
//     setShowDetails(true)
//   }

//   const handleCloseDetails = () => {
//     setShowDetails(false)
//     setSelectedUser(null)
//   }

//   const handleAddNew = () => {
//     setFormData({
//       name: "",
//       contactNo: "",
//       address: "",
//       village: "",
//       city: "",
//       district: "",
//       loksabha: "",
//       vidhansabha: "",
//       boothNo: "",
//       state: "Chhattisgarh",
//       category: "General",
//       politicalParty: "CG NP",
//       remarks: "",
//       mobileNumber: "",
//       pincode: "",
//       gender: "male"
//     })
//     setFormErrors({})
//     setShowAddModal(true)
//   }

//   const handleEdit = (user: User) => {
//     setFormData({
//       name: user.name,
//       contactNo: user.contactNo,
//       address: user.address,
//       village: user.village,
//       city: user.city,
//       district: user.district,
//       loksabha: user.loksabha,
//       vidhansabha: user.vidhansabha,
//       boothNo: user.boothNo,
//       state: user.state,
//       category: user.category,
//       politicalParty: user.politicalParty,
//       remarks: user.remarks,
//       mobileNumber: user.mobileNumber || "",
//       pincode: user.pincode || "",
//       gender: user.gender || "male"
//     })
//     setFormErrors({})
//     setSelectedUser(user)
//     setShowEditModal(true)
//   }

//   const handleDelete = (user: User) => {
//     setUserToDelete(user)
//     setShowDeleteModal(true)
//   }

//   const confirmDelete = async () => {
//     if (!userToDelete) return

//     const result = await deleteUser(userToDelete._id)
//     if (result.success) {
//       toast({
//         title: "Success",
//         description: "User deleted successfully",
//       })
//       setShowDeleteModal(false)
//       setUserToDelete(null)
//     } else {
//       toast({
//         title: "Error",
//         description: result.error || "Failed to delete user",
//         variant: "destructive",
//       })
//     }
//   }

//   const validateForm = (): boolean => {
//     const errors: Record<string, string> = {}

//     if (!formData.name.trim()) {
//       errors.name = "Name is required"
//     }
//     if (!formData.contactNo.trim()) {
//       errors.contactNo = "Contact number is required"
//     } else if (!/^[0-9]{10}$/.test(formData.contactNo)) {
//       errors.contactNo = "Please enter a valid 10-digit contact number"
//     }
//     if (!formData.address.trim()) {
//       errors.address = "Address is required"
//     }
//     if (!formData.village.trim()) {
//       errors.village = "Village is required"
//     }
//     if (!formData.city.trim()) {
//       errors.city = "City is required"
//     }
//     if (!formData.district.trim()) {
//       errors.district = "District is required"
//     }
//     if (!formData.loksabha.trim()) {
//       errors.loksabha = "Lok Sabha constituency is required"
//     }
//     if (!formData.vidhansabha.trim()) {
//       errors.vidhansabha = "Vidhan Sabha constituency is required"
//     }
//     if (!formData.boothNo.trim()) {
//       errors.boothNo = "Booth number is required"
//     }
//     if (!formData.state.trim()) {
//       errors.state = "State is required"
//     }
//     if (!formData.category) {
//       errors.category = "Category is required"
//     }
//     if (!formData.politicalParty.trim()) {
//       errors.politicalParty = "Political party is required"
//     }

//     setFormErrors(errors)
//     return Object.keys(errors).length === 0
//   }

//   const handleSave = async (isEdit = false) => {
//     if (!validateForm()) return

//     if (isEdit && selectedUser) {
//       const result = await updateUser(selectedUser._id, formData)
//       if (result.success) {
//         toast({
//           title: "Success",
//           description: "User updated successfully",
//         })
//         setShowEditModal(false)
//         setSelectedUser(null)
//       } else {
//         toast({
//           title: "Error",
//           description: result.error || "Failed to update user",
//           variant: "destructive",
//         })
//       }
//     } else {
//       const result = await createUser(formData)
//       if (result.success) {
//         toast({
//           title: "Success",
//           description: "User created successfully",
//         })
//         setShowAddModal(false)
//       } else {
//         toast({
//           title: "Error",
//           description: result.error || "Failed to create user",
//           variant: "destructive",
//         })
//       }
//     }
//   }

//   const handleInputChange = (field: keyof CreateUserData, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }))
//     // Clear error when user starts typing
//     if (formErrors[field]) {
//       setFormErrors(prev => ({
//         ...prev,
//         [field]: ""
//       }))
//     }
//   }

//   const handleSearch = (searchTerm: string) => {
//     setFilters({ search: searchTerm })
//   }

//   const handleExport = async () => {
//     setIsExporting(true)
//     try {
//       const response = await fetch('/api/user-management/export')
      
//       if (!response.ok) {
//         throw new Error('Failed to export data')
//       }
      
//       const result = await response.json()
      
//       if (result.success && result.data && result.data.length > 0) {
//         const headers = [
//           'Name',
//           'Contact No',
//           'Mobile Number',
//           'Gender',
//           'Address',
//           'Village',
//           'City',
//           'District',
//           'Lok Sabha',
//           'Vidhan Sabha',
//           'Booth No',
//           'State',
//           'Pincode',
//           'Category',
//           'Political Party',
//           'Membership ID',
//           'Joined Date',
//           'Remarks'
//         ];

//         // Create CSV content
//         const csvContent = [
//           headers.join(','),
//           ...result.data.map((user: any) => 
//             headers.map(header => {
//               const value = user[header] || '';
//               // Escape quotes and wrap in quotes if contains comma
//               return `"${String(value).replace(/"/g, '""')}"`;
//             }).join(',')
//           )
//         ].join('\n');

//         // Create blob and download
//         const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.style.display = 'none';
//         a.href = url;
//         a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
//         document.body.appendChild(a);
//         a.click();
//         window.URL.revokeObjectURL(url);
        
//         toast({
//           title: "Success",
//           description: `Exported ${result.total} users successfully`,
//         });
//       } else {
//         toast({
//           title: "Info",
//           description: "No data available to export",
//         });
//       }
//     } catch (error) {
//       console.error('Export error:', error);
//       toast({
//         title: "Error",
//         description: "Failed to export users data",
//         variant: "destructive",
//       });
//     } finally {
//       setIsExporting(false);
//     }
//   }

//   const stats = getUserStats()

//   return (
//     <div className="space-y-6">
//       <Card className="border-0 shadow-lg">
//         <CardHeader>
//           <div className="flex flex-col md:flex-row md:items-center justify-between">
//             <div>
//               <CardTitle className="text-xl text-gray-900 flex items-center">
//                 <Settings className="h-5 w-5 mr-2 text-blue-600" />
//                 Party Administration - User Management
//               </CardTitle>
//               <p className="text-sm text-gray-600">Manage all party members and their details</p>
//             </div>
//             <Button 
//               onClick={handleAddNew} 
//               className="mt-4 md:mt-0 flex items-center gap-2"
//               disabled={isLoading}
//             >
//               <Plus className="h-4 w-4" />
//               Add New Member
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent className="space-y-6">
        

//           {/* Search and Filter Section */}
//           <div className="flex flex-col md:flex-row gap-4 justify-between">
//             <div className="flex-1 max-w-md">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                 <Input
//                   placeholder="Search by name, contact, city or state..."
//                   value={filters.search || ""}
//                   onChange={(e) => handleSearch(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>
//             </div>
//             <div className="flex gap-2">
//               <Button 
//                 variant="outline" 
//                 className="flex items-center gap-2"
//                 onClick={handleExport}
//                 disabled={isExporting}
//               >
//                 <Download className="h-4 w-4" />
//                 {isExporting ? "Exporting..." : "Export to Excel"}
//               </Button>
//             </div>
//           </div>

//           {/* Users Table */}
//           <div className="border rounded-lg overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Name
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Contact No.
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       City
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       State
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Category
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {users.map((user) => (
//                     <tr key={user._id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
//                             <User className="h-5 w-5 text-blue-600" />
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">{user.name}</div>
//                             <div className="text-sm text-gray-500">{user.membershipId}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900 flex items-center gap-1">
//                           <Phone className="h-4 w-4 text-gray-400" />
//                           {user.contactNo}
//                         </div>
//                         {user.mobileNumber && (
//                           <div className="text-sm text-gray-500">{user.mobileNumber}</div>
//                         )}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900 flex items-center gap-1">
//                           <MapPin className="h-4 w-4 text-gray-400" />
//                           {user.city}
//                         </div>
//                         <div className="text-sm text-gray-500">{user.district}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{user.state}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{user.category}</div>
//                       </td>
                      
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button variant="ghost" size="sm">
//                               <MoreVertical className="h-4 w-4" />
//                             </Button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent align="end">
//                             <DropdownMenuItem onClick={() => handleViewDetails(user)}>
//                               <Eye className="h-4 w-4 mr-2" />
//                               View Details
//                             </DropdownMenuItem>
//                             <DropdownMenuItem onClick={() => handleEdit(user)}>
//                               <Edit className="h-4 w-4 mr-2" />
//                               Edit
//                             </DropdownMenuItem>
//                             <DropdownMenuItem 
//                               onClick={() => handleDelete(user)}
//                               className="text-red-600 focus:text-red-600"
//                             >
//                               <Trash2 className="h-4 w-4 mr-2" />
//                               Delete
//                             </DropdownMenuItem>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Loading State */}
//           {isLoading && (
//             <div className="text-center py-8">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//               <div className="text-gray-500 mt-2">Loading users...</div>
//             </div>
//           )}

//           {/* Empty State */}
//           {!isLoading && users.length === 0 && (
//             <div className="text-center py-8">
//               <div className="text-gray-500">No users found matching your search criteria.</div>
//             </div>
//           )}

//           {/* Total Count Display */}
//           <div className="flex justify-between items-center">
//             <div className="text-sm text-gray-700">
//               Showing all {users.length} members
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* User Details Modal */}
//       {showDetails && selectedUser && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             <CardHeader>
//               <CardTitle className="flex justify-between items-center">
//                 <span>User Details - {selectedUser.name}</span>
//                 <Button variant="ghost" size="sm" onClick={handleCloseDetails}>
//                   <X className="h-4 w-4" />
//                 </Button>
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <Label className="text-sm font-medium text-gray-500">Full Name</Label>
//                   <div className="text-sm text-gray-900 mt-1">{selectedUser.name}</div>
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium text-gray-500">Contact No.</Label>
//                   <div className="text-sm text-gray-900 mt-1">{selectedUser.contactNo}</div>
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium text-gray-500">Mobile Number</Label>
//                   <div className="text-sm text-gray-900 mt-1">{selectedUser.mobileNumber || "Not provided"}</div>
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium text-gray-500">Gender</Label>
//                   <div className="text-sm text-gray-900 mt-1 capitalize">{selectedUser.gender || "Not specified"}</div>
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium text-gray-500">Address</Label>
//                   <div className="text-sm text-gray-900 mt-1">{selectedUser.address}</div>
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium text-gray-500">Village</Label>
//                   <div className="text-sm text-gray-900 mt-1">{selectedUser.village}</div>
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium text-gray-500">City</Label>
//                   <div className="text-sm text-gray-900 mt-1">{selectedUser.city}</div>
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium text-gray-500">District</Label>
//                   <div className="text-sm text-gray-900 mt-1">{selectedUser.district}</div>
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium text-gray-500">Lok Sabha</Label>
//                   <div className="text-sm text-gray-900 mt-1">{selectedUser.loksabha}</div>
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium text-gray-500">Vidhan Sabha</Label>
//                   <div className="text-sm text-gray-900 mt-1">{selectedUser.vidhansabha}</div>
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium text-gray-500">Booth No.</Label>
//                   <div className="text-sm text-gray-900 mt-1">{selectedUser.boothNo}</div>
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium text-gray-500">State</Label>
//                   <div className="text-sm text-gray-900 mt-1">{selectedUser.state}</div>
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium text-gray-500">Pincode</Label>
//                   <div className="text-sm text-gray-900 mt-1">{selectedUser.pincode || "Not provided"}</div>
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium text-gray-500">Category</Label>
//                   <div className="text-sm text-gray-900 mt-1">
//                     <Badge variant="secondary">{selectedUser.category}</Badge>
//                   </div>
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium text-gray-500">Political Party</Label>
//                   <div className="text-sm text-gray-900 mt-1">{selectedUser.politicalParty}</div>
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium text-gray-500">Membership ID</Label>
//                   <div className="text-sm text-gray-900 mt-1">{selectedUser.membershipId || "Not assigned"}</div>
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium text-gray-500">Joined Date</Label>
//                   <div className="text-sm text-gray-900 mt-1">
//                     {new Date(selectedUser.joinedDate).toLocaleDateString()}
//                   </div>
//                 </div>
//               </div>
//               <div>
//                 <Label className="text-sm font-medium text-gray-500">Remarks</Label>
//                 <div className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-md">
//                   {selectedUser.remarks || "No remarks"}
//                 </div>
//               </div>
//               <div className="flex justify-end gap-2 pt-4">
//                 <Button variant="outline" onClick={handleCloseDetails}>
//                   Close
//                 </Button>
//                 <Button onClick={() => {
//                   handleCloseDetails()
//                   handleEdit(selectedUser)
//                 }}>
//                   Edit Details
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       )}

//       {/* Add/Edit User Modal */}
//       {(showAddModal || showEditModal) && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//             <CardHeader>
//               <CardTitle className="flex justify-between items-center">
//                 <span>{showAddModal ? 'Add New User' : 'Edit User'}</span>
//                 <Button variant="ghost" size="sm" onClick={() => showAddModal ? setShowAddModal(false) : setShowEditModal(false)}>
//                   <X className="h-4 w-4" />
//                 </Button>
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {/* Name */}
//                 <div className="space-y-2">
//                   <Label htmlFor="name">Full Name *</Label>
//                   <Input
//                     id="name"
//                     value={formData.name}
//                     onChange={(e) => handleInputChange('name', e.target.value)}
//                     placeholder="Enter full name"
//                     className={formErrors.name ? "border-red-500" : ""}
//                   />
//                   {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
//                 </div>

//                 {/* Contact No */}
//                 <div className="space-y-2">
//                   <Label htmlFor="contactNo">Contact No. *</Label>
//                   <Input
//                     id="contactNo"
//                     value={formData.contactNo}
//                     onChange={(e) => handleInputChange('contactNo', e.target.value)}
//                     placeholder="Enter 10-digit contact number"
//                     className={formErrors.contactNo ? "border-red-500" : ""}
//                   />
//                   {formErrors.contactNo && <p className="text-sm text-red-500">{formErrors.contactNo}</p>}
//                 </div>

//                 {/* Mobile Number */}
//                 <div className="space-y-2">
//                   <Label htmlFor="mobileNumber">Mobile Number</Label>
//                   <Input
//                     id="mobileNumber"
//                     value={formData.mobileNumber}
//                     onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
//                     placeholder="Enter mobile number (optional)"
//                   />
//                 </div>

//                 {/* Gender */}
//                 <div className="space-y-2">
//                   <Label htmlFor="gender">Gender</Label>
//                   <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="male">Male</SelectItem>
//                       <SelectItem value="female">Female</SelectItem>
//                       <SelectItem value="other">Other</SelectItem>
//                       <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {/* Address */}
//                 <div className="space-y-2">
//                   <Label htmlFor="address">Address *</Label>
//                   <Input
//                     id="address"
//                     value={formData.address}
//                     onChange={(e) => handleInputChange('address', e.target.value)}
//                     placeholder="Enter complete address"
//                     className={formErrors.address ? "border-red-500" : ""}
//                   />
//                   {formErrors.address && <p className="text-sm text-red-500">{formErrors.address}</p>}
//                 </div>

//                 {/* Village */}
//                 <div className="space-y-2">
//                   <Label htmlFor="village">Village *</Label>
//                   <Input
//                     id="village"
//                     value={formData.village}
//                     onChange={(e) => handleInputChange('village', e.target.value)}
//                     placeholder="Enter village"
//                     className={formErrors.village ? "border-red-500" : ""}
//                   />
//                   {formErrors.village && <p className="text-sm text-red-500">{formErrors.village}</p>}
//                 </div>

//                 {/* City */}
//                 <div className="space-y-2">
//                   <Label htmlFor="city">City *</Label>
//                   <Input
//                     id="city"
//                     value={formData.city}
//                     onChange={(e) => handleInputChange('city', e.target.value)}
//                     placeholder="Enter city"
//                     className={formErrors.city ? "border-red-500" : ""}
//                   />
//                   {formErrors.city && <p className="text-sm text-red-500">{formErrors.city}</p>}
//                 </div>

//                 {/* District */}
//                 <div className="space-y-2">
//                   <Label htmlFor="district">District *</Label>
//                   <Input
//                     id="district"
//                     value={formData.district}
//                     onChange={(e) => handleInputChange('district', e.target.value)}
//                     placeholder="Enter district"
//                     className={formErrors.district ? "border-red-500" : ""}
//                   />
//                   {formErrors.district && <p className="text-sm text-red-500">{formErrors.district}</p>}
//                 </div>

//                 {/* Lok Sabha */}
//                 <div className="space-y-2">
//                   <Label htmlFor="loksabha">Lok Sabha *</Label>
//                   <Input
//                     id="loksabha"
//                     value={formData.loksabha}
//                     onChange={(e) => handleInputChange('loksabha', e.target.value)}
//                     placeholder="Enter Lok Sabha constituency"
//                     className={formErrors.loksabha ? "border-red-500" : ""}
//                   />
//                   {formErrors.loksabha && <p className="text-sm text-red-500">{formErrors.loksabha}</p>}
//                 </div>

//                 {/* Vidhan Sabha */}
//                 <div className="space-y-2">
//                   <Label htmlFor="vidhansabha">Vidhan Sabha *</Label>
//                   <Input
//                     id="vidhansabha"
//                     value={formData.vidhansabha}
//                     onChange={(e) => handleInputChange('vidhansabha', e.target.value)}
//                     placeholder="Enter Vidhan Sabha constituency"
//                     className={formErrors.vidhansabha ? "border-red-500" : ""}
//                   />
//                   {formErrors.vidhansabha && <p className="text-sm text-red-500">{formErrors.vidhansabha}</p>}
//                 </div>

//                 {/* Booth No */}
//                 <div className="space-y-2">
//                   <Label htmlFor="boothNo">Booth No. *</Label>
//                   <Input
//                     id="boothNo"
//                     value={formData.boothNo}
//                     onChange={(e) => handleInputChange('boothNo', e.target.value)}
//                     placeholder="Enter booth number"
//                     className={formErrors.boothNo ? "border-red-500" : ""}
//                   />
//                   {formErrors.boothNo && <p className="text-sm text-red-500">{formErrors.boothNo}</p>}
//                 </div>

//                 {/* State */}
//                 <div className="space-y-2">
//                   <Label htmlFor="state">State *</Label>
//                   <Input
//                     id="state"
//                     value={formData.state}
//                     onChange={(e) => handleInputChange('state', e.target.value)}
//                     placeholder="Enter state"
//                     className={formErrors.state ? "border-red-500" : ""}
//                   />
//                   {formErrors.state && <p className="text-sm text-red-500">{formErrors.state}</p>}
//                 </div>

//                 {/* Pincode */}
//                 <div className="space-y-2">
//                   <Label htmlFor="pincode">Pincode</Label>
//                   <Input
//                     id="pincode"
//                     value={formData.pincode}
//                     onChange={(e) => handleInputChange('pincode', e.target.value)}
//                     placeholder="Enter 6-digit pincode"
//                   />
//                 </div>

//                 {/* Category - Changed from Select to Input */}
//                 <div className="space-y-2">
//                   <Label htmlFor="category">Category *</Label>
//                   <Input
//                     id="category"
//                     value={formData.category}
//                     onChange={(e) => handleInputChange('category', e.target.value)}
//                     placeholder="Enter category "
//                     className={formErrors.category ? "border-red-500" : ""}
//                   />
//                   {formErrors.category && <p className="text-sm text-red-500">{formErrors.category}</p>}
//                 </div>

//                 {/* Political Party */}
//                 <div className="space-y-2">
//                   <Label htmlFor="politicalParty">Political Party *</Label>
//                   <Input
//                     id="politicalParty"
//                     value={formData.politicalParty}
//                     onChange={(e) => handleInputChange('politicalParty', e.target.value)}
//                     placeholder="Enter political party"
//                     className={formErrors.politicalParty ? "border-red-500" : ""}
//                   />
//                   {formErrors.politicalParty && <p className="text-sm text-red-500">{formErrors.politicalParty}</p>}
//                 </div>
//               </div>

//               {/* Remarks */}
//               <div className="space-y-2">
//                 <Label htmlFor="remarks">Remarks</Label>
//                 <Textarea
//                   id="remarks"
//                   value={formData.remarks}
//                   onChange={(e) => handleInputChange('remarks', e.target.value)}
//                   placeholder="Enter any remarks or additional information"
//                   rows={3}
//                 />
//               </div>

//               <div className="flex justify-end gap-2 pt-4">
//                 <Button variant="outline" onClick={() => showAddModal ? setShowAddModal(false) : setShowEditModal(false)}>
//                   Cancel
//                 </Button>
//                 <Button 
//                   onClick={() => handleSave(showEditModal)} 
//                   className="flex items-center gap-2"
//                   disabled={isLoading}
//                 >
//                   <Save className="h-4 w-4" />
//                   {isLoading ? "Saving..." : (showAddModal ? 'Add User' : 'Update User')}
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && userToDelete && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <Card className="w-full max-w-md">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2 text-red-600">
//                 <Trash2 className="h-5 w-5" />
//                 Confirm Delete
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p>Are you sure you want to delete <strong>{userToDelete.name}</strong>? This action cannot be undone.</p>
//             </CardContent>
//             <CardContent className="flex justify-end gap-2">
//               <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
//                 Cancel
//               </Button>
//               <Button variant="destructive" onClick={confirmDelete} disabled={isLoading}>
//                 {isLoading ? "Deleting..." : "Delete"}
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//       )}
//     </div>
//   )
// }




// --------1--------

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Eye, Search, Download, Upload, Plus, Edit, Trash2, X, Save, User, Phone, MapPin, MoreVertical } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useUserManagementStore, type User, type CreateUserData, type UpdateUserData } from "@/lib/stores/user-store"
import { toast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import * as XLSX from 'xlsx';

export function AdminDashboard() {
  const {
    users,
    isLoading,
    error,
    filters,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    setFilters,
    exportUsers,
    getUserStats,
    importUsers
  } = useUserManagementStore()

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importPreview, setImportPreview] = useState<any[]>([])

  // Form state for add/edit
  const [formData, setFormData] = useState<CreateUserData>({
    name: "",
    contactNo: "",
    address: "",
    village: "",
    city: "",
    district: "",
    loksabha: "",
    vidhansabha: "",
    boothNo: "",
    state: "Chhattisgarh",
    category: "General",
    politicalParty: "CG NP",
    remarks: "",
    mobileNumber: "",
    pincode: "",
    gender: "male"
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Fetch users on component mount - set high limit to show all users
  useEffect(() => {
    setFilters({ limit: 10000 }) // Set high limit to show all users
    fetchUsers()
  }, [fetchUsers, setFilters])

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    }
  }, [error])

  // CRUD Operations
  const handleViewDetails = (user: User) => {
    setSelectedUser(user)
    setShowDetails(true)
  }

  const handleCloseDetails = () => {
    setShowDetails(false)
    setSelectedUser(null)
  }

  const handleAddNew = () => {
    setFormData({
      name: "",
      contactNo: "",
      address: "",
      village: "",
      city: "",
      district: "",
      loksabha: "",
      vidhansabha: "",
      boothNo: "",
      state: "Chhattisgarh",
      category: "General",
      politicalParty: "CG NP",
      remarks: "",
      mobileNumber: "",
      pincode: "",
      gender: "male"
    })
    setFormErrors({})
    setShowAddModal(true)
  }

  const handleEdit = (user: User) => {
    setFormData({
      name: user.name,
      contactNo: user.contactNo,
      address: user.address,
      village: user.village,
      city: user.city,
      district: user.district,
      loksabha: user.loksabha,
      vidhansabha: user.vidhansabha,
      boothNo: user.boothNo,
      state: user.state,
      category: user.category,
      politicalParty: user.politicalParty,
      remarks: user.remarks,
      mobileNumber: user.mobileNumber || "",
      pincode: user.pincode || "",
      gender: user.gender || "male"
    })
    setFormErrors({})
    setSelectedUser(user)
    setShowEditModal(true)
  }

  const handleDelete = (user: User) => {
    setUserToDelete(user)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!userToDelete) return

    const result = await deleteUser(userToDelete._id)
    if (result.success) {
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
      setShowDeleteModal(false)
      setUserToDelete(null)
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete user",
        variant: "destructive",
      })
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) {
      errors.name = "Name is required"
    }
    if (!formData.contactNo.trim()) {
      errors.contactNo = "Contact number is required"
    } else if (!/^[0-9]{10}$/.test(formData.contactNo)) {
      errors.contactNo = "Please enter a valid 10-digit contact number"
    }
    if (!formData.address.trim()) {
      errors.address = "Address is required"
    }
    if (!formData.village.trim()) {
      errors.village = "Village is required"
    }
    if (!formData.city.trim()) {
      errors.city = "City is required"
    }
    if (!formData.district.trim()) {
      errors.district = "District is required"
    }
    if (!formData.loksabha.trim()) {
      errors.loksabha = "Lok Sabha constituency is required"
    }
    if (!formData.vidhansabha.trim()) {
      errors.vidhansabha = "Vidhan Sabha constituency is required"
    }
    if (!formData.boothNo.trim()) {
      errors.boothNo = "Booth number is required"
    }
    if (!formData.state.trim()) {
      errors.state = "State is required"
    }
    if (!formData.category) {
      errors.category = "Category is required"
    }
    if (!formData.politicalParty.trim()) {
      errors.politicalParty = "Political party is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async (isEdit = false) => {
    if (!validateForm()) return

    if (isEdit && selectedUser) {
      const result = await updateUser(selectedUser._id, formData)
      if (result.success) {
        toast({
          title: "Success",
          description: "User updated successfully",
        })
        setShowEditModal(false)
        setSelectedUser(null)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update user",
          variant: "destructive",
        })
      }
    } else {
      const result = await createUser(formData)
      if (result.success) {
        toast({
          title: "Success",
          description: "User created successfully",
        })
        setShowAddModal(false)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create user",
          variant: "destructive",
        })
      }
    }
  }

  const handleInputChange = (field: keyof CreateUserData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ""
      }))
    }
  }

  const handleSearch = (searchTerm: string) => {
    setFilters({ search: searchTerm })
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const response = await fetch('/api/user-management/export')
      
      if (!response.ok) {
        throw new Error('Failed to export data')
      }
      
      const result = await response.json()
      
      if (result.success && result.data && result.data.length > 0) {
        const headers = [
          'Name',
          'Contact No',
          'Mobile Number',
          'Gender',
          'Address',
          'Village',
          'City',
          'District',
          'Lok Sabha',
          'Vidhan Sabha',
          'Booth No',
          'State',
          'Pincode',
          'Category',
          'Political Party',
          'Membership ID',
          'Joined Date',
          'Remarks'
        ];

        // Create CSV content
        const csvContent = [
          headers.join(','),
          ...result.data.map((user: any) => 
            headers.map(header => {
              const value = user[header] || '';
              // Escape quotes and wrap in quotes if contains comma
              return `"${String(value).replace(/"/g, '""')}"`;
            }).join(',')
          )
        ].join('\n');

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
        toast({
          title: "Success",
          description: `Exported ${result.total} users successfully`,
        });
      } else {
        toast({
          title: "Info",
          description: "No data available to export",
        });
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Error",
        description: "Failed to export users data",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  }

  const handleImportClick = () => {
    setShowImportModal(true)
    setImportFile(null)
    setImportPreview([])
  }

  const parseExcelFile = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get first worksheet
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  }

  const parseCSVFile = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const csvText = e.target?.result as string;
          const lines = csvText.split('\n');
          const headers = lines[0].split(',').map(header => header.trim());
          
          const result = [];
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const obj: any = {};
            const currentLine = lines[i].split(',');
            
            headers.forEach((header, index) => {
              obj[header] = currentLine[index] ? currentLine[index].trim() : '';
            });
            
            result.push(obj);
          }
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check if file is Excel or CSV
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ]
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/)) {
      toast({
        title: "Error",
        description: "Please select a valid Excel or CSV file",
        variant: "destructive",
      })
      return
    }

    setImportFile(file)
    
    try {
      let parsedData: any[] = [];
      
      if (file.name.endsWith('.csv')) {
        parsedData = await parseCSVFile(file);
      } else {
        parsedData = await parseExcelFile(file);
      }
      
      // Map the parsed data to our user format and add validation status
      const previewData = parsedData.slice(0, 10).map((row, index) => {
        const userData = {
          name: row.Name || row.name || '',
          contactNo: row['Contact No'] || row.contactNo || row.contact || '',
          mobileNumber: row['Mobile Number'] || row.mobileNumber || row.mobile || '',
          address: row.Address || row.address || '',
          village: row.Village || row.village || '',
          city: row.City || row.city || '',
          district: row.District || row.district || '',
          state: row.State || row.state || 'Chhattisgarh',
          loksabha: row['Lok Sabha'] || row.loksabha || '',
          vidhansabha: row['Vidhan Sabha'] || row.vidhansabha || '',
          boothNo: row['Booth No'] || row.boothNo || row.booth || '',
          pincode: row.Pincode || row.pincode || '',
          category: row.Category || row.category || 'General',
          politicalParty: row['Political Party'] || row.politicalParty || 'CG NP',
          gender: row.Gender || row.gender || 'male',
          remarks: row.Remarks || row.remarks || ''
        };

        // Validate required fields
        const isValid = userData.name && userData.contactNo && userData.address && 
                       userData.village && userData.city && userData.district;

        return {
          ...userData,
          status: isValid ? "Ready to import" : "Missing required fields",
          isValid,
          _id: `preview-${index}`
        };
      });

      setImportPreview(previewData);

      if (parsedData.length > 10) {
        toast({
          title: "Preview Limited",
          description: `Showing first 10 of ${parsedData.length} records. All records will be imported.`,
        });
      }

    } catch (error) {
      console.error('Error parsing file:', error);
      toast({
        title: "Error",
        description: "Failed to parse the file. Please check the file format.",
        variant: "destructive",
      });
    }
  }

  const handleImport = async () => {
    if (!importFile) {
      toast({
        title: "Error",
        description: "Please select a file to import",
        variant: "destructive",
      })
      return
    }

    setIsImporting(true)
    try {
      const formData = new FormData()
      formData.append('file', importFile)

      // Use the importUsers function from the store
      const result = await importUsers(formData)
      
      if (result.success) {
        toast({
          title: "Success",
          description: `Successfully imported ${result.importedCount} users`,
        })
        setShowImportModal(false)
        setImportFile(null)
        setImportPreview([])
        
        // Show detailed errors if any
        if (result.details?.errors && result.details.errors.length > 0) {
          toast({
            title: "Import Completed with Errors",
            description: `${result.importedCount} users imported, ${result.details.errors.length} errors occurred`,
            variant: "destructive",
          })
          
          // Log detailed errors for debugging
          console.log("Import errors:", result.details.errors)
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to import users",
          variant: "destructive",
        })
        
        // Show validation errors if available
        if (result.details && Array.isArray(result.details)) {
          console.error('Validation errors:', result.details)
        }
      }
    } catch (error) {
      console.error('Import error:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred during import",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  const stats = getUserStats()

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <CardTitle className="text-xl text-gray-900 flex items-center">
                <Settings className="h-5 w-5 mr-2 text-blue-600" />
                Party Administration - Member Database
              </CardTitle>
              <p className="text-sm text-gray-600">Manage all party members and their details</p>
            </div>
            <Button 
              onClick={handleAddNew} 
              className="mt-4 md:mt-0 flex items-center gap-2"
              disabled={isLoading}
            >
              <Plus className="h-4 w-4" />
              Add New Member
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
        

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, contact, city or state..."
                  value={filters.search || ""}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleImportClick}
              >
                <Upload className="h-4 w-4" />
                Import from Excel
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleExport}
                disabled={isExporting}
              >
                <Download className="h-4 w-4" />
                {isExporting ? "Exporting..." : "Export to Excel"}
              </Button>
            </div>
          </div>

          {/* Users Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      City
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      State
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.membershipId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center gap-1">
                          <Phone className="h-4 w-4 text-gray-400" />
                          {user.contactNo}
                        </div>
                        {user.mobileNumber && (
                          <div className="text-sm text-gray-500">{user.mobileNumber}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          {user.city}
                        </div>
                        <div className="text-sm text-gray-500">{user.district}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.state}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.category}</div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(user)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(user)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <div className="text-gray-500 mt-2">Loading users...</div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && users.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-500">No users found matching your search criteria.</div>
            </div>
          )}

          {/* Total Count Display */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing all {users.length} members
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Details Modal */}
      {showDetails && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>User Details - {selectedUser.name}</span>
                <Button variant="ghost" size="sm" onClick={handleCloseDetails}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                  <div className="text-sm text-gray-900 mt-1">{selectedUser.name}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Contact No.</Label>
                  <div className="text-sm text-gray-900 mt-1">{selectedUser.contactNo}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Mobile Number</Label>
                  <div className="text-sm text-gray-900 mt-1">{selectedUser.mobileNumber || "Not provided"}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Gender</Label>
                  <div className="text-sm text-gray-900 mt-1 capitalize">{selectedUser.gender || "Not specified"}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Address</Label>
                  <div className="text-sm text-gray-900 mt-1">{selectedUser.address}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Village</Label>
                  <div className="text-sm text-gray-900 mt-1">{selectedUser.village}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">City</Label>
                  <div className="text-sm text-gray-900 mt-1">{selectedUser.city}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">District</Label>
                  <div className="text-sm text-gray-900 mt-1">{selectedUser.district}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Lok Sabha</Label>
                  <div className="text-sm text-gray-900 mt-1">{selectedUser.loksabha}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Vidhan Sabha</Label>
                  <div className="text-sm text-gray-900 mt-1">{selectedUser.vidhansabha}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Booth No.</Label>
                  <div className="text-sm text-gray-900 mt-1">{selectedUser.boothNo}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">State</Label>
                  <div className="text-sm text-gray-900 mt-1">{selectedUser.state}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Pincode</Label>
                  <div className="text-sm text-gray-900 mt-1">{selectedUser.pincode || "Not provided"}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Category</Label>
                  <div className="text-sm text-gray-900 mt-1">
                    <Badge variant="secondary">{selectedUser.category}</Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Political Party</Label>
                  <div className="text-sm text-gray-900 mt-1">{selectedUser.politicalParty}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Membership ID</Label>
                  <div className="text-sm text-gray-900 mt-1">{selectedUser.membershipId || "Not assigned"}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Joined Date</Label>
                  <div className="text-sm text-gray-900 mt-1">
                    {new Date(selectedUser.joinedDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Remarks</Label>
                <div className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-md">
                  {selectedUser.remarks || "No remarks"}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleCloseDetails}>
                  Close
                </Button>
                <Button onClick={() => {
                  handleCloseDetails()
                  handleEdit(selectedUser)
                }}>
                  Edit Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add/Edit User Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{showAddModal ? 'Add New User' : 'Edit User'}</span>
                <Button variant="ghost" size="sm" onClick={() => showAddModal ? setShowAddModal(false) : setShowEditModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter full name"
                    className={formErrors.name ? "border-red-500" : ""}
                  />
                  {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
                </div>

                {/* Contact No */}
                <div className="space-y-2">
                  <Label htmlFor="contactNo">Contact No. *</Label>
                  <Input
                    id="contactNo"
                    value={formData.contactNo}
                    onChange={(e) => handleInputChange('contactNo', e.target.value)}
                    placeholder="Enter 10-digit contact number"
                    className={formErrors.contactNo ? "border-red-500" : ""}
                  />
                  {formErrors.contactNo && <p className="text-sm text-red-500">{formErrors.contactNo}</p>}
                </div>

                {/* Mobile Number */}
                <div className="space-y-2">
                  <Label htmlFor="mobileNumber">Mobile Number</Label>
                  <Input
                    id="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                    placeholder="Enter mobile number (optional)"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter complete address"
                    className={formErrors.address ? "border-red-500" : ""}
                  />
                  {formErrors.address && <p className="text-sm text-red-500">{formErrors.address}</p>}
                </div>

                {/* Village */}
                <div className="space-y-2">
                  <Label htmlFor="village">Village *</Label>
                  <Input
                    id="village"
                    value={formData.village}
                    onChange={(e) => handleInputChange('village', e.target.value)}
                    placeholder="Enter village"
                    className={formErrors.village ? "border-red-500" : ""}
                  />
                  {formErrors.village && <p className="text-sm text-red-500">{formErrors.village}</p>}
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Enter city"
                    className={formErrors.city ? "border-red-500" : ""}
                  />
                  {formErrors.city && <p className="text-sm text-red-500">{formErrors.city}</p>}
                </div>

                {/* District */}
                <div className="space-y-2">
                  <Label htmlFor="district">District *</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    placeholder="Enter district"
                    className={formErrors.district ? "border-red-500" : ""}
                  />
                  {formErrors.district && <p className="text-sm text-red-500">{formErrors.district}</p>}
                </div>

                {/* Lok Sabha */}
                <div className="space-y-2">
                  <Label htmlFor="loksabha">Lok Sabha *</Label>
                  <Input
                    id="loksabha"
                    value={formData.loksabha}
                    onChange={(e) => handleInputChange('loksabha', e.target.value)}
                    placeholder="Enter Lok Sabha constituency"
                    className={formErrors.loksabha ? "border-red-500" : ""}
                  />
                  {formErrors.loksabha && <p className="text-sm text-red-500">{formErrors.loksabha}</p>}
                </div>

                {/* Vidhan Sabha */}
                <div className="space-y-2">
                  <Label htmlFor="vidhansabha">Vidhan Sabha *</Label>
                  <Input
                    id="vidhansabha"
                    value={formData.vidhansabha}
                    onChange={(e) => handleInputChange('vidhansabha', e.target.value)}
                    placeholder="Enter Vidhan Sabha constituency"
                    className={formErrors.vidhansabha ? "border-red-500" : ""}
                  />
                  {formErrors.vidhansabha && <p className="text-sm text-red-500">{formErrors.vidhansabha}</p>}
                </div>

                {/* Booth No */}
                <div className="space-y-2">
                  <Label htmlFor="boothNo">Booth No. *</Label>
                  <Input
                    id="boothNo"
                    value={formData.boothNo}
                    onChange={(e) => handleInputChange('boothNo', e.target.value)}
                    placeholder="Enter booth number"
                    className={formErrors.boothNo ? "border-red-500" : ""}
                  />
                  {formErrors.boothNo && <p className="text-sm text-red-500">{formErrors.boothNo}</p>}
                </div>

                {/* State */}
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="Enter state"
                    className={formErrors.state ? "border-red-500" : ""}
                  />
                  {formErrors.state && <p className="text-sm text-red-500">{formErrors.state}</p>}
                </div>

                {/* Pincode */}
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    placeholder="Enter 6-digit pincode"
                  />
                </div>

                {/* Category - Changed from Select to Input */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    placeholder="Enter category "
                    className={formErrors.category ? "border-red-500" : ""}
                  />
                  {formErrors.category && <p className="text-sm text-red-500">{formErrors.category}</p>}
                </div>

                {/* Political Party */}
                <div className="space-y-2">
                  <Label htmlFor="politicalParty">Political Party *</Label>
                  <Input
                    id="politicalParty"
                    value={formData.politicalParty}
                    onChange={(e) => handleInputChange('politicalParty', e.target.value)}
                    placeholder="Enter political party"
                    className={formErrors.politicalParty ? "border-red-500" : ""}
                  />
                  {formErrors.politicalParty && <p className="text-sm text-red-500">{formErrors.politicalParty}</p>}
                </div>
              </div>

              {/* Remarks */}
              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) => handleInputChange('remarks', e.target.value)}
                  placeholder="Enter any remarks or additional information"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => showAddModal ? setShowAddModal(false) : setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleSave(showEditModal)} 
                  className="flex items-center gap-2"
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? "Saving..." : (showAddModal ? 'Add User' : 'Update User')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Import from Excel Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Import Users from Excel</span>
                <Button variant="ghost" size="sm" onClick={() => setShowImportModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="import-file">Select Excel or CSV File</Label>
                  <Input
                    id="import-file"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Supported formats: Excel (.xlsx, .xls) or CSV (.csv)
                  </p>
                </div>

                {importFile && (
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{importFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {(importFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Badge variant="secondary">Ready to import</Badge>
                    </div>
                  </div>
                )}

                {importPreview.length > 0 && (
                  <div className="space-y-4">
                    <Label>Preview ({importPreview.length} records)</Label>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Name
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Contact No
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                City
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                State
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {importPreview.map((user, index) => (
                              <tr key={user._id}>
                                <td className="px-4 py-2 text-sm">{user.name}</td>
                                <td className="px-4 py-2 text-sm">{user.contactNo}</td>
                                <td className="px-4 py-2 text-sm">{user.city}</td>
                                <td className="px-4 py-2 text-sm">{user.state}</td>
                                <td className="px-4 py-2 text-sm">
                                  <Badge 
                                    variant="outline" 
                                    className={user.isValid ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
                                  >
                                    {user.status}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      Records with missing required fields will be highlighted in red.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowImportModal(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleImport} 
                  className="flex items-center gap-2"
                  disabled={!importFile || isImporting}
                >
                  <Upload className="h-4 w-4" />
                  {isImporting ? "Importing..." : "Import Users"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                Confirm Delete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Are you sure you want to delete <strong>{userToDelete.name}</strong>? This action cannot be undone.</p>
            </CardContent>
            <CardContent className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete} disabled={isLoading}>
                {isLoading ? "Deleting..." : "Delete"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}