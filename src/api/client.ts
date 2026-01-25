import axios from 'axios'
import type { AxiosInstance } from 'axios'
import i18n from '@/i18n/i18n'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const ENABLE_API_DEBUG = import.meta.env.DEV

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const lang = i18n.language || 'de'
  config.headers['Accept-Language'] = lang
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url

    if (status === 401) {
      if (ENABLE_API_DEBUG) {
        console.warn(`[API] 401 Unauthorized from ${url}`)
      }
    } else if (status === 403) {
      if (ENABLE_API_DEBUG) {
        console.warn(`[API] 403 Forbidden from ${url}`)
      }
    }

    return Promise.reject(error)
  }
)

export default api
