import axios from "axios"
import {TApiResponse, TProfileResponse} from "@/types/globals"
import {API_CONFIG} from "@/config"
import {IUserProfile} from "@/types/user"

export const profileService = {
  getProfile: (username: string) =>
    axios.get<TApiResponse<TProfileResponse>>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROFILE.GET}/${username}`,
      { withCredentials: true }),

  getUserData: (data: object) =>
    axios.post<TApiResponse<IUserProfile>>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER.GET}`,
      data,
      { withCredentials: true }
    ),

  follow: (username: string) =>
    axios.post<TApiResponse<IUserProfile>>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROFILE.FOLLOW.replace(':username', username)}`,
      {},
      { withCredentials: true }
    ),

  unfollow: (username: string) =>
    axios.post<TApiResponse<IUserProfile>>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROFILE.UNFOLLOW.replace(':username', username)}`,
      {},
      { withCredentials: true }
    ),

  saveProfile: (data: object) =>
    axios.post<TApiResponse<IUserProfile>>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER.SAVE}`,
      data,
      { withCredentials: true }
    ),
}