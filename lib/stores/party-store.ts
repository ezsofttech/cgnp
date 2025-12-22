import { create } from "zustand"

// ✅ Utility to always include auth token from cookies
const authFetch = async (url: string, options: RequestInit = {}) => {
  // Get token from cookies
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("auth-token="))
    ?.split("=")[1]

  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const res = await fetch(url, { ...options, headers })
  return res
}

interface Leader {
  _id: string
  name: string
  email: string
  position: string
  bio: string
  image?: string
  phone: string
  address: string
  refferalCode: string
  joinedDate: string
  isActive: boolean
  role: string
  permissions: string[]
}

interface Member {
  _id: string
  name: string
  email: string
  phone: string
  address: string
  mobileNumber: string
  whatsappNumber: string
  isWhatsAppSame: boolean
  dateOfBirth?: string
  occupation?: string
  referredBy?: string
  referredByLeader?: {
    _id: string
    name: string
    position: string
  }
  joinedDate: string
  status: "active" | "pending" | "inactive"
  constituency?: string
  state?: string
  district?: string
  isVolunteer: boolean
  skills?: string[]
}

interface PartyInfo {
  _id: string
  name: string
  mission: string
  values: string[]
  goals: string[]
  foundedYear: number
  description: string
  headquarters: string
  website: string
  socialMedia: {
    twitter?: string
    facebook?: string
    instagram?: string
    youtube?: string
  }
  contactInfo: {
    email: string
    phone: string
    address: string
  }
}

interface ReferralLinkResponse {
  refferalLink: string
  refferalCode: string
  leaderName: string
  leaderPosition: string
  expiresAt?: string
  usageCount?: number
}

interface PartyState {
  leaders: Leader[]
  members: Member[]
  partyInfo: PartyInfo | null
  isLoading: boolean
  refferalLinks: Map<string, ReferralLinkResponse>

  // Actions
  setLoading: (loading: boolean) => void
  fetchLeaders: () => Promise<void>
  fetchMembers: () => Promise<void>
  fetchPartyInfo: () => Promise<void>
  addMember: (memberData: any) => Promise<{ success: boolean; error?: string; member?: any }>
  deleteMember: (memberId: string) => Promise<{ success: boolean; error?: string }>
  checkMobileExists: (mobileNumber: string) => Promise<{ exists: boolean; message?: string }>
  generateReferralLink: (refferalCode: string) => string
  getReferralLink: (refferalCode: string, forceRefresh?: boolean) => Promise<ReferralLinkResponse>
  getReferralLinkByLeaderId: (leaderId: string) => Promise<ReferralLinkResponse>
  validateReferralCode: (refferalCode: string) => Promise<{ valid: boolean; leader?: Leader }>
}

export const usePartyStore = create<PartyState>((set, get) => ({
  leaders: [],
  members: [],
  partyInfo: null,
  isLoading: false,
  refferalLinks: new Map(),

  setLoading: (isLoading) => set({ isLoading }),

  fetchLeaders: async () => {
    set({ isLoading: true })
    try {
      const response = await authFetch("/api/leaders")
      if (response.ok) {
        const data = await response.json()
        set({ leaders: data.leaders })
      } else {
        console.error("Failed to fetch leaders:", response.status)
      }
    } catch (error) {
      console.error("Error fetching leaders:", error)
    } finally {
      set({ isLoading: false })
    }
  },

  fetchMembers: async () => {
    set({ isLoading: true })
    try {
      const storedData = localStorage.getItem("auth-storage")
      let leader = null
      if (storedData) {
        const parsed = JSON.parse(storedData)
        leader = parsed.state?.leader
      }

      let url = "/api/members"
      if (leader && leader.role !== "party_admin") {
        url = `/api/members/refferal/${leader.id}`
      }

      const response = await authFetch(url)

      if (response.ok) {
        const data = await response.json()
        set({ members: data.member })
      } else {
        console.error("❌ Failed to fetch members:", response.status)
      }
    } catch (error) {
      console.error("🚨 Error fetching members:", error)
    } finally {
      set({ isLoading: false })
    }
  },

  fetchPartyInfo: async () => {
    try {
      const response = await authFetch("/api/party-info")
      if (response.ok) {
        const data = await response.json()
        set({ partyInfo: data.partyInfo })
      }
    } catch (error) {
      console.error("Error fetching party info:", error)
    }
  },

  addMember: async (memberData) => {
    try {
      const response = await authFetch("/api/members", {
        method: "POST",
        body: JSON.stringify(memberData),
      })

      const data = await response.json()
      if (response.ok) {
        // Refresh members list
        await get().fetchMembers()
        return { success: true, member: data.member }
      } else {
        return { 
          success: false, 
          error: data.error || data.details?.[0] || "Failed to add member" 
        }
      }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || "Network error" 
      }
    }
  },

  deleteMember: async (memberId) => {
    try {
      // Option 1: Using query parameter
      const response = await authFetch(`/api/members?id=${memberId}`, {
        method: "DELETE",
      })

      // Option 2: If you prefer request body instead
      // const response = await authFetch("/api/members", {
      //   method: "DELETE",
      //   body: JSON.stringify({ id: memberId }),
      // })

      const data = await response.json()
      if (response.ok) {
        // Remove the deleted member from local state
        set((state) => ({
          members: state.members.filter((member) => member._id !== memberId)
        }))
        return { success: true }
      } else {
        return { success: false, error: data.error || "Failed to delete member" }
      }
    } catch (error) {
      console.error("Error deleting member:", error)
      return { success: false, error: "Network error" }
    }
  },

  checkMobileExists: async (mobileNumber: string) => {
    try {
      const response = await fetch(`/api/members/check-mobile?mobile=${mobileNumber}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return { exists: data.exists, message: data.message }
    } catch (error) {
      console.error('Error checking mobile:', error)
      return { exists: false, message: 'Error checking mobile number' }
    }
  },

  generateReferralLink: (refferalCode: string) => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/join?ref=${refferalCode}`
    }
    return `https://your-domain.com/join?ref=${refferalCode}`
  },

  getReferralLink: async (refferalCode, forceRefresh = false) => {
    const { refferalLinks, generateReferralLink, leaders } = get()
    if (!forceRefresh && refferalLinks.has(refferalCode)) {
      return refferalLinks.get(refferalCode)!
    }

    try {
      const response = await authFetch(`/api/leaders/refferal/${refferalCode}`)
      if (response.ok) {
        const data = await response.json()
        const refferalLinkData: ReferralLinkResponse = {
          refferalLink: generateReferralLink(refferalCode),
          refferalCode,
          leaderName: data.leader?.name || "Unknown Leader",
          leaderPosition: data.leader?.position || "Leader",
          expiresAt: data.expiresAt,
          usageCount: data.usageCount,
        }

        const newMap = new Map(refferalLinks)
        newMap.set(refferalCode, refferalLinkData)
        set({ refferalLinks: newMap })

        return refferalLinkData
      } else {
        throw new Error("Failed to fetch refferal link")
      }
    } catch (error) {
      console.error("Error fetching refferal link:", error)
      const leader = leaders.find((l) => l.refferalCode === refferalCode)
      return {
        refferalLink: generateReferralLink(refferalCode),
        refferalCode,
        leaderName: leader?.name || "Unknown Leader",
        leaderPosition: leader?.position || "Leader",
      }
    }
  },

  getReferralLinkByLeaderId: async (leaderId: string) => {
    const { leaders, getReferralLink } = get()
    const leader = leaders.find((l) => l._id === leaderId)
    if (!leader) throw new Error("Leader not found")
    return await getReferralLink(leader.refferalCode)
  },

  validateReferralCode: async (refferalCode) => {
    try {
      const response = await authFetch(`/api/leaders/refferal/${refferalCode}/validate`)
      if (response.ok) {
        const data = await response.json()
        return { valid: data.valid, leader: data.leader }
      } else {
        const { leaders } = get()
        const leader = leaders.find((l) => l.refferalCode === refferalCode && l.isActive)
        return { valid: !!leader, leader }
      }
    } catch (error) {
      console.error("Error validating refferal code:", error)
      const { leaders } = get()
      const leader = leaders.find((l) => l.refferalCode === refferalCode && l.isActive)
      return { valid: !!leader, leader }
    }
  },
}))