"use client"

import {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {setUser} from '@/store/authSlice'
import {handleApiError} from "@/utils/errorHandler"
import {authService} from "@/services/authService"

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await authService.me()

        if (res.data.success) {
          dispatch(setUser(res.data.data))
        }
      } catch (e: unknown) {
        handleApiError(e)
      }
    }

    void initAuth()
  }, [dispatch])

  return <>{children}</>
}