import { create } from "zustand"

interface Leader {
  _id: string
  name: string
  email: string
  position: string
  bio: string
  image?: string
  phone: string
  address: string
  referralCode: string
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
  referralLink: string
  referralCode: string
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
  referralLinks: Map<string, ReferralLinkResponse> // Cache for referral links

  // Actions
  setLoading: (loading: boolean) => void
  fetchLeaders: () => Promise<void>
  fetchMembers: (referralCode?: string) => Promise<void>
  fetchPartyInfo: () => Promise<void>
  addMember: (memberData: any) => Promise<{ success: boolean; error?: string }>
  generateReferralLink: (referralCode: string) => string
  getReferralLink: (referralCode: string, forceRefresh?: boolean) => Promise<ReferralLinkResponse>
  getReferralLinkByLeaderId: (leaderId: string) => Promise<ReferralLinkResponse>
  validateReferralCode: (referralCode: string) => Promise<{ valid: boolean; leader?: Leader }>
}

export const usePartyStore = create<PartyState>((set, get) => ({
  leaders: [],
  members: [],
  partyInfo: null,
  isLoading: false,
  referralLinks: new Map(),

  setLoading: (isLoading) => set({ isLoading }),

  fetchLeaders: async () => {
    set({ isLoading: true })
    try {
      const response = await fetch("/api/leaders")
      if (response.ok) {
        const data = await response.json()
        set({ leaders: data.leaders })
      }
      console.log("Fetched leaders:", get().leaders);
    } catch (error) {
      console.error("Error fetching leaders:", error)
    } finally {
      set({ isLoading: false })
    }
  },

fetchMembers: async () => {
  set({ isLoading: true })
  try {
    // Adjust this key to whatever your persisted store key is
    const storedData = localStorage.getItem("auth-storage")
    console.log("Stored auth data:", storedData)

    let leader = null
    if (storedData) {
      console.log("Parsing stored auth data",storedData )
      const parsed = JSON.parse(storedData)
      console.log("Parsed auth data:", parsed)
 leader = parsed.state.leader
   console.log("Parsed leader from storage:", leader)     
      // const state = parsed.state ? JSON.parse(parsed.state) : parsed
     
    
    }

    console.log("Leader info from localStorage:", leader)

    let url = "/api/members" // default for party admin
    if (leader) {
      const role = leader.role
      const id = leader.id
console.log("Leader role and ID:", role, id)
      if (role !== "party_admin") {
        url = `/api/members/refferal/${id}`  // fix spelling
      }
    }

    console.log("📡 Fetching members from:", url)

    const response = await fetch(url)

    if (response.ok) {
          const data = await response.json(); // Clone response to read it twice

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
      const response = await fetch("/api/party-info")
      console.log("Fetching party info from API:", response);
      
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
      const response = await fetch("/api/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(memberData),
      })

      const data = await response.json()

      if (response.ok) {
        // Refresh members list
        const { fetchMembers } = get()
        await fetchMembers(memberData.referredBy)
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: "Network error" }
    }
  },

  generateReferralLink: (referralCode: string) => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/join?ref=${referralCode}`
    }
    return `https://your-domain.com/join?ref=${referralCode}`
  },

  // GET method to fetch referral link with additional data
  getReferralLink: async (referralCode: string, forceRefresh: boolean = false): Promise<ReferralLinkResponse> => {
    const { referralLinks, generateReferralLink, leaders } = get()

    // Check cache first if not forcing refresh
    if (!forceRefresh && referralLinks.has(referralCode)) {
      return referralLinks.get(referralCode)!
    }

    try {
      // Fetch leader details for this referral code
      const response = await fetch(`/api/leaders/referral/${referralCode}`)
      
      if (response.ok) {
        const data = await response.json()
        
        const referralLinkData: ReferralLinkResponse = {
          referralLink: generateReferralLink(referralCode),
          referralCode: referralCode,
          leaderName: data.leader?.name || "Unknown Leader",
          leaderPosition: data.leader?.position || "Leader",
          expiresAt: data.expiresAt,
          usageCount: data.usageCount
        }

        // Update cache
        const newReferralLinks = new Map(referralLinks)
        newReferralLinks.set(referralCode, referralLinkData)
        set({ referralLinks: newReferralLinks })

        return referralLinkData
      } else {
        // Fallback if API fails
        const leader = leaders.find(l => l.referralCode === referralCode)
        const referralLinkData: ReferralLinkResponse = {
          referralLink: generateReferralLink(referralCode),
          referralCode: referralCode,
          leaderName: leader?.name || "Unknown Leader",
          leaderPosition: leader?.position || "Leader"
        }

        // Update cache with fallback data
        const newReferralLinks = new Map(referralLinks)
        newReferralLinks.set(referralCode, referralLinkData)
        set({ referralLinks: newReferralLinks })

        return referralLinkData
      }
    } catch (error) {
      console.error("Error fetching referral link:", error)
      
      // Fallback to basic generation
      const leader = leaders.find(l => l.referralCode === referralCode)
      const referralLinkData: ReferralLinkResponse = {
        referralLink: generateReferralLink(referralCode),
        referralCode: referralCode,
        leaderName: leader?.name || "Unknown Leader",
        leaderPosition: leader?.position || "Leader"
      }

      return referralLinkData
    }
  },

  // GET method to fetch referral link by leader ID
  getReferralLinkByLeaderId: async (leaderId: string): Promise<ReferralLinkResponse> => {
    const { leaders, getReferralLink } = get()
    
    const leader = leaders.find(l => l._id === leaderId)
    if (!leader) {
      throw new Error("Leader not found")
    }

    return await getReferralLink(leader.referralCode)
  },

  // GET method to validate a referral code
  validateReferralCode: async (referralCode: string): Promise<{ valid: boolean; leader?: Leader }> => {
    try {
      const response = await fetch(`/api/leaders/referral/${referralCode}/validate`)
      
      if (response.ok) {
        const data = await response.json()
        return {
          valid: data.valid,
          leader: data.leader
        }
      } else {
        // Fallback validation
        const { leaders } = get()
        const leader = leaders.find(l => l.referralCode === referralCode && l.isActive)
        return {
          valid: !!leader,
          leader: leader
        }
      }
    } catch (error) {
      console.error("Error validating referral code:", error)
      // Fallback validation
      const { leaders } = get()
      const leader = leaders.find(l => l.referralCode === referralCode && l.isActive)
      return {
        valid: !!leader,
        leader: leader
      }
    }
  }
}))