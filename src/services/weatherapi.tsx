import axios from 'axios';
import type {
  WeatherData,
  AirQualityData,
  HistoricalWeatherData,
} from '../types/weather.types';

const BASE_URL = 'https://api.open-meteo.com/v1';
const AQ_BASE_URL = 'https://air-quality-api.open-meteo.com/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

const aqApi = axios.create({
  baseURL: AQ_BASE_URL,
  timeout: 10000,
});

interface WeatherParams {
  latitude: number;
  longitude: number;
  current: string;
  hourly: string;
  daily: string;
  timezone: string;
  forecast_days?: number;
}

export const weatherAPI = {
  getCurrentWeather: async (
    latitude: number,
    longitude: number,
    forecastDays = 16,
    timezone = 'auto'
  ): Promise<WeatherData> => {
    const params: WeatherParams = {
      latitude,
      longitude,
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m',
      hourly:
        'temperature_2m,relative_humidity_2m,precipitation,weather_code,visibility,wind_speed_10m,uv_index,uv_index_clear_sky',
      daily:
        'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant,uv_index_max',
      timezone,
      forecast_days: forecastDays,
    };

    try {
      const response = await api.get<WeatherData>('/forecast', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  },

  getAirQuality: async (
    latitude: number,
    longitude: number,
    forecastDays = 1
  ): Promise<AirQualityData> => {
    const params = {
      latitude,
      longitude,
      hourly:
        'pm10,pm2_5,carbon_monoxide,carbon_dioxide,nitrogen_dioxide,sulphur_dioxide',
      timezone: 'auto',
      forecast_days: forecastDays,
    };

    try {
      const response = await aqApi.get<AirQualityData>('/air_quality', {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching air quality data:', error);
      throw error;
    }
  },

  getHistoricalWeather: async (
    latitude: number,
    longitude: number,
    startDate: string,
    endDate: string,
    timezone = 'auto'
  ): Promise<HistoricalWeatherData> => {
    const params = {
      latitude,
      longitude,
      start_date: startDate,
      end_date: endDate,
      daily:
        'temperature_2m_max,temperature_2m_min,temperature_2m_mean,sunrise,sunset,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant',
      timezone,
    };

    try {
      const response = await api.get<HistoricalWeatherData>('/forecast', {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  },
};
