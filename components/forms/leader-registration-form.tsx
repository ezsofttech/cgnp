"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { z } from "zod"
import { CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

const leaderRegistrationSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    phone: z.string()
      .min(10, "Phone number must be exactly 10 digits")
      .max(10, "Phone number must be exactly 10 digits")
      .regex(/^\d{10}$/, "Phone number must contain only digits"),
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
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type LeaderRegistrationData = z.infer<typeof leaderRegistrationSchema>

export function LeaderRegistrationForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null)
  const [submitMessage, setSubmitMessage] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<LeaderRegistrationData>({
    resolver: zodResolver(leaderRegistrationSchema),
  })

  const onSubmit = async (data: LeaderRegistrationData) => {
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real app, you would call your actual API endpoint:

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      const result = await response.json()


      setSubmitStatus("success")
      setSubmitMessage("Thank you for registering! Your application is under review. Redirecting to home page...")
      reset()
      
      // Redirect to home after 3 seconds
      setTimeout(() => {
        router.push("/")
      }, 3000)
    } catch (error) {
      setSubmitStatus("error")
      setSubmitMessage("Registration failed. Please try again.")
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

  return (
    <Card className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm border-aap-blue-200">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-aap-blue-950">AAP Leader Registration</CardTitle>
        <p className="text-sm text-aap-blue-700">Join our leadership team and help build a better India</p>
      </CardHeader>
      <CardContent>
        {submitStatus === "success" && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-green-800">{submitMessage}</p>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-800">{submitMessage}</p>
          </div>
        )}

        {submitStatus !== "success" && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Enter your full name"
                  className="border-aap-blue-200 focus:border-aap-blue-500"
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="Enter your email"
                  className="border-aap-blue-200 focus:border-aap-blue-500"
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="Create a password (min 6 characters)"
                  className="border-aap-blue-200 focus:border-aap-blue-500"
                />
                {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  placeholder="Confirm your password"
                  className="border-aap-blue-200 focus:border-aap-blue-500"
                />
                {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="Enter 10-digit phone number"
                  className="border-aap-blue-200 focus:border-aap-blue-500"
                  maxLength={10}
                  inputMode="numeric"
                />
                {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position/Designation *</Label>
                <Input
                  id="position"
                  {...register("position")}
                  placeholder="e.g., Social Worker, Activist"
                  className="border-aap-blue-200 focus:border-aap-blue-500"
                />
                {errors.position && <p className="text-sm text-red-600">{errors.position.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Leadership Role *</Label>
              <Select onValueChange={(value) => setValue("role", value as any)}>
                <SelectTrigger className="border-aap-blue-200 focus:border-aap-blue-500">
                  <SelectValue placeholder="Select your leadership role" />
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
                placeholder="Enter your complete address"
                className="border-aap-blue-200 focus:border-aap-blue-500"
                rows={2}
              />
              {errors.address && <p className="text-sm text-red-600">{errors.address.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio/Background *</Label>
              <Textarea
                id="bio"
                {...register("bio")}
                placeholder="Tell us about your background, experience, and why you want to join AAP leadership (10-500 characters)"
                className="border-aap-blue-200 focus:border-aap-blue-500"
                rows={4}
              />
              {errors.bio && <p className="text-sm text-red-600">{errors.bio.message}</p>}
            </div>

            {/* <div className="bg-aap-blue-50 p-4 rounded-lg">
              <p className="text-sm text-aap-blue-800">
                <strong>Note:</strong> Your registration will be reviewed by our admin team. You will receive an email
                notification once your account is approved and activated.
              </p>
            </div> */}

            <Button
              type="submit"
              className="w-full bg-aap-yellow-400 hover:bg-aap-yellow-500 text-aap-blue-950 font-semibold py-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting Registration..." : "Register as Leader"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}