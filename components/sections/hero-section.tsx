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
<div className="container mx-auto px-4 py-2 md:py-16 relative z-10">
  <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
    
    {/* Left: Text */}
    <div className="flex-1 w-full text-center lg:text-left space-y-6">
      <div className="flex justify-center lg:justify-start">
        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
          <Zap className="h-12 w-12 text-white" />
        </div>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
        <span className="text-blue-700">Jan Chetna</span> <span>Bharat Party</span>

        <span className="block text-blue-700 mt-5">
          जन चेतना <span className="text-black">भारत पार्टी</span>
        </span>

        <span className="block text-3xl md:text-4xl text-blue-700 mt-4">
          न्यायपूर्ण राजनीति, जवाबदेह सरकार
        </span>
      </h1>

      <p className="text-lg text-gray-700 max-w-xl mx-auto lg:mx-0">
    भारत के भ्रष्टाचार के खिलाफ लड़ाई में शामिल हों।
मिलकर हम ऐसी पारदर्शी शासन व्यवस्था बना रहे हैं जो आम जनता की सेवा करे और हर स्तर पर जवाबदेही सुनिश्चित करे।
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mt-6">
        <Button asChild size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700">
          <Link href="/join">
              पार्टी से जुड़े !
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>

    {/* Right: Image */}
    <div className="flex-1 relative rounded-xl overflow-hidden group">
      <img
        src="/images/hero2.png"
        alt="Video thumbnail"
        className="w-full h-full object-cover bg-transparent"
      />
    </div>
  </div>
</div>

    </section>
  )
}
