"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { z } from "zod"
import { CheckCircle, AlertCircle } from "lucide-react"

const leaderFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  position: z.string().min(2, "Position must be at least 2 characters"),
  bio: z.string().min(10, "Bio must be at least 10 characters").max(500, "Bio cannot exceed 500 characters"),
  role: z.enum([
    "national_convenor",
    "deputy_convenor",
    "policy_head",
    "organization_secretary",
    "state_convenor",
    "district_convenor",
  ]),
  permissions: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
})

type LeaderFormData = z.infer<typeof leaderFormSchema>

interface LeaderFormProps {
  leader?: any
  onSuccess?: () => void
}

export function LeaderForm({ leader, onSuccess }: LeaderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null)
  const [submitMessage, setSubmitMessage] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(leader?.permissions || [])

  const isEditing = !!leader

  const {
    register,
    handleSubmit,
    setValue,
     watch, // Add watch to track form values
    formState: { errors },
    reset,
  } = useForm<LeaderFormData>({
    resolver: zodResolver(leaderFormSchema),
    defaultValues: leader
      ? {
          name: leader.name,
          email: leader.email,
          phone: leader.phone,
          address: leader.address,
          position: leader.position,
          bio: leader.bio,
          role: leader.role,
          permissions: leader.permissions || [],
          isActive: leader.isActive || false,
        }
      : {
        isActive: false, // Default for new leaders
      },
  })

  const onSubmit = async (data: LeaderFormData) => {
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const url = isEditing ? `/api/leaders/${leader._id}` : "/api/leaders"
      const method = isEditing ? "PUT" : "POST"

      const submitData = {
        ...data,
        permissions: selectedPermissions,
      }

      // Remove password if editing and it's empty
      if (isEditing && !data.password) {
        delete submitData.password
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus("success")
        setSubmitMessage(result.message)
        if (!isEditing) {
          reset()
          setSelectedPermissions([])
        }
        onSuccess?.()
      } else {
        setSubmitStatus("error")
        setSubmitMessage(result.error || `${isEditing ? "Update" : "Creation"} failed`)
      }
    } catch (error) {
      setSubmitStatus("error")
      setSubmitMessage("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const roleOptions = [
    { value: "national_convenor", label: "National Convenor" },
    { value: "deputy_convenor", label: "Deputy Convenor" },
    { value: "policy_head", label: "Policy Head" },
    { value: "organization_secretary", label: "Organization Secretary" },
    { value: "state_convenor", label: "State Convenor" },
    { value: "district_convenor", label: "District Convenor" },
  ]

  const permissionOptions = [
    { id: "manage_members", label: "Manage Members" },
    { id: "view_analytics", label: "View Analytics" },
    { id: "manage_events", label: "Manage Events" },
    { id: "manage_donations", label: "Manage Donations" },
    // { id: "admin_access", label: "Admin Access" },
  ]

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permissionId])
    } else {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== permissionId))
    }
  }

  return (
    <div className="space-y-6">
      {submitStatus === "success" && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <p className="text-green-800">{submitMessage}</p>
        </div>
      )}

      {submitStatus === "error" && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-800">{submitMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter full name"
              className="border-gray-300 focus:border-blue-500"
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Enter email"
              className="border-gray-300 focus:border-blue-500"
              disabled={isEditing}
            />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>
        </div>

        {!isEditing && (
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Create a password"
              className="border-gray-300 focus:border-blue-500"
            />
            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="Enter phone number"
              className="border-gray-300 focus:border-blue-500"
            />
            {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position/Designation *</Label>
            <Input
              id="position"
              {...register("position")}
              placeholder="e.g., Social Worker, Activist"
              className="border-gray-300 focus:border-blue-500"
            />
            {errors.position && <p className="text-sm text-red-600">{errors.position.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Leadership Role *</Label>
          <Select onValueChange={(value) => setValue("role", value as any)} defaultValue={leader?.role}>
            <SelectTrigger className="border-gray-300 focus:border-blue-500">
              <SelectValue placeholder="Select leadership role" />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.role && <p className="text-sm text-red-600">{errors.role.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address *</Label>
          <Textarea
            id="address"
            {...register("address")}
            placeholder="Enter complete address"
            className="border-gray-300 focus:border-blue-500"
            rows={2}
          />
          {errors.address && <p className="text-sm text-red-600">{errors.address.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio/Background *</Label>
          <Textarea
            id="bio"
            {...register("bio")}
            placeholder="Tell us about background and experience"
            className="border-gray-300 focus:border-blue-500"
            rows={4}
          />
          {errors.bio && <p className="text-sm text-red-600">{errors.bio.message}</p>}
        </div>

        <div className="space-y-3">
          <Label>Permissions</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {permissionOptions.map((permission) => (
              <div key={permission.id} className="flex items-center space-x-2">
                <Checkbox
                  id={permission.id}
                  checked={selectedPermissions.includes(permission.id)}
                  onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                />
                <Label htmlFor={permission.id} className="text-sm font-normal">
                  {permission.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

      {isEditing && (
  <div className="flex items-center space-x-2">
    <Checkbox
      id="isActive"
      checked={watch("isActive")} // Use watch to get current value
      onCheckedChange={(checked) => setValue("isActive", checked as boolean)} // Use setValue to update
    />
    <Label htmlFor="isActive" className="text-sm font-normal">
      Active Leader
    </Label>
  </div>
)}

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 font-semibold py-3"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? `${isEditing ? "Updating" : "Creating"} Leader...`
            : `${isEditing ? "Update" : "Create"} Leader`}
        </Button>
      </form>
    </div>
  )
}
