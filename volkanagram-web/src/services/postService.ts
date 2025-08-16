import axios from "axios"
import {TApiResponse, TId} from "@/types/globals"
import {IPost, IPostComment, IPostLike} from "@/types/post"
import {API_CONFIG} from "@/config"

export const postService = {
  create: (data: object) =>
    axios.post<TApiResponse<IPost>>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POST.CREATE}`,
      data,
      { withCredentials: true }
    ),

  saveComment: (data: object) =>
    axios.post<TApiResponse<IPostComment>>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POST.SAVE_COMMENT}`,
      data,
      { withCredentials: true }
    ),

  like: (data: object) =>
    axios.post<TApiResponse<IPostLike>>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POST.LIKE}`,
      data,
      { withCredentials: true }
    ),

  unlike: (data: object) =>
    axios.post<TApiResponse<TId>>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POST.UNLIKE}`,
      data,
      { withCredentials: true }
    ),
}