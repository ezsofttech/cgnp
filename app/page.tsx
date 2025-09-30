import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/sections/hero-section"
import { PartyLeadersSection } from "@/components/sections/leaders-section"
import { MissionSection } from "@/components/sections/mission-section"
import HistoryTimeline from "@/components/sections/history-timeline"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        {/* <HistoryTimeline/> */}
        {/* <PartyLeadersSection /> */}
        <MissionSection />
      </main>
      <Footer />
    </div>
  )
}
