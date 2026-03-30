import { useState, useCallback, useEffect } from 'react';
import { weatherAPI } from '../services/weatherapi';
import type { WeatherData, AirQualityData, HistoricalWeatherData } from '../types/weather.types';

export const useWeather = (latitude: number, longitude: number, selectedDate?: string) => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null);
    const [historicalData, setHistoricalData] = useState<HistoricalWeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWeatherData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const startTime = performance.now();

            let weatherResult = null;
            let airQualityResult = null;
            let lastError = null;

            try {
                const results = await Promise.allSettled([
                    weatherAPI.getCurrentWeather(latitude, longitude),
                    weatherAPI.getAirQuality(latitude, longitude),
                ]);

                if (results[0].status === 'fulfilled') {
                    weatherResult = results[0].value;
                } else {
                    lastError = results[0].reason;
                }

                if (results[1].status === 'fulfilled') {
                    airQualityResult = results[1].value;
                } else {
                    lastError = results[1].reason;
                }

                if (!weatherResult && lastError) {
                    throw lastError;
                }
            } catch (err) {
                console.error('Promise.allSettled error:', err);
                throw err;
            }

            if (weatherResult) setWeatherData(weatherResult);
            if (airQualityResult) setAirQualityData(airQualityResult);

            const endTime = performance.now();
            console.log(`Data fetched in ${(endTime - startTime).toFixed(2)}ms`);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to fetch weather data';
            setError(errorMsg);
            console.error('Weather API error:', err);
        } finally {
            setLoading(false);
        }
    }, [latitude, longitude]);

    const fetchHistoricalData = useCallback(
        async (startDate: string, endDate: string) => {
            try {
                setLoading(true);
                setError(null);
                const data = await weatherAPI.getHistoricalWeather(
                    latitude,
                    longitude,
                    startDate,
                    endDate
                );
                setHistoricalData(data);
            } catch (err) {
                const errorMsg = err instanceof Error ? err.message : 'Failed to fetch historical data';
                setError(errorMsg);
                console.error('Historical API error:', err);
            } finally {
                setLoading(false);
            }
        },
        [latitude, longitude]
    );

    useEffect(() => {
        fetchWeatherData();
    }, [latitude, longitude, fetchWeatherData]);

    return {
        weatherData,
        airQualityData,
        historicalData,
        loading,
        error,
        fetchWeatherData,
        fetchHistoricalData,
    };
};

