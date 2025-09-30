"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePartyStore } from "@/lib/stores/party-store"
import { CheckCircle, Target, Heart, Lightbulb, Shield, Users, Calendar } from "lucide-react"

export function MissionSection() {
  const { partyInfo, fetchPartyInfo } = usePartyStore()

  useEffect(() => {
    fetchPartyInfo()
  }, [fetchPartyInfo])

  if (!partyInfo) {
    return (
      <section id="mission" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600">Loading party information...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="mission" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Vision & Mission</h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">{partyInfo.mission}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-2xl text-gray-900">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <span>Our Core Values</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {partyInfo.values?.map((value, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-white/50">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-gray-50 to-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-2xl text-gray-900">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <span>Our Key Goals</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {partyInfo.goals?.map((goal, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-white/50">
                  <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{goal}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 shadow-2xl text-white">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold">{partyInfo.name}</h3>
            <p className="text-blue-100 text-lg leading-relaxed">{partyInfo.description}</p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Founded in {partyInfo.foundedYear}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Serving the Nation</span>
              </div>
            </div>
          </div>
        </div> */}


        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 shadow-2xl text-white">
  <div className="max-w-4xl mx-auto text-center space-y-6">
    {/* Icon */}
    <div className="flex justify-center">
      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
        <Shield className="h-8 w-8 text-white" />
      </div>
    </div>

    {/* Party Name & Description */}
    <h3 className="text-2xl md:text-3xl font-bold">{partyInfo.name}</h3>
    <p className="text-blue-100 text-lg leading-relaxed">{partyInfo.description}</p>

    {/* Join Us Button */}
    <div className="mt-6">
      <a
        href="/join"
        className="inline-block px-8 py-3 bg-white text-blue-700 font-semibold rounded-full shadow-lg hover:bg-blue-50 transition transform hover:scale-105"
      >
        Join Us
      </a>
    </div>
  </div>
</div>


        
      </div>
    </section>
  )
}
