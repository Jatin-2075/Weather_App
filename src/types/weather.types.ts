export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;
  hourly_units: HourlyUnits;
  daily_units: DailyUnits;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  relative_humidity: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  weather_code: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  precipitation: number[];
  visibility: number[];
  weather_code: number[];
  wind_speed_10m: number[];
  uv_index: number[];
  uv_index_clear_sky: number[];
}

export interface DailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise: string[];
  sunset: string[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  wind_direction_10m_dominant: number[];
  uv_index_max: number[];
}

export interface HourlyUnits {
  time: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  precipitation: string;
  visibility: string;
  weather_code: string;
  wind_speed_10m: string;
}

export interface DailyUnits {
  time: string;
  weather_code: string;
  temperature_2m_max: string;
  temperature_2m_min: string;
  sunrise: string;
  sunset: string;
  precipitation_sum: string;
  precipitation_probability_max: string;
  wind_speed_10m_max: string;
  wind_direction_10m_dominant: string;
}

export interface AirQualityData {
  hourly: {
    time: string[];
    pm10: number[];
    pm2_5: number[];
    carbon_monoxide: number[];
    carbon_dioxide: number[];
    nitrogen_dioxide: number[];
    sulphur_dioxide: number[];
  };
}

export interface HistoricalWeatherData {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    temperature_2m_mean: number[];
    sunrise: string[];
    sunset: string[];
    precipitation_sum: number[];
    wind_speed_10m_max: number[];
    wind_direction_10m_dominant: number[];
  };
}

export interface LocationCoords {
  latitude: number;
  longitude: number;
  name?: string;
}

export interface ChartDataPoint {
  time: string;
  value: number;
  value2?: number;
  name?: string;
}