import { useSelector } from 'react-redux'
import { RootState } from '@/store'

export const useLoading = () => {
  return useSelector((state: RootState) => state.loading.isLoading)
}