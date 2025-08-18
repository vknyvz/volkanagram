"use client"

import { useState } from 'react'
import {useRouter} from "next/navigation"
import {handleApiError} from "@/utils/errorHandler"
import {authService} from "@/services/authService"

export function useRegister() {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<boolean>(false)
  const router = useRouter()

  const register = async (formData: {
    email: string
    password: string
    fullName: string
    username: string
  }) => {
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const res = await authService.register(formData)

      if (res.data.success) {
        setSuccess(true)

        setTimeout(() => {
          router.push('/login')
        }, 2000)
      }
    } catch (e: any) {
      setError(e.response?.data?.message || 'Something went wrong')

      handleApiError(e)
    } finally {
      setLoading(false)
    }
  }

  return { register, loading, error, success }
}
