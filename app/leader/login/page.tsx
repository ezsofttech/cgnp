import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { LeaderLoginForm } from "@/components/forms/leader-login-form"

export default function LeaderLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-aap-blue-950 via-aap-blue-900 to-aap-blue-800">
      <Header />
      <main className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6 mb-12 text-white">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-aap-yellow-400 rounded-full flex items-center justify-center shadow-2xl">
                <svg viewBox="0 0 24 24" className="h-12 w-12 text-aap-blue-950" fill="currentColor">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9M15 11.5C15.8 11.5 16.5 12.2 16.5 13S15.8 14.5 15 14.5 13.5 13.8 13.5 13 14.2 11.5 15 11.5M5 7V9L11 8.5V7H5M11 11.5C11.8 11.5 12.5 12.2 12.5 13S11.8 14.5 11 14.5 9.5 13.8 9.5 13 10.2 11.5 11 11.5M12 15C12 16.66 10.66 18 9 18S6 16.66 6 15H12M18 15C18 16.66 16.66 18 15 18S12 16.66 12 15H18Z" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">CG NP Leader Portal</h1>
            <p className="text-xl text-aap-blue-100 max-w-3xl mx-auto leading-relaxed">
             Step into your leader hub to organize your team, monitor progress, and help us build a more transparent government.
            </p>
            {/* <div className="flex flex-wrap justify-center items-center gap-4 text-lg font-medium">
              <span className="text-aap-yellow-400">बेशर्मिकत</span>
              <span className="text-aap-blue-300">|</span>
              <span className="text-aap-yellow-400">ईमानदारी</span>
              <span className="text-aap-blue-300">|</span>
              <span className="text-aap-yellow-400">इंसानियत</span>
            </div> */}
          </div>

          <LeaderLoginForm />

          {/* <div className="text-center mt-8">
            <p className="text-aap-blue-100">
              Don't have an account?{" "}
              <a href="/leader/register" className="text-aap-yellow-400 hover:text-aap-yellow-300 font-medium">
                Register as Leader
              </a>
            </p>
          </div> */}
        </div>
      </main>
      <Footer />
    </div>
  )
}
