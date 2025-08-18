"use client"

import {ModalContext} from "@/contexts/ModalContext"
import {useState} from "react"
import {ModalProviderProps} from "@/types/props"
import {ModalState} from "@/types/globals";

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modals, setModals] = useState<ModalState>({})

  const openModal = (modalId: string) => {
    setModals(prev => ({ ...prev, [modalId]: true }))
  }

  const closeModal = (modalId: string) => {
    setModals(prev => ({ ...prev, [modalId]: false }))
  }

  const isModalOpen = (modalId: string) => {
    return modals[modalId] || false
  }

  return (
    <ModalContext.Provider value={{ modals, openModal, closeModal, isModalOpen }}>
      {children}
    </ModalContext.Provider>
  )
}