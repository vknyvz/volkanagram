'use client'

import {createContext, useContext} from 'react'
import {ModalContextType} from "@/types/globals"

export const ModalContext = createContext<ModalContextType>({
  modals: {},
  openModal: () => {},
  closeModal: () => {},
  isModalOpen: () => false
})

export const useModal = () => {
  const context = useContext(ModalContext)

  if (!context) {
    throw new Error('useModal must be used within a ModalProvider')
  }

  return context
}



