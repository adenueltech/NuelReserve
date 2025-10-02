import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NuelReserve - Professional Service Booking Platform',
  description: 'Connect with trusted service providers, book appointments in real-time, and grow your business with confidence. Professional service booking made simple.',
  keywords: 'service booking, appointment scheduling, professional services, business growth, real-time booking, trusted providers',
  authors: [{ name: 'NuelReserve Team' }],
  creator: 'NuelReserve',
  publisher: 'NuelReserve',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://nuel-reserve.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'NuelReserve - Professional Service Booking Platform',
    description: 'Connect with trusted service providers, book appointments in real-time, and grow your business with confidence.',
    url: 'https://nuel-reserve.vercel.app',
    siteName: 'NuelReserve',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NuelReserve - Professional Service Booking Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NuelReserve - Professional Service Booking Platform',
    description: 'Connect with trusted service providers, book appointments in real-time, and grow your business with confidence.',
    images: ['/og-image.png'],
    creator: '@nuelreserve',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "NuelReserve",
    "description": "Professional service booking platform connecting customers with trusted service providers",
    "url": "https://nuel-reserve.vercel.app",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "NuelReserve"
    },
    "potentialAction": {
      "@type": "UseAction",
      "target": "https://nuel-reserve.vercel.app/get-started",
      "description": "Get started with NuelReserve"
    }
  }

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#0ea5e9" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//rxwofpggblausdfziwhx.supabase.co" />
        <link rel="dns-prefetch" href="//vitals.vercel-analytics.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
