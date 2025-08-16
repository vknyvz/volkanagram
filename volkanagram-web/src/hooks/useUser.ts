import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import {IUser} from "@/types/user"

export const useUser = (): IUser => {
  const user = useSelector((state: RootState) => state.auth.user)

  if (!user) {
    return {} as IUser
  }

  return user
}