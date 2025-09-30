"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Playfair_Display, Poppins } from 'next/font/google'

// Load stylish Google Fonts
const headingFont = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-heading'
})

const bodyFont = Poppins({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body'
})

export function PartyLeadersSection() {
  const leaders = [
    {
      name: "Arvind Kejriwal",
      role: "National Convener",
      bio: "Former Indian Revenue Service officer. Founder of AAP and current Chief Minister of Delhi.",
      image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTQt3tBal2ASUr2_b1QmaYeGVKyxe2nunfiqSYfrb2X7dfLeV59"
    },
    {
      name: "Manish Sisodia",
      role: "Deputy Chief Minister",
      bio: "Architect of Delhi's education reform. Oversees education, finance and planning departments.",
      image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQw_OvbwUXh4SP8EyjibJ153DKa934jR44MwtC7-edF_JxGyVdt8yPLbnaaU5_BEzBUz5IBwGlmlMiOKk6teMxbljcYWNaztKL8JSRP_Ec"
    },
    {
      name: "Atishi Marlena",
      role: "Education Minister",
      bio: "Oxford-educated policymaker. Instrumental in transforming Delhi government schools.",
      image: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQwg6A3ULRQ5PXDlUaL58gYWqxA6Zgu0fgxBbNv6sJBb-3qA5bk1sa8Nwlo93WIWQSjXwEugFURN16KsXnEX8zXJQ"
    },
    {
      name: "Gopal Rai",
      role: "Environment Minister",
      bio: "Handles Environment, Labour and Development departments in Delhi government.",
      image: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTD2FNwXiSEsTxq9_6hASsMlVgNhddPaAdVVnYYmi0CmRxyepr3"
    },
    {
      name: "Saurabh Bhardwaj",
      role: "Health Minister",
      bio: "Oversees Delhi's health infrastructure and public health initiatives.",
      image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRANgiNr5tgxY4BDDPeVnmh0ml6Vqwfgqc0H7WP7RNndDYgUF9ncWVJTC3wUjp-iy_kC0QJes5hexjcbitBAF55Lw"
    },
    {
      name: "Raghav Chadha",
      role: "MP & Spokesperson",
      bio: "Youngest member of Rajya Sabha. AAP's national spokesperson and treasurer.",
      image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSoI1qmpo8JT8vw1P5z0VfexLp8XfPr2d1JEYBVT6WVPQJvYSQB1quHQSg2PDlCeyLPBA04Hgd_xd_uXfwOsBedVA"
    }
  ]

  return (
    <section className={`py-20 bg-gradient-to-b from-gray-50 to-white ${bodyFont.variable} ${headingFont.variable}`}>
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          className="mb-20 text-center"
        >
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-blue-600 uppercase rounded-full bg-blue-50 mb-4">
            Leadership
          </span>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 font-sans leading-tight">
            Visionary <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Leaders</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
            The driving force behind our mission for transformative governance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {leaders.map((leader, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 25,
                delay: index * 0.1,
                duration: 0.6
              }}
              viewport={{ once: true, margin: "0px 0px -50px 0px" }}
              className="group relative bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden hover:shadow-[0_15px_40px_rgb(0,0,0,0.1)] transition-all duration-500"
            >
              <div className="relative h-72 w-full overflow-hidden">
                <Image
                  src={leader.image}
                  alt={leader.name}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:filter-none filter grayscale contrast-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index < 3}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent" />
              </div>
              
              <div className="p-6 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium text-blue-600 tracking-wider uppercase">
                      {leader.role}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 font-sans tracking-tight">
                    {leader.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-5 leading-relaxed font-sans">
                    {leader.bio}
                  </p>
                </motion.div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd"></path>
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}