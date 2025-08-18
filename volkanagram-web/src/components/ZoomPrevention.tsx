"use client"

import { useEffect } from 'react'

export default function ZoomPrevention() {
  useEffect(() => {
    const preventZoom = (e: Event) => {
      e.preventDefault()
    }

    document.addEventListener('gesturestart', preventZoom, { passive: false })
    document.addEventListener('gesturechange', preventZoom, { passive: false })
    document.addEventListener('gestureend', preventZoom, { passive: false })

    let lastTouchEnd = 0
    const preventDoubleTapZoom = (e: TouchEvent) => {
      const now = Date.now()
      if (now - lastTouchEnd <= 300) {
        e.preventDefault()
      }
      lastTouchEnd = now
    }

    document.addEventListener('touchend', preventDoubleTapZoom, { passive: false })

    const preventWheelZoom = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault()
      }
    }

    document.addEventListener('wheel', preventWheelZoom, { passive: false })

    return () => {
      document.removeEventListener('gesturestart', preventZoom)
      document.removeEventListener('gesturechange', preventZoom)
      document.removeEventListener('gestureend', preventZoom)
      document.removeEventListener('touchend', preventDoubleTapZoom)
      document.removeEventListener('wheel', preventWheelZoom)
    }
  }, [])

  return null
}