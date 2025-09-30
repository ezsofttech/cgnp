"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePartyStore } from "@/lib/stores/party-store"
import { useState } from "react"
import { CheckCircle } from "lucide-react"
import { z } from "zod"

const memberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  occupation: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  referredBy: z.string().optional(),
})

type MemberFormData = z.infer<typeof memberSchema>

interface MemberFormProps {
  referralCode?: string
}

export function MemberForm({ referralCode }: MemberFormProps) {
  const { addMember } = usePartyStore()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      referredBy: referralCode || "",
    },
  })

  const onSubmit = async (data: MemberFormData) => {
    setSubmitError("")

    const result = await addMember(data)

    if (result.success) {
      setIsSubmitted(true)
      reset()
    } else {
      setSubmitError(result.error || "Failed to add member")
    }
  }

  if (isSubmitted) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
          <h3 className="text-2xl font-bold text-black">Welcome to AAP!</h3>
          <p className="text-gray-600">
            Thank you for joining the Aam Aadmi Party. We'll be in touch soon with more information about your
            membership.
          </p>
          <Button onClick={() => setIsSubmitted(false)} variant="outline">
            Add Another Member
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Join AAP</CardTitle>
        {referralCode && <p className="text-sm text-gray-600 text-center">Referred by: {referralCode}</p>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" {...register("name")} placeholder="Enter your full name" />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" {...register("email")} placeholder="Enter your email" />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" {...register("phone")} placeholder="Enter your phone number" />
            {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register("address")} placeholder="Enter your address" />
            {errors.address && <p className="text-sm text-red-600">{errors.address.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="occupation">Occupation (Optional)</Label>
            <Input id="occupation" {...register("occupation")} placeholder="Enter your occupation" />
            {errors.occupation && <p className="text-sm text-red-600">{errors.occupation.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state">State (Optional)</Label>
              <Input id="state" {...register("state")} placeholder="Enter your state" />
              {errors.state && <p className="text-sm text-red-600">{errors.state.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">District (Optional)</Label>
              <Input id="district" {...register("district")} placeholder="Enter your district" />
              {errors.district && <p className="text-sm text-red-600">{errors.district.message}</p>}
            </div>
          </div>

          {referralCode && <Input type="hidden" {...register("referredBy")} value={referralCode} />}

          {submitError && <p className="text-sm text-red-600 text-center">{submitError}</p>}

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
            {isSubmitting ? "Joining..." : "Join AAP"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
