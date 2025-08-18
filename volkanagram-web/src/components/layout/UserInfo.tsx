import React from 'react'
import Link from "next/link"
import Image from "next/image"
import {useUser} from "@/hooks/useUser"
import {useLogin} from "@/hooks/useLogin"
import {getUserImageUrl} from "@/utils/imageHelpers"
import Avatar from "@/components/ui/Avatar"

const UserInfo = () => {
  const {user} = useUser()
  const {logout} = useLogin()

  const doLogout = async (e: React.FormEvent) => {
    e.preventDefault()
    await logout()
  }

  return (
    <>
      {user?._id && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {user.profilePicture ? (
                <Image
                  src={getUserImageUrl(user.profilePicture)}
                  width={32}
                  height={32}
                  alt={user.username}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <Avatar string={user.fullName}/>
              )}
            </div>
            <div>
              <div className="font-semibold text-sm text-black">
                <Link href={`/${user.username}`}>
                  {user.username}
                </Link>
              </div>
              <div className="text-gray-500 text-sm">{user.fullName}</div>
            </div>
          </div>

          <button className="text-blue-500 text-sm font-semibold cursor-pointer" onClick={doLogout}>Logout</button>
        </div>
      )}
    </>
  )
}

export default UserInfo
