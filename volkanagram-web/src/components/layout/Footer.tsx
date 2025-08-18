import Link from "next/link"
import { useModal } from '@/contexts/ModalContext'

export default function Footer({isMobile}: {isMobile: boolean}) {
  const {openModal} = useModal()

  return (
    <div className="text-sm  text-gray-300 font-semibold space-y-2 pt-4">
      <div className={`flex flex-wrap gap-2 ${isMobile ? 'justify-center' : ''} `}>
        <Link
          href="#"
          className="cursor-pointer"
          onClick={() => openModal('about')}>
          <span>About</span>
        </Link>
      </div>
      <div className={`mt-4 ${isMobile ? 'text-center' : ''}`}>
        <span>{new Date().getFullYear()} volkanagram</span>
      </div>
    </div>
  )
}