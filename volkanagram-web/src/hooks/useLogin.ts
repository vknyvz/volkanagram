"use client"

import {useState} from 'react'
import {useDispatch} from 'react-redux'
import {clearUser, setUser} from '@/store/authSlice'
import {useRouter} from 'next/navigation'
import {handleApiError} from "@/utils/errorHandler"
import {authService} from "@/services/authService"

export function useLogin() {
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const dispatch = useDispatch()
  const router = useRouter()

  const login = async (identifier: string, password: string) => {
    setError('')
    setLoading(true)

    try {
      const res = await authService.login({
        email: identifier,
        password,
      })

      if (res.data.success) {
        dispatch(setUser(res.data.data))
        router.push(`/${res.data.data.username}`)
      } else {
        setError('Invalid credentials')
      }
    } catch (e: any) {
      setError(e.response?.data?.message || [{ message: 'Something went wrong' }])

      handleApiError(e)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      const res = await authService.logout({})

      if (res.data.success) {
        dispatch(clearUser())
        router.push(`/`)
      }
    } catch (e: unknown) {
      handleApiError(e)
    }
  }

  return { login, logout, loading, error }
}
