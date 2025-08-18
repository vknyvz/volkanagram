import {ImageIcon} from "lucide-react"
import React from "react"
import {NoPostsProps} from "@/types/props"

export default function NoPosts({className, message}: NoPostsProps) {
  return (
    <div className={`flex flex-col items-center justify-center px-4 ${className}`}>
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <ImageIcon className="w-8 h-8 text-gray-400"/>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
      <p className="text-gray-500 text-center max-w-sm">
        {message}
      </p>
    </div>
  )
}