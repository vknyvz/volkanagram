import axios from "axios"
import {API_CONFIG} from '@/config'
import {TApiResponse} from "@/types/globals"
import {IFeed} from "@/types/post"
import {IUserProfile} from "@/types/user"

export const feedService = {
  getFeed: (page: number, limit: number) =>
    axios.post<TApiResponse<IFeed>>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FEED}`,
      { page, limit },
      { withCredentials: true }
    ),

  getStories: () =>
    axios.get<TApiResponse<IUserProfile[]>>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STORIES}`)
}