import React from 'react'
import Image from "next/image"
import {Home, Instagram, PlusSquare, User2} from 'lucide-react'
import Link from "next/link"
import CreatePostModal from "@/components/modal/CreatePost"
import {useCreatePostModal} from "@/hooks/useCreatePostModal"

const Nav = () => {
  const { isModalOpen, handleCreateClick, handleCloseModal, user } = useCreatePostModal()

  return (
    <div className="fixed top-0 left-0 h-full p-4 border-r border-gray-200 z-20 bg-white w-20 lg:w-[200px] hidden sm:block">
      <div className="flex items-center mb-8">
        <h1 className="text-2xl font-bold hidden lg:block">
          <Link href="/">
            <Image
              src="/img/volkanagram-black.png"
              alt="Volkanagram"
              width={150}
              height={150}
              className="pl-3"
            />
          </Link>
        </h1>
        <div className="lg:hidden">
          <Link
            href="/"
            className="flex items-center justify-center w-13 h-13 px-3 py-2 rounded-xl hover:bg-gray-100"
          >
            <Instagram className="w-7 h-7" />
          </Link>
        </div>
      </div>

      <nav className="flex flex-col space-y-4">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start w-13 h-13 lg:w-full px-3 py-2 rounded-xl hover:bg-gray-100 group"
        >
          <Home className="w-8 h-8 lg:w-6 lg:h-6 lg:mr-3" />
          <span className="hidden lg:inline text-base text-black">Home</span>
        </Link>

        <Link
          href={user._id ? '#' : '/login'}
          onClick={handleCreateClick}
          className="flex items-center justify-center lg:justify-start w-13 h-13 lg:w-full px-3 py-2 rounded-xl hover:bg-gray-100 group"
        >
          <PlusSquare className="w-8 h-8 lg:w-6 lg:h-6 lg:mr-3" />
          <span className="hidden lg:inline text-base text-black">Create</span>
        </Link>

        {isModalOpen && <CreatePostModal onClose={handleCloseModal} />}

        <Link
          href={user._id ? '/' + user.username : '/login'}
          className="flex items-center justify-center lg:justify-start w-13 h-13 lg:w-full px-3 py-2 rounded-xl hover:bg-gray-100 group"
        >
          <User2 className="w-8 h-8 lg:w-6 lg:h-6 lg:mr-3" />
          <span className="hidden lg:inline text-base text-black">Profile</span>
        </Link>
      </nav>
    </div>
  )
}

export default Nav
