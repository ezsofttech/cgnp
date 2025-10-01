import Link from "next/link"
import { Zap, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-lg font-bold">CG NP</div>
                <div className="text-sm text-blue-200">Chhattisgarh New Party</div>
              </div>
            </div>
            <p className="text-blue-100 text-sm">
              Our mission is to eradicate corruption and build a government that is truly of the people, by the people, and for the people.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-white">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link href="/" className="block text-blue-200 hover:text-white transition-colors">
                Home
              </Link>
              {/* <Link href="#leaders" className="block text-blue-200 hover:text-white transition-colors">
                Leadership
              </Link> */}
              <Link href="#mission" className="block text-blue-200 hover:text-white transition-colors">
                Our Vision
              </Link>
              <Link href="/join" className="block text-blue-200 hover:text-white transition-colors">
                Join Us
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-white">Contact</h3>
            <div className="space-y-2 text-sm text-blue-200">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@cgnp.org</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+91 11 4143 4143</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Bilaspur Chhattisgarh</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-white">Get Involved</h3>
            <div className="space-y-2 text-sm">
              <Link href="#" className="block text-blue-200 hover:text-white transition-colors">
                Volunteer
              </Link>
              <Link href="#" className="block text-blue-200 hover:text-white transition-colors">
                Donate
              </Link>
              <Link href="#" className="block text-blue-200 hover:text-white transition-colors">
                Events
              </Link>
              <Link href="/leader/login" className="block text-blue-200 hover:text-white transition-colors">
                Leader Portal
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-sm text-blue-200">
          <p>&copy; {new Date().getFullYear()} Chhattisgaarh New Party. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
