import axios from "axios"
import {TApiResponse, TUploadedFile} from "@/types/globals"
import {API_CONFIG} from "@/config"

export const uploaderService = {
  upload: (folder: string, formData: FormData) =>
    axios.post<TApiResponse<TUploadedFile>>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPLOADER}?folder=${folder}`,
      formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    ),
}