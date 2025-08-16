import axios from "axios"
import {TApiResponse} from "@/types/globals"
import {API_CONFIG} from "@/config"
import {IUser, IUserProfile} from "@/types/user"

export const authService = {
  register: (data: object) =>
    axios.post<TApiResponse<IUserProfile>>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`,
      data
    ),

  me: () =>
    axios.get<TApiResponse<IUser>>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.ME}`, {
        withCredentials: true,
      }
    ),

  login: (data: object) =>
    axios.post<TApiResponse<IUserProfile>>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`,
      data, {
        withCredentials: true,
      }
    ),

  logout: (data: object) =>
    axios.post<TApiResponse<any>>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGOUT}`,
      data, {
        withCredentials: true,
      }
    ),
}