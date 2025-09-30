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

interface PartyState {
  leaders: Leader[]
  members: Member[]
  partyInfo: PartyInfo | null
  isLoading: boolean

  // Actions
  setLoading: (loading: boolean) => void
  fetchLeaders: () => Promise<void>
  fetchMembers: (referralCode?: string) => Promise<void>
  fetchPartyInfo: () => Promise<void>
  addMember: (memberData: any) => Promise<{ success: boolean; error?: string }>
  generateReferralLink: (referralCode: string) => string
}

export const usePartyStore = create<PartyState>((set, get) => ({
  leaders: [],
  members: [],
  partyInfo: null,
  isLoading: false,

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

  fetchMembers: async (referralCode?: string) => {
    set({ isLoading: true })
    try {
      const url = "/api/members"
      
      const response = await fetch(url)
      
      if (response.ok) {
        const data = await response.json()
        console.log("memebr",data.members);
        set({ members: data.members })
      }
    } catch (error) {
      console.error("Error fetching members:", error)
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
}))
