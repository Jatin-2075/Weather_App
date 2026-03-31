import axios from 'axios';
import type {
    WeatherData,
    AirQualityData,
    HistoricalWeatherData,
} from '../types/weather.types';

const BASE_URL = 'https://api.open-meteo.com/v1';
const AQ_BASE_URL = 'https://air-quality-api.open-meteo.com/v1';

const api = axios.create({
    timeout: 15000,
});

const aqApi = axios.create({
    timeout: 15000,
});

export const weatherAPI = {
    getCurrentWeather: async (
        latitude: number,
        longitude: number,
        forecastDays = 16,
        timezone = 'auto'
    ): Promise<WeatherData> => {
        const params = {
            latitude,
            longitude,
            current: [
                'temperature_2m',
                'relative_humidity_2m',
                'apparent_temperature',
                'is_day',
                'precipitation',
                'weather_code',
                'wind_speed_10m',
                'wind_direction_10m',
            ].join(','),
            hourly: [
                'temperature_2m',
                'relative_humidity_2m',
                'precipitation',
                'weather_code',
                'visibility',
                'wind_speed_10m',
                'uv_index',
                'uv_index_clear_sky',
            ].join(','),
            daily: [
                'weather_code',
                'temperature_2m_max',
                'temperature_2m_min',
                'sunrise',
                'sunset',
                'precipitation_sum',
                'precipitation_probability_max',
                'wind_speed_10m_max',
                'wind_direction_10m_dominant',
                'uv_index_max',
            ].join(','),
            timezone,
            forecast_days: forecastDays,
        };

        try {
            const response = await api.get<WeatherData>(`${BASE_URL}/forecast`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching weather data:', error);
            throw new Error('Failed to fetch weather data. Check your connection.');
        }
    },

    getAirQuality: async (
        latitude: number,
        longitude: number,
        forecastDays = 5
    ): Promise<AirQualityData> => {
        const params = {
            latitude,
            longitude,
            hourly: [
                'pm10',
                'pm2_5',
                'carbon_monoxide',
                'carbon_dioxide',
                'nitrogen_dioxide',
                'sulphur_dioxide',
            ].join(','),
            timezone: 'auto',
            forecast_days: forecastDays,
        };

        try {
            const response = await aqApi.get<AirQualityData>(
                `${AQ_BASE_URL}/air_quality`,
                { params }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching air quality data:', error);
            throw new Error('Failed to fetch air quality data.');
        }
    },

    getHistoricalWeather: async (
        latitude: number,
        longitude: number,
        startDate: string,
        endDate: string,
        timezone = 'auto'
    ): Promise<HistoricalWeatherData> => {
        const today = new Date().toISOString().split('T')[0];
        const endpoint = endDate < today ? `${BASE_URL}/archive` : `${BASE_URL}/forecast`;

        const params = {
            latitude,
            longitude,
            start_date: startDate,
            end_date: endDate > today ? today : endDate,
            daily: [
                'temperature_2m_max',
                'temperature_2m_min',
                'temperature_2m_mean',
                'sunrise',
                'sunset',
                'precipitation_sum',
                'wind_speed_10m_max',
                'wind_direction_10m_dominant',
            ].join(','),
            timezone,
        };

        try {
            const response = await api.get<HistoricalWeatherData>(endpoint, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching historical data:', error);
            throw new Error('Failed to fetch historical data. Try a different date range.');
        }
    },
};