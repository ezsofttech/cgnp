"use client"

import { Suspense, useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { ChevronDown, Check, Languages, ArrowRight, ArrowLeft } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { usePartyStore } from "@/lib/stores/party-store"
import { useSearchParams } from "next/navigation"

// Constituency data
const constituencyData = {
  "state": "Chhattisgarh",
  "lokSabhaConstituencies": [
    "Bastar",
    "Bilaspur",
    "Durg",
    "Janjgir-Champa",
    "Kanker",
    "Korba",
    "Mahasamund",
    "Raigarh",
    "Raipur",
    "Rajnandgaon",
    "Sarguja"
  ],
  "vidhanSabhaConstituencies": [
    "Konta",
    "Bijapur",
    "Narayanpur",
    "Bastar",
    "Jagdalpur",
    "Chitrakot",
    "Dantewara",
    "Keshkal",
    "Kondagaon",
    "Kanker",
    "Antagarh",
    "Bhanupratappur",
    "Dongargarh",
    "Rajnandgaon",
    "Dongargaon",
    "Khairagarh",
    "Chhuikhadan",
    "Mohla-Manpur",
    "Pandaurna",
    "Khujji",
    "Mohgaon",
    "Kawardha",
    "Pandariya",
    "Mungeli",
    "Lormi",
    "Takhatpur",
    "Bilha",
    "Beltara",
    "Bilaspur",
    "Ratanpur",
    "Pathariya",
    "Masturi",
    "Akaltara",
    "Janjgir-Champa",
    "Champa",
    "Sakti",
    "Korba",
    "Katghora",
    "Rampur",
    "Pali-Tanakhar",
    "Marwahi",
    "Chirmiri",
    "Manendragarh",
    "Baikunthpur",
    "Premnagar",
    "Bhatgaon",
    "Pratappur",
    "Ramanujganj",
    "Samri",
    "Lundra",
    "Ambikapur",
    "Sitapur",
    "Kusmi",
    "Jashpur",
    "Kunkuri",
    "Pathalgaon",
    "Raigarh",
    "Sarangarh",
    "Kharsia",
    "Dharamjaigarh",
    "Raipur Rural",
    "Raipur City North",
    "Raipur City South",
    "Raipur City West",
    "Abhanpur",
    "Arang",
    "Tilda",
    "Bhatapara",
    "Baloda Bazar",
    "Kasdol",
    "Bilaigarh",
    "Mahasamund",
    "Saraipali",
    "Basna",
    "Khallari",
    "Dhamtari",
    "Kurud",
    "Sihawa",
    "Balod",
    "Gunderdehi",
    "Dondi Lohara",
    "Durg Rural",
    "Durg City",
    "Bhilai Nagar",
    "Vaishali Nagar",
    "Ahiwara",
    "Patan",
    "Rajnandgaon",
    "Dongargaon",
    "Khujji",
    "Kawardha"
  ]
}

// Language content
const content = {
  en: {
    title: "Member Registration",
    welcome: "Welcome to CG NP Party",
    steps: ["Personal Info", "Location", "Additional Info", "Confirmation"],
    memberType: "Member Type",
    memberOptions: ["Existing Member", "New Member"],
    personalDetails: "Personal Details",
    name: "Full Name",
    age: "Age",
    gender: "Gender",
    selectGender: "Select Gender",
    genderOptions: ["Male", "Female", "Other"],
    mobileNumber: "Mobile Number",
    whatsappSame: "This is the same as WhatsApp number",
    whatsappNumber: "WhatsApp Number",
    email: "Email Address",
    locationDetails: "Location Details",
    lokSabha: "Lok Sabha Constituency",
    vidhanSabha: "Vidhan Sabha Constituency",
    address: "Full Address",
    ward: "Ward Number",
    tehsil: "Tehsil",
    district: "District",
    additionalInfo: "Additional Information",
    additionalInfoPlaceholder: "Any other information you'd like to share...",
    register: "Complete Registration",
    selectOption: "Select Option",
    next: "Next",
    previous: "Previous",
    submit: "Submit",
    progress: "Step {current} of {total}",
    confirmationTitle: "Review Your Information",
    confirmationDescription: "Please review all the information before submitting.",
    referredBy: "Referred By",
    notProvided: "Not provided",
    thankYouTitle: "Thank You!",
    thankYouMessage: "Your registration has been successfully submitted.",
    validation: {
      required: "This field is required",
      mobileLength: "Mobile number must be exactly 10 digits",
      digitsOnly: "Only digits are allowed",
      whatsappLength: "WhatsApp number must be exactly 10 digits"
    }
  },
  hi: {
    title: "सदस्य पंजीकरण",
    welcome: "छत्तीसगढ़ न्यू पार्टी में आपका स्वागत है",
    steps: ["व्यक्तिगत जानकारी", "स्थान", "अतिरिक्त जानकारी", "पुष्टिकरण"],
    memberType: "सदस्य प्रकार",
    memberOptions: ["पुराने सदस्य", "नए सदस्य"],
    personalDetails: "व्यक्तिगत विवरण",
    name: "पूरा नाम",
    age: "उम्र",
    gender: "लिंग",
    selectGender: "लिंग चुनें",
    genderOptions: ["पुरुष", "महिला", "अन्य"],
    mobileNumber: "मोबाइल नंबर",
    whatsappSame: "यही WHATSAPP नंबर है",
    whatsappNumber: "WHATSAPP नंबर",
    email: "ईमेल पता",
    locationDetails: "स्थान विवरण",
    lokSabha: "लोकसभा निर्वाचन क्षेत्र",
    vidhanSabha: "विधानसभा निर्वाचन क्षेत्र",
    address: "पूरा पता",
    ward: "वार्ड नंबर",
    tehsil: "तहसील",
    district: "जिला",
    additionalInfo: "अतिरिक्त जानकारी",
    additionalInfoPlaceholder: "कोई अन्य जानकारी जो आप साझा करना चाहते हैं...",
    register: "पंजीकरण पूरा करें",
    selectOption: "विकल्प चुनें",
    next: "आगे",
    previous: "पीछे",
    submit: "जमा करें",
    progress: "चरण {current} / {total}",
    confirmationTitle: "अपनी जानकारी की समीक्षा करें",
    confirmationDescription: "सबमिट करने से पहले कृपया सभी जानकारी की समीक्षा करें।",
    referredBy: "रेफर किया गया",
    notProvided: "प्रदान नहीं किया गया",
    thankYouTitle: "धन्यवाद!",
    thankYouMessage: "आपका पंजीकरण सफलतापूर्वक जमा कर दिया गया है।",
    validation: {
      required: "यह फ़ील्ड आवश्यक है",
      mobileLength: "मोबाइल नंबर 10 अंकों का होना चाहिए",
      digitsOnly: "केवल अंकों की अनुमति है",
      whatsappLength: "WhatsApp नंबर 10 अंकों का होना चाहिए"
    }
  }
}

export function MemberRegistrationForm() {
  const searchParams = useSearchParams()
  const [language, setLanguage] = useState<"en" | "hi">("hi")
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const t = content[language]
  const { addMember, isLoading } = usePartyStore()
  
  // Add a ref for the form container to scroll to
  const formContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const refCode = params.get('ref')
      if (refCode) {
        setFormData(prev => ({
          ...prev,
          referredBy: refCode
        }))
      }
    }
  }, [])

  // Set default memberType to "New Member"
  const [formData, setFormData] = useState({
    memberType: "New Member", // Default to New Member
    name: "",
    age: "",
    gender: "",
    mobileNumber: "",
    isWhatsAppSame: false,
    whatsappNumber: "",
    email: "",
    lokSabha: "",
    vidhanSabha: "",
    address: "",
    ward: "",
    tehsil: "",
    district: "",
    additionalInfo: "",
    referredBy: ''
  })

  const submissionData = {
    ...formData,
    referredBy: formData.referredBy || undefined
  }

  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {}

    // Skip memberType validation since it's now defaulted

    if (currentStep === 0) { // Now step 0 is Personal Info
      if (!formData.name) newErrors.name = t.validation.required
      if (!formData.age) newErrors.age = t.validation.required
      if (!formData.gender) newErrors.gender = t.validation.required
      
      // Mobile number validation
      if (!formData.mobileNumber) {
        newErrors.mobileNumber = t.validation.required
      } else if (!/^\d+$/.test(formData.mobileNumber)) {
        newErrors.mobileNumber = t.validation.digitsOnly
      } else if (formData.mobileNumber.length !== 10) {
        newErrors.mobileNumber = t.validation.mobileLength
      }

      // WhatsApp number validation if different from mobile
      if (!formData.isWhatsAppSame && formData.whatsappNumber) {
        if (!/^\d+$/.test(formData.whatsappNumber)) {
          newErrors.whatsappNumber = t.validation.digitsOnly
        } else if (formData.whatsappNumber.length !== 10) {
          newErrors.whatsappNumber = t.validation.whatsappLength
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev}
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "hi" : "en")
  }

  // Function to scroll to top
  const scrollToTop = () => {
    if (formContainerRef.current) {
      formContainerRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // Fallback to window scroll
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  const nextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1)
        // Scroll to top after state update
        setTimeout(scrollToTop, 100)
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      // Scroll to top after state update
      setTimeout(scrollToTop, 100)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateCurrentStep()) {
      const result = await addMember(submissionData)
      if (result.success) {
        setIsSubmitted(true)
        // Scroll to top on successful submission
        setTimeout(scrollToTop, 100)
      }
    }
  }

  const steps = [
    // Step 0: Personal Info (formerly Step 1)
    <div key="personal-info" className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">{t.personalDetails}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">{t.name}</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.name && (
            <div className="text-red-500 text-sm">{errors.name}</div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">{t.age}</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
              errors.age ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.age && (
            <div className="text-red-500 text-sm">{errors.age}</div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">{t.gender}</label>
          <div className="relative">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                errors.gender ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            >
              <option value="">{t.selectGender}</option>
              {t.genderOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-4 h-4 w-4 text-gray-400" />
          </div>
          {errors.gender && (
            <div className="text-red-500 text-sm">{errors.gender}</div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">{t.mobileNumber}</label>
          <input
            type="number"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            maxLength={10}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
              errors.mobileNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.mobileNumber && (
            <div className="text-red-500 text-sm">{errors.mobileNumber}</div>
          )}
        </div>

        <div className="flex items-center space-x-3 md:col-span-2 p-3 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id="isWhatsAppSame"
            name="isWhatsAppSame"
            checked={formData.isWhatsAppSame}
            onChange={handleChange}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="isWhatsAppSame" className="text-sm font-medium text-gray-700">
            {t.whatsappSame}
          </label>
        </div>

        {!formData.isWhatsAppSame && (
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">{t.whatsappNumber}</label>
            <input
              type="tel"
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleChange}
              maxLength={10}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                errors.whatsappNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.whatsappNumber && (
              <div className="text-red-500 text-sm">{errors.whatsappNumber}</div>
            )}
          </div>
        )}

        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">{t.email}</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>
    </div>,

    // Step 1: Location (formerly Step 2)
    <div key="location" className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">{t.locationDetails}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">{t.lokSabha}</label>
          <div className="relative">
            <select
              name="lokSabha"
              value={formData.lokSabha}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="">{t.selectOption}</option>
              {constituencyData.lokSabhaConstituencies.map(constituency => (
                <option key={constituency} value={constituency}>{constituency}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-4 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">{t.vidhanSabha}</label>
          <div className="relative">
            <select
              name="vidhanSabha"
              value={formData.vidhanSabha}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="">{t.selectOption}</option>
              {constituencyData.vidhanSabhaConstituencies.map(constituency => (
                <option key={constituency} value={constituency}>{constituency}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-4 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">{t.address}</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">{t.ward}</label>
          <input
            type="text"
            name="ward"
            value={formData.ward}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">{t.tehsil}</label>
          <input
            type="text"
            name="tehsil"
            value={formData.tehsil}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">{t.district}</label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>
    </div>,

    // Step 2: Additional Info (formerly Step 3)
    <div key="additional-info" className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">{t.additionalInfo}</h2>
      <div className="space-y-4">
        <textarea
          name="additionalInfo"
          value={formData.additionalInfo}
          onChange={handleChange}
          rows={5}
          placeholder={t.additionalInfoPlaceholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-blue-800 text-sm">
            {language === "en" 
              ? "Thank you for your interest in joining Chhattisgarh New Party. Your information will help us serve you better."
              : "छत्तीसगढ़ न्यू पार्टी में शामिल होने में रुचि लेने के लिए धन्यवाद। आपकी जानकारी हमें आपको बेहतर सेवा प्रदान करने में मदद करेगी।"}
          </p>
        </div>
      </div>
    </div>,
    
    // Step 3: Confirmation (formerly Step 4)
    <div key="confirmation" className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">{t.confirmationTitle}</h2>
      <p className="text-gray-600">{t.confirmationDescription}</p>
      
      <div className="space-y-6">
        {/* Personal Details Section */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t.personalDetails}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">{t.memberType}</p>
              <p className="font-medium">{formData.memberType || t.notProvided}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.name}</p>
              <p className="font-medium">{formData.name || t.notProvided}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.age}</p>
              <p className="font-medium">{formData.age || t.notProvided}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.gender}</p>
              <p className="font-medium">{formData.gender || t.notProvided}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.mobileNumber}</p>
              <p className="font-medium">{formData.mobileNumber || t.notProvided}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.whatsappNumber}</p>
              <p className="font-medium">
                {formData.isWhatsAppSame 
                  ? (language === "en" ? "Same as mobile" : "मोबाइल के समान") 
                  : (formData.whatsappNumber || t.notProvided)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.email}</p>
              <p className="font-medium">{formData.email || t.notProvided}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.referredBy}</p>
              <p className="font-medium">{formData.referredBy || t.notProvided}</p>
            </div>
          </div>
        </div>

        {/* Location Details Section */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t.locationDetails}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">{t.lokSabha}</p>
              <p className="font-medium">{formData.lokSabha || t.notProvided}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.vidhanSabha}</p>
              <p className="font-medium">{formData.vidhanSabha || t.notProvided}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.address}</p>
              <p className="font-medium">{formData.address || t.notProvided}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.ward}</p>
              <p className="font-medium">{formData.ward || t.notProvided}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.tehsil}</p>
              <p className="font-medium">{formData.tehsil || t.notProvided}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.district}</p>
              <p className="font-medium">{formData.district || t.notProvided}</p>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        {formData.additionalInfo && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t.additionalInfo}</h3>
            <p className="whitespace-pre-line">{formData.additionalInfo}</p>
          </div>
        )}
      </div>
    </div>
  ]

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto p-4 md:p-6"
        ref={formContainerRef}
      >
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-8 text-center">
          <div className="mb-6">
            <Check className="h-16 w-16 text-green-500 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{t.thankYouTitle}</h1>
          <p className="text-gray-600 text-lg mb-6">{t.thankYouMessage}</p>
          <div className="bg-blue-50 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-blue-800">
             <a href="./">Home</a>
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto p-4 md:p-6"
      ref={formContainerRef}
    >
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header with Language Toggle */}
        <div className="p-4 md:p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-blue-100">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{t.title}</h1>
            <p className="text-gray-600">{t.welcome}</p>
          </div>
          <motion.button
            onClick={toggleLanguage}
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-full text-sm font-medium transition-colors shadow-sm"
          >
            <Languages className="h-4 w-4" />
            {language === "en" ? "हिंदी" : "English"}
          </motion.button>
        </div>

        {/* Progress Bar */}
        <div className="px-4 md:px-6 pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-500">
              {t.progress.replace("{current}", (currentStep + 1).toString()).replace("{total}", steps.length.toString())}
            </span>
            <span className="text-sm font-medium text-blue-600">{t.steps[currentStep]}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              className="bg-blue-600 h-2 rounded-full" 
              initial={{ width: "0%" }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="p-4 md:p-6">
          {steps[currentStep]}
        </div>

        {/* Navigation Buttons */}
        <div className="p-4 md:p-6 border-t border-gray-200 flex justify-between">
          {currentStep > 0 ? (
            <motion.button
              type="button"
              onClick={prevStep}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              {t.previous}
            </motion.button>
          ) : (
            <div></div>
          )}

          {currentStep < steps.length - 1 ? (
            <motion.button
              type="button"
              onClick={nextStep}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors ml-auto"
            >
              {t.next}
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          ) : (
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              className={`flex items-center gap-2 px-6 py-3 ${
                isLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
              } text-white font-medium rounded-lg transition-colors ml-auto`}
            >
              {isLoading ? (
                <span>{language === "en" ? "Submitting..." : "जमा किया जा रहा है..."}</span>
              ) : (
                <>
                  <Check className="h-5 w-5" />
                  {t.submit}
                </>
              )}
            </motion.button>
          )}
        </div>
      </form>
    </motion.div>
  )
}

export default function JoinPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Header/>
      <MemberRegistrationForm />
      <Footer/>
    </Suspense>
  )
}