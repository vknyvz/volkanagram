import React from 'react'
import {Check} from 'lucide-react'
import {ILoaderProps} from "@/types/props"

const Loader = ({
    stage = 'loading',
    size = 48,
    fullScreen = false,
    message
  }: ILoaderProps) => {
  const LoadingSpinner = () => (
    <div className="relative" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-red-500 via-pink-500 to-purple-600 p-1">
        <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
          {stage === 'loading' && (
            <div className="absolute inset-0 rounded-full">
              <div className="absolute inset-0 rounded-full animate-spin" style={{
                background: `conic-gradient(from 0deg, #FBBF24, #F59E0B, #EF4444, #EC4899, #8B5CF6, #FBBF24)`,
                mask: `conic-gradient(from 0deg, transparent 0deg, transparent 45deg, black 45deg, black 360deg)`,
                WebkitMask: `conic-gradient(from 0deg, transparent 0deg, transparent 45deg, black 45deg, black 360deg)`,
                animationDuration: '0.6s'
              }}></div>
              <div className="absolute inset-1 bg-white rounded-full"></div>
            </div>
          )}

          {(stage === 'checkmark' || stage === 'complete') && (
            <div className="relative">
              <svg className="absolute w-0 h-0">
                <defs>
                  <linearGradient id="checkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FBBF24" />
                    <stop offset="25%" stopColor="#F59E0B" />
                    <stop offset="50%" stopColor="#EF4444" />
                    <stop offset="75%" stopColor="#EC4899" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>

              <Check
                size={size * 0.5} // Make check size proportional
                stroke="url(#checkGradient)"
                strokeWidth={3}
                style={{
                  strokeDasharray: '60',
                  strokeDashoffset: stage === 'checkmark' ? '0' : '0',
                  animation: stage === 'checkmark' ? 'drawCheckmark 3.5s ease-out infinite' : 'none'
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="bg-white rounded-lg p-8">
          <div className="flex flex-col items-center space-y-6">
            <LoadingSpinner />

            {stage === 'complete' && (
              <div className="text-center">
                <p className="text-gray-900 font-semibold text-lg">
                  {message}
                </p>
              </div>
            )}
          </div>
        </div>

        <style jsx>{`
          @keyframes drawCheckmark {
            0% {
              stroke-dashoffset: 60;
            }
            50% {
              stroke-dashoffset: 0;
            }
            100% {
              stroke-dashoffset: 60;
            }
          }
        `}</style>
      </div>
    )
  }

  return (
    <>
      <LoadingSpinner />

      <style jsx>{`
        @keyframes drawCheckmark {
          0% {
            stroke-dashoffset: 60;
          }
          50% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: 60;
          }
        }
      `}</style>
    </>
  )
}

export default Loader