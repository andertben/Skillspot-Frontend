import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('API returned 401 Unauthorized')
    }
    return Promise.reject(error)
  }
)

export function SetupAuthInterceptor() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    const setupInterceptor = async () => {
      try {
        api.interceptors.request.clear()
        api.interceptors.request.use(
          async (config) => {
            try {
              const token = await getAccessTokenSilently({
                authorizationParams: {
                  audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                },
              })
              config.headers.Authorization = `Bearer ${token}`
            } catch (error) {
              console.warn('Failed to get access token:', error)
            }
            return config
          },
          (error) => Promise.reject(error)
        )
      } catch (error) {
        console.warn('Failed to setup auth interceptor:', error)
      }
    }

    setupInterceptor()
  }, [isAuthenticated, getAccessTokenSilently])

  return null
}

export default api
