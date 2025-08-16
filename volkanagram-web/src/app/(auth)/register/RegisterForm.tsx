"use client"

import Input from "@/components/ui/Input"
import AuthFooter from "@/components/layout/AuthFooter"
import Image from "next/image"
import Link from "next/link"
import Button from "@/components/ui/Button"
import {useRegister} from "@/hooks/useRegister"
import React, {useState} from "react"

export default function RegisterForm() {
  const { register, loading, error, success } = useRegister()
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    username: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await register(form)
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <ul className="text-red-400 text-sm space-y-1">
              <li>
                {error}
              </li>
            </ul>
          )}

          {success && <p className="text-green-500 text-sm">Registration successful!</p>}

          <div className="space-y-1">
            <Input type="email" name="email" placeholder="Email" required onChange={handleChange}/>
          </div>

          <div className="space-y-1">
            <Input type="password" name="password" placeholder="Password" required onChange={handleChange}/>
            <p className="text-xs text-stone-400 pl-1">
              Min 6 characters, only letters, numbers, and ()?^*&
            </p>
          </div>

          <div className="space-y-1">
            <Input type="text" name="fullName" placeholder="Full Name" required onChange={handleChange}/>
            <p className="text-xs text-stone-400 pl-1">
              Min 3 characters, letters only
            </p>
          </div>

          <div className="space-y-1">
            <Input type="text" name="username" placeholder="Username" required onChange={handleChange}/>
            <p className="text-xs text-stone-400 pl-1">
              Min 3 characters, letters and numbers only
            </p>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Sign Up"}
          </Button>
        </form>

        <div className="text-center text-sm text-zinc-400">
          Have an account? {" "}
          <Link href="/login" className="text-blue-400 hover:underline">Log in</Link>
        </div>
      </div>

      <AuthFooter/>
    </>
  )
}
