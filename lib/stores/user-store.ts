import { create } from "zustand"

// ✅ Utility to always include auth token from cookies
const authFetch = async (url: string, options: RequestInit = {}) => {
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

// ✅ Updated User Interface (Removed age, email, occupation, status, isVolunteer, volunteerSkills)
export interface User {
  _id: string
  name: string
  contactNo: string
  address: string
  village: string
  city: string
  district: string
  loksabha: string
  vidhansabha: string
  boothNo: string
  state: string
  category: "General" | "OBC" | "SC" | "ST" | "Other"
  politicalParty: string
  remarks: string
  mobileNumber?: string
  pincode?: string
  gender?: "male" | "female" | "other" | "prefer_not_to_say"
  membershipId?: string
  joinedDate: string
  createdAt: string
  updatedAt: string
}

// ✅ Updated CreateUserData (same fields except removed ones)
export interface CreateUserData {
  name: string
  contactNo: string
  address: string
  village: string
  city: string
  district: string
  loksabha: string
  vidhansabha: string
  boothNo: string
  state: string
  category: "General" | "OBC" | "SC" | "ST" | "Other"
  politicalParty: string
  remarks?: string
  mobileNumber?: string
  pincode?: string
  gender?: "male" | "female" | "other" | "prefer_not_to_say"
}

// ✅ Partial for updates
export interface UpdateUserData extends Partial<CreateUserData> {}

// ✅ Response structure
export interface UsersResponse {
  users: User[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// ✅ Export response structure
export interface ExportResponse {
  success: boolean
  data: any[]
  total: number
}

// ✅ Import response structure
export interface ImportResponse {
  success: boolean
  message?: string
  importedCount?: number
  error?: string
  details?: any
  summary?: {
    totalInFile: number
    imported: number
    skipped: number
    duplicates: number
  }
}

// ✅ Filters — removed "status"
export interface UserFilters {
  search?: string
  category?: string
  city?: string
  district?: string
  state?: string
  page?: number
  limit?: number
}

interface UserManagementState {
  users: User[]
  currentUser: User | null
  isLoading: boolean
  error: string | null
  filters: UserFilters
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }

  // Actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setFilters: (filters: Partial<UserFilters>) => void
  clearFilters: () => void

  // CRUD
  fetchUsers: (filters?: Partial<UserFilters>) => Promise<void>
  fetchUserById: (userId: string) => Promise<User | null>
  createUser: (userData: CreateUserData) => Promise<{ success: boolean; user?: User; error?: string }>
  updateUser: (userId: string, userData: UpdateUserData) => Promise<{ success: boolean; user?: User; error?: string }>
  deleteUser: (userId: string) => Promise<{ success: boolean; error?: string }>

  // Export
  exportUsers: (allData?: boolean) => Promise<any[] | null>

  // Import
  importUsers: (formData: FormData) => Promise<ImportResponse>

  // Stats
  getUserStats: () => {
    total: number
    byCategory: Record<string, number>
    byCity: Record<string, number>
  }
}

export const useUserManagementStore = create<UserManagementState>((set, get) => ({
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
  filters: {
    page: 1,
    limit: 10,
    search: "",
    category: "",
    city: "",
    district: "",
    state: ""
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  setFilters: (newFilters) => {
    const updatedFilters = { ...get().filters, ...newFilters, page: 1 }
    set({ filters: updatedFilters })
    get().fetchUsers(updatedFilters)
  },

  clearFilters: () => {
    const defaultFilters = {
      page: 1,
      limit: 10,
      search: "",
    category: "",
    city: "",
    district: "",
    state: ""
    }
    set({ filters: defaultFilters })
    get().fetchUsers(defaultFilters)
  },

  // ✅ Fetch users
  fetchUsers: async (filters = {}) => {
    const mergedFilters = { ...get().filters, ...filters }
    set({ isLoading: true, error: null })

    try {
      const queryParams = new URLSearchParams()
      Object.entries(mergedFilters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString())
      })

      const response = await authFetch(`/api/user-management?${queryParams}`)
      if (response.ok) {
        const data: UsersResponse = await response.json()
        set({
          users: data.users,
          pagination: data.pagination,
          filters: mergedFilters
        })
      } else {
        const errorData = await response.json()
        set({ error: errorData.error || "Failed to fetch users" })
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      set({ error: "Network error while fetching users" })
    } finally {
      set({ isLoading: false })
    }
  },

  // ✅ Fetch single user
  fetchUserById: async (userId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authFetch(`/api/user-management/${userId}`)
      if (response.ok) {
        const data = await response.json()
        set({ currentUser: data.user })
        return data.user
      } else {
        const errorData = await response.json()
        set({ error: errorData.error || "Failed to fetch user" })
        return null
      }
    } catch (error) {
      console.error("Error fetching user:", error)
      set({ error: "Network error while fetching user" })
      return null
    } finally {
      set({ isLoading: false })
    }
  },

  // ✅ Create user
  createUser: async (userData: CreateUserData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authFetch("/api/user-management", {
        method: "POST",
        body: JSON.stringify(userData),
      })
      const data = await response.json()
      if (response.ok) {
        await get().fetchUsers()
        return { success: true, user: data.user }
      } else {
        set({ error: data.error || "Failed to create user" })
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error("Error creating user:", error)
      set({ error: "Network error while creating user" })
      return { success: false, error: "Network error" }
    } finally {
      set({ isLoading: false })
    }
  },

  // ✅ Update user
  updateUser: async (userId: string, userData: UpdateUserData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authFetch(`/api/user-management/${userId}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      })
      const data = await response.json()
      if (response.ok) {
        const updatedUsers = get().users.map((u) =>
          u._id === userId ? { ...u, ...data.user } : u
        )
        set({ users: updatedUsers, currentUser: data.user })
        return { success: true, user: data.user }
      } else {
        set({ error: data.error || "Failed to update user" })
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error("Error updating user:", error)
      set({ error: "Network error while updating user" })
      return { success: false, error: "Network error" }
    } finally {
      set({ isLoading: false })
    }
  },

  // ✅ Delete user
  deleteUser: async (userId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authFetch(`/api/user-management/${userId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        set({ users: get().users.filter((u) => u._id !== userId) })
        return { success: true }
      } else {
        const data = await response.json()
        set({ error: data.error || "Failed to delete user" })
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      set({ error: "Network error while deleting user" })
      return { success: false, error: "Network error" }
    } finally {
      set({ isLoading: false })
    }
  },

  // ✅ Export - Updated to use the dedicated export endpoint
  exportUsers: async (allData = false) => {
    try {
      let url = '/api/user-management'
      
      if (allData) {
        // Use the dedicated export endpoint for all data
        url = '/api/user-management/export'
      } else {
        // For paginated data, use the existing endpoint with current filters
        const { page, limit, search, category, city, district, state } = get().filters
        const params = new URLSearchParams()
        params.append('page', page.toString())
        params.append('limit', limit.toString())
        if (search) params.append('search', search)
        if (category) params.append('category', category)
        if (city) params.append('city', city)
        if (district) params.append('district', district)
        if (state) params.append('state', state)
        url += `?${params.toString()}`
      }

      const response = await authFetch(url)
      
      if (!response.ok) {
        const errorData = await response.json()
        set({ error: errorData.error || 'Failed to export users' })
        return null
      }

      const data = await response.json()
      
      if (allData) {
        // Return the export data array
        return data.data || []
      } else {
        // Return paginated users
        return data.users || []
      }
    } catch (error) {
      console.error('Error exporting users:', error)
      set({ error: 'Network error while exporting users' })
      return null
    }
  },

  // ✅ Import users from Excel/CSV
  importUsers: async (formData: FormData): Promise<ImportResponse> => {
    set({ isLoading: true, error: null })
    
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth-token="))
        ?.split("=")[1]

      const response = await fetch('/api/user-management/import', {
        method: 'POST',
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })

      const result = await response.json()

      if (!response.ok) {
        set({ error: result.error || 'Import failed' })
        return {
          success: false,
          error: result.error || 'Import failed',
          details: result.details
        }
      }

      // Refresh the users list after successful import
      await get().fetchUsers()
      
      return {
        success: true,
        message: result.message,
        importedCount: result.summary?.imported,
        details: result,
        summary: result.summary
      }
    } catch (error: any) {
      console.error('Error importing users:', error)
      set({ error: error.message || 'Import failed' })
      return {
        success: false,
        error: error.message || 'Import failed'
      }
    } finally {
      set({ isLoading: false })
    }
  },

  // ✅ Simplified stats (no status counts)
  getUserStats: () => {
    const { users } = get()
    const stats = {
      total: users.length,
      byCategory: {} as Record<string, number>,
      byCity: {} as Record<string, number>
    }

    users.forEach((u) => {
      stats.byCategory[u.category] = (stats.byCategory[u.category] || 0) + 1
      stats.byCity[u.city] = (stats.byCity[u.city] || 0) + 1
    })

    return stats
  }
}))