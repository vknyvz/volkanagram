import {Metadata} from "next"
import LoginForm from "@/app/(auth)/login/LoginForm"

export const metadata: Metadata = {
  title: 'Log in • volkanagram',
  description: 'Log in to volkanagram',
  keywords: ['volkanagram', 'login', 'volkan yavuz', 'instagram clone', 'instagram']
}

export default function LoginPage() {
  return <LoginForm/>
}
