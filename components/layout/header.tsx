import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"

export function Header() {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-blue-600">JCBP</span>
              <span className="text-sm text-gray-600 hidden sm:block">जन चेतना भारत पार्टी</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Home
            </Link>
            {/* <Link href="#leaders" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Leadership
            </Link> */}
            <Link href="#mission" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Our Vision
            </Link>
            <Link href="/join" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Join Us
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Button asChild variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent">
              <Link href="/join">Join JCBP</Link>
            </Button>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/leader/login">Leader Portal</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
