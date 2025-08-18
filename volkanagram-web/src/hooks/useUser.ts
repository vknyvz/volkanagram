"use client"

import {useSelector} from 'react-redux'
import {RootState} from '@/store'
import {useRouter} from "next/navigation"
import {IUser} from "@/types/user"

export const useUser = () => {
  const router = useRouter()
  const user = useSelector((state: RootState) => state.auth.user)

  const withAuth = (fn: (...args: any[]) => void | Promise<void>) => {
    return (...args: any[]) => {
      if (!user) {
        router.push('/login')
        return
      }
      return fn(...args)
    }
  }

  const authenticated = (): IUser => {
    if (!user) {
      throw new Error('authenticated() can only be used in components behind login wall')
    }
    return user
  }

  return {user, withAuth, authenticated}
}