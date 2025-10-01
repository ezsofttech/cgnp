"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, CheckCircle, XCircle, Clock } from "lucide-react"
import { Member } from "@/types"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
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
import { Badge } from "@/components/ui/badge"

export default function MemberDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const pdfRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (params.id) {
      fetchMember(params.id as string)
    }
  }, [params.id])

  const fetchMember = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/members/${id}`)
      const data = await response.json()

      if (response.ok) {
        setMember(data.member)
      }
    } catch (error) {
      console.error("Error fetching member:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    if (!member) return

    try {
      setUpdatingStatus(true)
      const response = await fetch(`/api/members/${member._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Update local state immediately
        setMember(prev => prev ? { ...prev, status: newStatus } : null)
        // Optionally refresh the data
        await fetchMember(member._id)
      }
    } catch (error) {
      console.error("Error updating member status:", error)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const exportToPDF = async () => {
    if (!member || !pdfRef.current) return

    try {
      setExporting(true)
      
      const element = pdfRef.current
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          // Fix for badge rendering in PDF
          const badges = clonedDoc.querySelectorAll('.pdf-badge, .pdf-skill-badge')
          badges.forEach((badge) => {
            const htmlBadge = badge as HTMLElement
            htmlBadge.style.display = 'inline-block'
            htmlBadge.style.verticalAlign = 'middle'
            htmlBadge.style.lineHeight = '1.2'
          })
        }
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 295 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`member-${member.membershipId || member.name}-${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      console.error("Error exporting to PDF:", error)
    } finally {
      setExporting(false)
    }
  }

  const formatDate = (date: Date | string) => {
    if (!date) return 'Not provided'
    return new Date(date).toLocaleDateString("en-IN", {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800 border border-green-200' :
           status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
           'bg-gray-100 text-gray-800 border border-gray-200'
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

  const canManageMembers = true // You can add your permission logic here

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!member) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Member not found</p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Member Details</h1>
            <p className="text-gray-600">Complete information about {member.name}</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Status Actions */}
          {canManageMembers && member.status === "pending" && (
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                    disabled={updatingStatus}
                  >
                    <CheckCircle className="h-4 w-4" />
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
                      onClick={() => handleStatusUpdate("active")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {updatingStatus ? "Approving..." : "Approve"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 bg-transparent border-red-200 hover:bg-red-50 flex items-center gap-2"
                    disabled={updatingStatus}
                  >
                    <XCircle className="h-4 w-4" />
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
                      onClick={() => handleStatusUpdate("inactive")}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {updatingStatus ? "Rejecting..." : "Reject"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}

          <Button
            onClick={exportToPDF}
            disabled={exporting}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {exporting ? "Exporting..." : "Export PDF"}
          </Button>
        </div>
      </div>

      {/* Status Display */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-gray-600">Current Status</p>
              <Badge className={`text-sm flex items-center gap-1 ${(member.status)}`}>
                {getStatusIcon(member.status)}
                {member.status?.charAt(0).toUpperCase() + member.status?.slice(1)}
              </Badge>
            </div>
            {member.isVolunteer && (
              <div>
                <p className="text-sm text-gray-600">Volunteer Status</p>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Volunteer
                </Badge>
              </div>
            )}
          </div>
          
          {member.status === "pending" && canManageMembers && (
            <p className="text-sm text-yellow-600 bg-yellow-50 px-3 py-2 rounded-md">
              This member is awaiting approval. You can approve or reject their application.
            </p>
          )}
        </div>
      </div>

      {/* Content for PDF */}
      <div ref={pdfRef} className="bg-white p-8 border border-gray-200 rounded-lg">
        {/* Header Section */}
        <div className="text-center mb-8 border-b pb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Member Information</h1>
          <div className="flex justify-center items-center gap-4">
            <div className={`pdf-badge inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium min-h-[2rem] ${(member.status)}`}>
              {member.status?.charAt(0).toUpperCase() + member.status?.slice(1)}
            </div>
            {member.isVolunteer && (
              <div className="pdf-badge inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 min-h-[2rem]">
                Volunteer
              </div>
            )}
          </div>
        </div>

        {/* Main Content - Same as before */}
        <div className="space-y-8">
          {/* Personal Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                <p className="text-gray-900">{member.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Membership ID</label>
                <p className="text-gray-900 font-mono">{member.membershipId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Age</label>
                <p className="text-gray-900">{member.age || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Gender</label>
                <p className="text-gray-900 capitalize">{member.gender || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Member Type</label>
                <p className="text-gray-900">{member.memberType || 'Not provided'}</p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                <p className="text-gray-900">{member.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Mobile Number</label>
                <p className="text-gray-900">{member.mobileNumber || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">WhatsApp Number</label>
                <p className="text-gray-900">
                  {member.whatsappNumber || (member.isWhatsAppSame ? 'Same as mobile' : 'Not provided')}
                </p>
              </div>
            </div>
          </section>

          {/* Address Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">Address Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Complete Address</label>
                <p className="text-gray-900">{member.address || 'Not provided'}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">District</label>
                  <p className="text-gray-900">{member.district || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Tehsil</label>
                  <p className="text-gray-900">{member.tehsil || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Political Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">Political Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Lok Sabha Constituency</label>
                <p className="text-gray-900">{member.lokSabha || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Vidhan Sabha Constituency</label>
                <p className="text-gray-900">{member.vidhanSabha || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Ward</label>
                <p className="text-gray-900">{member.ward || 'Not provided'}</p>
              </div>
            </div>
          </section>

          {/* Membership Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">Membership Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Joined Date</label>
                <p className="text-gray-900">{formatDate(member.joinedDate)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Membership Status</label>
                <div className={`pdf-badge inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium min-h-[1.5rem] ${(member.status)}`}>
                  {member.status?.charAt(0).toUpperCase() + member.status?.slice(1)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Volunteer Status</label>
                <p className="text-gray-900">{member.isVolunteer ? 'Yes' : 'No'}</p>
              </div>
            </div>
            
            {/* Volunteer Skills */}
            {member.volunteerSkills && member.volunteerSkills.length > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-500 mb-2">Volunteer Skills</label>
                <div className="flex flex-wrap gap-2">
                  {member.volunteerSkills.map((skill, index) => (
                    <div 
                      key={index}
                      className="pdf-skill-badge inline-flex items-center justify-center px-3 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200 min-h-[1.5rem]"
                    >
                      {skill.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Information */}
            {member.additionalInfo && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-500 mb-2">Additional Information</label>
                <p className="text-gray-900 whitespace-pre-wrap">{member.additionalInfo}</p>
              </div>
            )}
          </section>

          {/* Footer */}
          <div className="border-t pt-6 text-center text-sm text-gray-500">
            <p>Generated on {new Date().toLocaleDateString("en-IN", { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
        </div>
      </div>
    </div>
  )
}