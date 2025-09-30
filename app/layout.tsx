import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

 export const metadata: Metadata = {
  title: {
    default: 'Chhattisgarh New Party',
    template: '%s | Chhattisgarh New Party',
  },
  description: 'Official website of Chhattisgarh New Party – Voice of the Common People.',
  generator: 'v0.dev',
  applicationName: 'Chhattisgarh New Party',
  metadataBase: new URL('https://aamjantaparty.com'), // Replace with your actual domain
  openGraph: {
    title: 'Chhattisgarh New Party',
    description: 'Join the movement that puts people first. Stay informed, get involved.',
    url: 'https://aamjantaparty.com', // Replace with your actual domain
    siteName: 'Chhattisgarh New Party',
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className={GeistSans.className}>
        {children}
      </body>
    </html>
  )
}
