import React from "react"

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export default function Input({className, ...props}: InputProps) {
  return (
    <input
      {...props}
      className={`w-full bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
    />
  )
}