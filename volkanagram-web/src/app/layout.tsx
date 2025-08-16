import type {Metadata, Viewport} from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "@/styles/globals.css"
import StoreProvider from "@/providers/StoreProvider"
import AuthProvider from "@/providers/AuthProvider"
import ZoomPrevention from "@/components/ZoomPrevention"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "volkanagram",
  description: "An Instagram Clone built on Next.JS & Node/Express",
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  minimumScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  viewportFit: 'cover'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <AuthProvider>
            <ZoomPrevention />

            {children}
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
