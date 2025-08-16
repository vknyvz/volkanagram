import RegisterForm from './RegisterForm'
import {Metadata} from "next"

export const metadata: Metadata = {
  title: 'Register • volkanagram',
  description: 'Create your volkanagram account',
  keywords: ['volkanagram', 'register', 'volkan yavuz', 'instagram clone'],
}

export default function RegisterPage() {
  return <RegisterForm />
}
