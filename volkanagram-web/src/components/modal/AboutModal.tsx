import React, { useRef, useEffect } from 'react'
import {X, Camera, InstagramIcon, Instagram} from 'lucide-react'

interface AboutModalProps {
  onClose: () => void
}

const AboutModal = ({ onClose }: AboutModalProps) => {
  const modalContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (window.innerWidth >= 768 && modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black/45 md:flex md:items-center md:justify-center md:p-4 z-50 font-sans text-xs">
      <div
        ref={modalContentRef}
        className="w-full h-full md:w-full md:max-w-lg md:h-auto md:max-h-[80vh] md:rounded-sm md:shadow-2xl flex flex-col overflow-hidden bg-white"
      >
        <div className="border-b border-gray-200 p-2 flex items-center justify-between bg-white">
          <div className="w-10"></div>

          <h2 className="font-semibold text-gray-800 text-base">About</h2>

          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 p-2 -mr-2"
          >
            <X size={20} className="cursor-pointer"/>
          </button>
        </div>

        <div className="flex flex-col flex-grow bg-white overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto text-center">
            <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center">
              <Instagram size={55} className="text-black" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 font-satisfy-cursive mb-3">volkanagram</h3>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              An Instagram-inspired social media platform built with Next.js frontend and Node.js backend
            </p>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              👉 Source code is available at <br />
              <a className="border-b border-dotted border-black hover:border-gray-600" href="https://github.com/vknyvz/volkanagram" target="_blank" rel="noopener">
                https://github.com/vknyvz/volkanagram
              </a>
            </p>

            <div className="text-xs text-gray-400 border-t border-gray-100 pt-4">
              {new Date().getFullYear()} volkanagram
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutModal