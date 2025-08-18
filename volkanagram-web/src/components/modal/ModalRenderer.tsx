"use client"

import {useModal} from '@/contexts/ModalContext'
import AboutModal from '@/components/modal/AboutModal'
import {ModalRendererProps} from "@/types/props"

const ModalRenderer = ({}: ModalRendererProps) => {
  const {isModalOpen, closeModal} = useModal()

  return (
    <>
      {isModalOpen('about') && (
        <AboutModal onClose={() => closeModal('about')} />
      )}
    </>
  )
}

export default ModalRenderer