import React from "react"
import {TButtonProps} from "@/types/props"

export default function Button({className, ...props}: TButtonProps) {
  return (
    <button
      {...props}
      className={`w-full bg-blue-600 hover:bg-blue-700 transition py-2 cursor-pointer rounded text-sm font-semibold ${className}`}
    >
      {props.children}
    </button>
  )
}