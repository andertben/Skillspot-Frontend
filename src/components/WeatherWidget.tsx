import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useUserLocation } from '@/hooks/useUserLocation'
import { 
  Cloud, 
  CloudDrizzle, 
  CloudFog, 
  CloudLightning, 
  CloudRain, 
  CloudSnow, 
  Sun, 
  CloudSun 
} from 'lucide-react'

interface DailyWeather {
  time: string[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  precipitation_sum: number[]
  weathercode: number[]
}

interface WeatherData {
  daily: DailyWeather
}

const weatherIconMap: Record<number, ReactNode> = {
  0: <Sun className="w-6 h-6 text-yellow-500" />,
  1: <CloudSun className="w-6 h-6 text-yellow-400" />,
  2: <CloudSun className="w-6 h-6 text-gray-400" />,
  3: <Cloud className="w-6 h-6 text-gray-500" />,
  45: <CloudFog className="w-6 h-6 text-gray-400" />,
  48: <CloudFog className="w-6 h-6 text-gray-400" />,
  51: <CloudDrizzle className="w-6 h-6 text-blue-300" />,
  53: <CloudDrizzle className="w-6 h-6 text-blue-400" />,
  55: <CloudDrizzle className="w-6 h-6 text-blue-500" />,
  61: <CloudRain className="w-6 h-6 text-blue-400" />,
  63: <CloudRain className="w-6 h-6 text-blue-500" />,
  65: <CloudRain className="w-6 h-6 text-blue-600" />,
  71: <CloudSnow className="w-6 h-6 text-blue-100" />,
  73: <CloudSnow className="w-6 h-6 text-blue-200" />,
  75: <CloudSnow className="w-6 h-6 text-blue-300" />,
  80: <CloudRain className="w-6 h-6 text-blue-400" />,
  81: <CloudRain className="w-6 h-6 text-blue-500" />,
  82: <CloudRain className="w-6 h-6 text-blue-600" />,
  95: <CloudLightning className="w-6 h-6 text-purple-500" />,
  96: <CloudLightning className="w-6 h-6 text-purple-600" />,
  99: <CloudLightning className="w-6 h-6 text-purple-700" />,
}

function getWeatherIcon(code: number) {
  return weatherIconMap[code] || <CloudSun className="w-6 h-6 text-gray-400" />
}

export function WeatherWidget() {
  const { t } = useTranslation()
  const { location, loading: locLoading, error: locError } = useUserLocation()
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!location) return

    const fetchWeather = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&forecast_days=14&timezone=auto`
        )
        if (!response.ok) throw new Error(t('weather.loadingError'))
        const data = await response.json()
        setWeatherData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : t('common.error'))
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [location, t])

  if (locLoading) return <div className="py-4 text-center text-muted-foreground">{t('weather.locating')}</div>
  if (locError) return <div className="py-4 text-center text-destructive">{t('weather.locationUnavailable', { error: locError })}</div>
  if (!location) return <div className="py-4 text-center text-muted-foreground">{t('weather.locationRequired')}</div>

  if (loading) return <div className="py-4 text-center text-muted-foreground">{t('weather.loading')}</div>
  if (error) return <div className="py-4 text-center text-destructive">{error}</div>
  if (!weatherData) return null

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="px-4 py-4">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          {t('weather.title')}
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {weatherData.daily.time.map((time, i) => (
            <div 
              key={time} 
              className="flex-shrink-0 flex flex-col items-center p-2 bg-accent/30 rounded-lg min-w-[80px]"
            >
              <span className="text-[10px] font-medium text-muted-foreground mb-1">
                {formatDate(time)}
              </span>
              <div className="mb-1">
                {getWeatherIcon(weatherData.daily.weathercode[i])}
              </div>
              <div className="text-xs font-bold">
                {Math.round(weatherData.daily.temperature_2m_max[i])}°
                <span className="text-muted-foreground font-normal ml-1 text-[10px]">
                  {Math.round(weatherData.daily.temperature_2m_min[i])}°
                </span>
              </div>
              <div className="text-[9px] text-blue-500 mt-0.5">
                {weatherData.daily.precipitation_sum[i]} mm
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
