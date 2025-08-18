"use client"

import React from 'react'
import {Home, PlusSquare, User2} from 'lucide-react'
import Link from 'next/link'
import {useCreatePostModal} from "@/hooks/useCreatePostModal"
import CreatePostModal from "@/components/modal/CreatePostModal"

const MobileNav = () => {
  const { isModalOpen, handleCreateClick, handleCloseModal, user } = useCreatePostModal()

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-2 z-30 flex justify-around items-center sm:hidden">
      <Link
        href="/" className="p-2">
        <Home size={28} className="text-black" />
      </Link>
      <Link
        href={user ? '#' : '/login'}
        onClick={handleCreateClick}>
        <PlusSquare size={28} className="text-black" />
      </Link>

      {isModalOpen && <CreatePostModal onClose={handleCloseModal} />}

      <Link
        href={user ? '/' + user.username : '/login'} className="p-2">
        <User2 className="w-8 h-8 lg:w-6 lg:h-6 lg:mr-3" />
      </Link>
    </div>
  )
}

export default MobileNav
