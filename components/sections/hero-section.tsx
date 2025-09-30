'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Users, Target, Heart, Zap } from "lucide-react"

export function HeroSection() {
  const [showVideo, setShowVideo] = useState(false)

  // Optional: Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowVideo(false)
    }
    if (showVideo) document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [showVideo])

  return (
    <section className="relative bg-[#f4f6ea] overflow-hidden">
      {/* Hero Container */}
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left: Text */}
          <div className="flex-1 w-full text-center lg:text-left space-y-6">
            <div className="flex justify-center lg:justify-start">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <Zap className="h-12 w-12 text-white" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              <span className="text-blue-700">Chhattisgarh</span> New Party
              <span className="block text-3xl md:text-4xl text-blue-700 mt-2">
                न्यायपूर्ण राजनीति, जवाबदेह सरकार
              </span>
            </h1>

            <p className="text-lg text-gray-700 max-w-xl mx-auto lg:mx-0">
              Join India's fight against corruption. Together, we're building transparent governance that serves the
              common people and ensures accountability at every level.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mt-6">
              <Button asChild size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700">
                <Link href="/join">
                  Join Our Movement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 border-blue-600 text-blue-700 hover:bg-blue-50"
              >
                <Link href="#journey">Our Journey</Link>
              </Button>
            </div>
          </div>

          {/* Right: Video thumbnail */}
          <div className="flex-1 relative rounded-xl overflow-hidden shadow-xl group">
            <img
              src="/images/hero.png"
              alt="Video thumbnail"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
              {/* <button
                onClick={() => setShowVideo(true)}
                aria-label="Play Video"
                className="bg-white/90 hover:bg-white p-4 rounded-full shadow-lg transition-all duration-200"
              >
                <svg
                  className="w-10 h-10 text-blue-700"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 bg-white py-16 px-4">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">People First</h3>
          <p className="text-gray-600">
            Putting the common people at the center of governance and policy-making.
          </p>
        </div>

        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <Target className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Anti-Corruption</h3>
          <p className="text-gray-600">
            Fighting corruption at every level with transparency and accountability.
          </p>
        </div>

        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Honest Politics</h3>
          <p className="text-gray-600">
            Practicing clean politics with integrity and genuine service to society.
          </p>
        </div>
      </div>

      {/* Modal Overlay */}
      {showVideo && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black">
            <iframe
              src="https://www.youtube.com/embed/xljY-LImr3E?si=_3hvz79FT_ArInEu&autoplay=1"
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="AAP Campaign Video"
            ></iframe>
            <button
              onClick={() => setShowVideo(false)}
              aria-label="Close Video"
              className="absolute top-2 right-2 bg-white rounded-full p-2 hover:bg-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
