import { z } from "zod"

export const memberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  referredBy: z.string().optional(),
})

export type MemberFormData = z.infer<typeof memberSchema>

export const leaderLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  referralCode: z.string().min(4, "Referral code must be at least 4 characters"),
})

export type LeaderLoginData = z.infer<typeof leaderLoginSchema>
