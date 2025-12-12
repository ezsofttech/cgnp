import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

 export const metadata: Metadata = {
  title: {
    default: 'Jan Bharat Chetna Party',
    template: '%s | Jan Bharat Chetna Party',
  },
  description: 'Official website of Jan Bharat Chetna Party – Voice of the Common People.',
  generator: 'v0.dev',
  applicationName: 'Jan Bharat Chetna Party',
  //metadataBase: new URL('https://aamjantaparty.com'), // Replace with your actual domain
  openGraph: {
    title: 'Jan Bharat Chetna Party',
    description: 'Join the movement that puts people first. Stay informed, get involved.',
   // url: 'https://aamjantaparty.com', // Replace with your actual domain
    siteName: 'Jan Bharat Chetna Party',
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
