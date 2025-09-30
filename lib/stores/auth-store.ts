import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Leader {
  id: string
  name: string
  email: string
  role: string
  position: string
  referralCode: string
  permissions: string[]
  bio?: string
  image?: string
  phone?: string
  address?: string
  joinedDate?: string
}

interface AuthState {
  leader: Leader | null
  isLoading: boolean
  isAuthenticated:boolean
  isInitialized: boolean // Add this flag
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  updateLeader: (updates: Partial<Leader>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      leader: null,
      isLoading: false,
      isAuthenticated:false,
       isInitialized: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });

        try {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          console.log("Login response:", data);

          if (response.ok) {
            set({ leader: data.leader, isLoading: false,isAuthenticated:true })
            return { success: true }
          } else {
            set({ isLoading: false });
            return { success: false, error: data.error };
          }
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: "Network error" };
        }
      },

      logout: async () => {
        try {
          await fetch("/api/auth/logout", {
            method: "POST",
          })
        } catch (error) {
          console.error("Logout error:", error)
        } finally {
          set({ leader: null })
        }
      },

      checkAuth: async () => {
        try {


          const response = await fetch("/api/auth/me")
          console.log("test the auth ",response);
 
          if (response.ok) {
            const data = await response.json()
            set({ leader: data.leader,isAuthenticated:true ,isInitialized: true })
            console.log("isUthenticate get().isAuthenticated",get().isAuthenticated);
            
          } else {
            set({ leader: null ,isInitialized: true })
          }
        } catch (error) {
          console.error("Check auth error:", error)
          set({ leader: null,isInitialized: true  })
        }
      },

      updateLeader: (updates: Partial<Leader>) => {
        const currentLeader = get().leader
        if (currentLeader) {
          set({ leader: { ...currentLeader, ...updates } })
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ leader: state.leader }),
    },
  ),
)
