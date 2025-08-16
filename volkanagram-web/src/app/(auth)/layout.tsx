import React from "react"

export default function AuthLayout({children}: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      {children}
    </main>
  )
}