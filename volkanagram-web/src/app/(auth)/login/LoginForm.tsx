"use client"

import Image from "next/image"
import Link from "next/link"
import AuthFooter from "@/components/layout/AuthFooter"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import React, {useState} from 'react'
import {useLogin} from "@/hooks/useLogin"

export default function LoginForm() {
  const [formData, setFormData] = useState({ identifier: '', password: '' })
  const {login, error, loading} = useLogin()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(formData.identifier, formData.password)
  }

  return (
    <>
      <div className="w-full max-w-sm space-y-6 px-6">
        <Image
          src="/img/volkanagram-white.png"
          width={500}
          height={500}
          alt="Volkanagram Logo"
          className="mx-auto"/>

        {error && (
          <ul className="text-red-400 text-sm space-y-1">
            <li>
              {error}
            </li>
          </ul>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </Button>
        </form>

        <div className="text-center text-sm text-zinc-400">
          Don&#39;t have an account? {" "}
          <Link href="/register" className="text-blue-400 hover:underline">Sign up</Link>
        </div>
      </div>

      <AuthFooter />
    </>
  )
}
