import FooterClient from "./clients/FooterClient"

export default function Footer({isMobile}: {isMobile: boolean}) {
  return (
    <div className="text-sm  text-gray-300 font-semibold space-y-2 pt-4">
      <div className={`flex flex-wrap gap-2 ${isMobile ? 'justify-center' : ''} `}>
        <FooterClient />
      </div>
      <div className={`mt-4 ${isMobile ? 'text-center' : ''}`}>
        <span>{new Date().getFullYear()} volkanagram</span>
      </div>
    </div>
  )
}