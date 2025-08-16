import React from "react"

export default function Footer({isMobile}: {isMobile: boolean}) {
  return (
    <div className="text-xs text-gray-400 space-y-2">
      <div className={`flex flex-wrap gap-2 ${isMobile ? 'justify-center' : ''} `}>
        <span>About</span>
      </div>
      <div className={`mt-4 ${isMobile ? 'text-center' : ''}`}>
        <span>© 2025 volkanagram</span>
      </div>
    </div>
  )
}