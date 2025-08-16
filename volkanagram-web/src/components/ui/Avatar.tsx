import {IAvatarProps} from "@/types/props"

export default function Avatar(
  {
    string,
    className
  }:
  IAvatarProps) {

  if (!className) {
    className = 'text-xs font-medium text-gray-600 uppercase'
  }

  let initials = ''

  if (string) {
    const words = string.trim().split(/\s+/)
    const firstChar = words[0]?.[0]?.toUpperCase() ?? ''
    const lastWordFirstChar = words[words.length - 1]?.[0]?.toUpperCase() ?? ''
    initials = firstChar === lastWordFirstChar ? firstChar : `${firstChar}${lastWordFirstChar}`
  } else {
    initials = 'n/a'
  }

  return (
    <span className={className}>
      {initials}
    </span>
  )
}