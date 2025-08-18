'use client'

export default function AuthFooter() {
  const rightNowYear = new Date().getFullYear()

  return (
    <div className="mt-10 text-sm text-zinc-500 text-center">
      <select className="bg-transparent border border-zinc-700 rounded px-2 py-1 cursor-not-allowed" disabled={true}>
        <option>English</option>
        <option>Turkish</option>
      </select>

      <div className="mt-2 text-xs">&copy; {rightNowYear} volkanagram</div>
    </div>
  )
}
