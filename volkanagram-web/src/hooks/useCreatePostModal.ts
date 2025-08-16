import React, {useState} from 'react'
import {useRouter} from 'next/navigation'
import {useUser} from "@/hooks/useUser"

export const useCreatePostModal = () => {
  const user = useUser()
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const handleCreateClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault()

    if (user._id) {
      setIsModalOpen(true)
    } else {
      router.push('/login')
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  return {
    isModalOpen,
    handleCreateClick,
    handleCloseModal,
    openModal,
    user
  }
}