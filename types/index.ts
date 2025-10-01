export interface Leader {
  id: string
  name: string
  position: string
  bio: string
  image: string
  email: string
  joinedDate: string
  referralCode: string
}

export interface Member {
  whatsappNumber: string
  isWhatsAppSame: any
  additionalInfo: ReactNode
  volunteerSkills: boolean
  lokSabha: string
  mobileNumber(mobileNumber: any): import("react").ReactNode
  _id: string
  name: string
  email: string
  phone: string
  state: string
  district: string
  isVolunteer: boolean
  membershipId: string
  address: string
  joinedDate: string
  referredBy?: string
  status: "active" | "pending" | "inactive"
}

export interface PartyInfo {
  name: string
  mission: string
  values: string[]
  goals: string[]
  foundedYear: number
  description: string
}

export interface ReferralLink {
  id: string
  leaderId: string
  code: string
  createdDate: string
  usedCount: number
  isActive: boolean
}
