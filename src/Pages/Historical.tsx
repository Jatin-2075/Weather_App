import React, { useState, useMemo } from 'react';
import { useWeather } from '../hooks/useWeather';
import { ChartWrapper } from '../components/ui/ChartWrapper';
import { Loader } from '../components/ui/Loader';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ComposedChart,
} from 'recharts';
import { getWindDirectionText } from '../utils/formData';
import { format, subDays } from 'date-fns';

interface HistoricalProps {
    latitude: number;
    longitude: number;
}

export const Historical: React.FC<HistoricalProps> = ({ latitude, longitude }) => {
    const today = new Date();
 
    const defaultEnd = format(subDays(today, 5), 'yyyy-MM-dd');
    const defaultStart = format(subDays(today, 365), 'yyyy-MM-dd');

    const [startDate, setStartDate] = useState(defaultStart);
    const [endDate, setEndDate] = useState(defaultEnd);
    const [hasLoaded, setHasLoaded] = useState(false);

    const { historicalData, loading, error, fetchHistoricalData } = useWeather(
        latitude,
        longitude
    );

    const handleFetchData = () => {
        setHasLoaded(true);
        fetchHistoricalData(startDate, endDate);
    };

    const chartData = useMemo(() => {
        if (!historicalData) return [];
        return historicalData.daily.time.map((date, idx) => ({
            date: date.slice(5),
            tempMax: historicalData.daily.temperature_2m_max[idx] ?? null,
            tempMin: historicalData.daily.temperature_2m_min[idx] ?? null,
            tempMean: historicalData.daily.temperature_2m_mean[idx] ?? null,
            precipitation: historicalData.daily.precipitation_sum[idx] ?? 0,
            windSpeed: historicalData.daily.wind_speed_10m_max[idx] ?? null,
            windDir: getWindDirectionText(
                historicalData.daily.wind_direction_10m_dominant[idx] ?? 0
            ),
        }));
    }, [historicalData]);

    const DateControls = () => (
        <div className="card-primary mb-6">
            <h2 className="text-2xl font-bold text-light mb-4">Historical Analytics</h2>
            <p className="text-light/50 text-sm mb-4">
                Data is available from 1940 to approximately 5 days ago.
            </p>
            <div className="flex gap-4 flex-wrap items-end">
                <div>
                    <label className="text-light-muted text-sm block mb-2">Start Date</label>
                    <input
                        type="date"
                        value={startDate}
                        max={endDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-secondary text-light px-3 py-2 rounded border border-accent/20 focus:outline-none focus:border-accent"
                    />
                </div>
                <div>
                    <label className="text-light-muted text-sm block mb-2">End Date</label>
                    <input
                        type="date"
                        value={endDate}
                        max={defaultEnd}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="bg-secondary text-light px-3 py-2 rounded border border-accent/20 focus:outline-none focus:border-accent"
                    />
                </div>
                <button onClick={handleFetchData} className="btn-primary">
                    Load Data
                </button>
            </div>
        </div>
    );

    if (!hasLoaded) {
        return (
            <div className="p-6">
                <DateControls />
            </div>
        );
    }

    if (loading) return <Loader />;

    if (error || !historicalData) {
        return (
            <div className="p-6">
                <DateControls />
                <div className="card-primary text-center">
                    <p className="text-red-400 text-lg font-semibold mb-2">⚠️ Failed to load historical data</p>
                    <p className="text-light/60 text-sm">{error || 'Try adjusting the date range.'}</p>
                </div>
            </div>
        );
    }

    const tooltipStyle = {
        contentStyle: { backgroundColor: '#2d3561', border: '1px solid #7c3aed' },
        labelStyle: { color: '#e0e7ff' },
    };

    const tickInterval = chartData.length > 180 ? Math.floor(chartData.length / 30) :
        chartData.length > 60 ? Math.floor(chartData.length / 15) : 'preserveStartEnd';

    return (
        <div className="p-6 space-y-8">
            <DateControls />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartWrapper title="Temperature Trends (Min / Max)">
                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="gradMax" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gradMin" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.2)" />
                            <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '11px' }} interval={tickInterval} />
                            <YAxis stroke="#9ca3af" style={{ fontSize: '11px' }} />
                            <Tooltip {...tooltipStyle} />
                            <Legend wrapperStyle={{ color: '#9ca3af' }} />
                            <Area type="monotone" dataKey="tempMax" stroke="#f59e0b" fill="url(#gradMax)" name="Max Temp (°C)" dot={false} />
                            <Area type="monotone" dataKey="tempMin" stroke="#3b82f6" fill="url(#gradMin)" name="Min Temp (°C)" dot={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartWrapper>

                <ChartWrapper title="Precipitation Trends">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.2)" />
                            <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '11px' }} interval={tickInterval} />
                            <YAxis stroke="#9ca3af" style={{ fontSize: '11px' }} />
                            <Tooltip {...tooltipStyle} />
                            <Bar dataKey="precipitation" fill="#06b6d4" radius={[2, 2, 0, 0]} name="Precipitation (mm)" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartWrapper>

                <ChartWrapper title="Wind Speed Trends">
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.2)" />
                            <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '11px' }} interval={tickInterval} />
                            <YAxis stroke="#9ca3af" style={{ fontSize: '11px' }} />
                            <Tooltip {...tooltipStyle} />
                            <Line type="monotone" dataKey="windSpeed" stroke="#10b981" strokeWidth={2} dot={false} name="Max Wind Speed (km/h)" />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartWrapper>

                <ChartWrapper title="Mean Temperature Trend">
                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorMean" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.2)" />
                            <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '11px' }} interval={tickInterval} />
                            <YAxis stroke="#9ca3af" style={{ fontSize: '11px' }} />
                            <Tooltip {...tooltipStyle} />
                            <Area type="monotone" dataKey="tempMean" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorMean)" name="Mean Temp (°C)" dot={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartWrapper>

                <ChartWrapper title="Temperature vs Precipitation">
                    <ResponsiveContainer width="100%" height={350}>
                        <ComposedChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.2)" />
                            <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '11px' }} interval={tickInterval} />
                            <YAxis yAxisId="left" stroke="#9ca3af" style={{ fontSize: '11px' }} />
                            <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" style={{ fontSize: '11px' }} />
                            <Tooltip {...tooltipStyle} />
                            <Legend wrapperStyle={{ color: '#9ca3af' }} />
                            <Line yAxisId="left" type="monotone" dataKey="tempMean" stroke="#7c3aed" name="Mean Temp (°C)" dot={false} />
                            <Bar yAxisId="right" dataKey="precipitation" fill="#06b6d4" name="Precipitation (mm)" opacity={0.6} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </ChartWrapper>
            </div>
        </div>
    );
};