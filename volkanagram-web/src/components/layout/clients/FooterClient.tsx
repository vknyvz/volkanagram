"use client"

import {useModal} from "@/contexts/ModalContext"

export default function FooterClient() {
  const {openModal} = useModal()

  return (
    <button
      onClick={() => openModal("about")}
      className="cursor-pointer"
    >
      About
    </button>
  )
}