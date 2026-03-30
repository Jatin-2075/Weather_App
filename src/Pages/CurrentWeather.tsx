import React, { useState, useMemo } from 'react';
import { useWeather } from '../hooks/useWeather';
import { ToggleUnit } from '../components/ui/ToggleUnit';
import { WeatherCard } from '../components/ui/WeatherCard';
import { ChartWrapper } from '../components/ui/ChartWrapper';
import { Loader } from '../components/ui/Loader';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ComposedChart,
    ResponsiveContainer,
    BarChart,
    Bar,
} from 'recharts';
import {
    formatTemperature,
    getTemperatureUnit,
} from '../utils/convertTemp';
import {
    formatDate,
    formatHourlyTime,
    getWeatherDescription,
    getAQILabel,
    getAQIColor,
    getWindDirectionText,
} from '../utils/formData';
import { MdWaterDrop, MdVisibility, MdAir, MdWbSunny, MdThermostat } from 'react-icons/md';

interface CurrentWeatherProps {
    latitude: number;
    longitude: number;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
    latitude,
    longitude,
}) => {
    const [isFahrenheit, setIsFahrenheit] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const { weatherData, airQualityData, loading, error } = useWeather(
        latitude,
        longitude
    );

    if (loading) return <Loader />;
    if (error || !weatherData || !airQualityData) {
        return (
            <div className="p-6 text-center text-red-400">
                {error || 'Failed to load weather data'}
            </div>
        );
    }

    const currentTemp = formatTemperature(weatherData.current.temperature_2m, isFahrenheit);
    const unit = getTemperatureUnit(isFahrenheit);
    const dayIndex = weatherData.daily.time.indexOf(selectedDate);

    const hourlyChartData = useMemo(() => {
        if (dayIndex === -1) return [];
        const startIdx = dayIndex * 24;
        const endIdx = startIdx + 24;

        return weatherData.hourly.time.slice(startIdx, endIdx).map((time: string, idx: number) => ({
            time: formatHourlyTime(time),
            temp: formatTemperature(
                weatherData.hourly.temperature_2m[startIdx + idx],
                isFahrenheit
            ),
            humidity: weatherData.hourly.relative_humidity_2m[startIdx + idx],
            precipitation: weatherData.hourly.precipitation[startIdx + idx],
            visibility: weatherData.hourly.visibility[startIdx + idx] / 1000,
            windSpeed: weatherData.hourly.wind_speed_10m[startIdx + idx],
            pm10: airQualityData.hourly.pm10[startIdx + idx],
            pm2_5: airQualityData.hourly.pm2_5[startIdx + idx],
        }));
    }, [dayIndex, weatherData, airQualityData, isFahrenheit]);

    return (
        <div className="p-6 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <label className="text-light-muted text-sm mr-3">Select Date:</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-secondary text-light px-3 py-2 rounded border border-accent/20 focus:outline-none focus:border-accent"
                    />
                </div>
                <ToggleUnit
                    isFahrenheit={isFahrenheit}
                    onChange={setIsFahrenheit}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <WeatherCard
                    title="Current Temperature"
                    value={Math.round(currentTemp)}
                    unit={unit}
                    icon={<MdThermostat />}
                />
                <WeatherCard
                    title="Weather"
                    value={getWeatherDescription(weatherData.daily.weather_code[dayIndex > -1 ? dayIndex : 0])}
                    icon={<MdWbSunny />}
                />
                <WeatherCard
                    title="Humidity"
                    value={weatherData.current.relative_humidity_2m}
                    unit="%"
                    icon={<MdWaterDrop />}
                />
                <WeatherCard
                    title="Wind Speed"
                    value={Math.round(weatherData.current.wind_speed_10m)}
                    unit="km/h"
                    icon={<MdAir />}
                />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {dayIndex > -1 && (
                    <>
                        <WeatherCard
                            title="Min Temperature"
                            value={Math.round(formatTemperature(weatherData.daily.temperature_2m_min[dayIndex], isFahrenheit))}
                            unit={unit}
                        />
                        <WeatherCard
                            title="Max Temperature"
                            value={Math.round(formatTemperature(weatherData.daily.temperature_2m_max[dayIndex], isFahrenheit))}
                            unit={unit}
                        />
                    </>
                )}
                <WeatherCard
                    title="Precipitation"
                    value={weatherData.current.precipitation.toFixed(1)}
                    unit="mm"
                />
                <WeatherCard
                    title="Visibility"
                    value={(weatherData.hourly.visibility[0] / 1000).toFixed(1)}
                    unit="km"
                    icon={<MdVisibility />}
                />
                <WeatherCard
                    title="UV Index"
                    value={weatherData.hourly.uv_index[0].toFixed(1)}
                />
                <WeatherCard
                    title="Wind Direction"
                    value={getWindDirectionText(weatherData.current.wind_direction_10m)}
                />
            </div>

            <div>
                <h2 className="text-2xl font-bold text-light mb-4">Air Quality Metrics</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <WeatherCard title="PM10" value={airQualityData.hourly.pm10[0].toFixed(1)} unit="μg/m³" />
                    <WeatherCard
                        title="PM2.5"
                        value={airQualityData.hourly.pm2_5[0].toFixed(1)}
                        unit="μg/m³"
                    />
                    <WeatherCard
                        title="Carbon Monoxide"
                        value={airQualityData.hourly.carbon_monoxide[0].toFixed(2)}
                        unit="μmol/m³"
                    />
                    <WeatherCard
                        title="CO₂"
                        value={airQualityData.hourly.carbon_dioxide[0].toFixed(0)}
                        unit="μmol/m³"
                    />
                    <WeatherCard
                        title="NO₂"
                        value={airQualityData.hourly.nitrogen_dioxide[0].toFixed(2)}
                        unit="μmol/m³"
                    />
                    <WeatherCard
                        title="SO₂"
                        value={airQualityData.hourly.sulphur_dioxide[0].toFixed(2)}
                        unit="μmol/m³"
                    />
                    <WeatherCard
                        title="Precipitation Probability"
                        value={dayIndex > -1 ? weatherData.daily.precipitation_probability_max[dayIndex] : 0}
                        unit="%"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                <ChartWrapper title="Temperature Trend (Hourly)">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={hourlyChartData}>
                            <defs>
                                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.2)" />
                            <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#2d3561', border: '1px solid #7c3aed' }}
                                labelStyle={{ color: '#e0e7ff' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="temp"
                                stroke="#7c3aed"
                                fillOpacity={1}
                                fill="url(#colorTemp)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartWrapper>

                <ChartWrapper title="Relative Humidity (Hourly)">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={hourlyChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.2)" />
                            <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} domain={[0, 100]} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#2d3561', border: '1px solid #7c3aed' }}
                                labelStyle={{ color: '#e0e7ff' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="humidity"
                                stroke="#3b82f6"
                                dot={false}
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartWrapper>

                <ChartWrapper title="Precipitation (Hourly)">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={hourlyChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.2)" />
                            <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#2d3561', border: '1px solid #7c3aed' }}
                                labelStyle={{ color: '#e0e7ff' }}
                            />
                            <Bar dataKey="precipitation" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartWrapper>

                <ChartWrapper title="Visibility (Hourly)">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={hourlyChartData}>
                            <defs>
                                <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.2)" />
                            <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#2d3561', border: '1px solid #7c3aed' }}
                                labelStyle={{ color: '#e0e7ff' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="visibility"
                                stroke="#10b981"
                                fillOpacity={1}
                                fill="url(#colorVis)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartWrapper>

                <ChartWrapper title="Wind Speed (Hourly)">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={hourlyChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.2)" />
                            <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#2d3561', border: '1px solid #7c3aed' }}
                                labelStyle={{ color: '#e0e7ff' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="windSpeed"
                                stroke="#f59e0b"
                                dot={false}
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartWrapper>

                <ChartWrapper title="Particulate Matter (Hourly)">
                    <ResponsiveContainer width="100%" height={300}>
                        <ComposedChart data={hourlyChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.2)" />
                            <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#2d3561', border: '1px solid #7c3aed' }}
                                labelStyle={{ color: '#e0e7ff' }}
                            />
                            <Legend wrapperStyle={{ color: '#9ca3af' }} />
                            <Bar dataKey="pm10" fill="#ef4444" name="PM10" opacity={0.8} />
                            <Line
                                type="monotone"
                                dataKey="pm2_5"
                                stroke="#8b5cf6"
                                name="PM2.5"
                                dot={false}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </ChartWrapper>
            </div>
        </div>
    );
};