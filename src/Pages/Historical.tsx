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
import { formatDate, getWindDirectionText } from '../utils/formData';
import { addDays, format } from 'date-fns';

interface HistoricalProps {
  latitude: number;
  longitude: number;
}

export const Historical: React.FC<HistoricalProps> = ({ latitude, longitude }) => {
  const today = new Date();
  const twoYearsAgo = addDays(today, -730);

  const [startDate, setStartDate] = useState(format(twoYearsAgo, 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(today, 'yyyy-MM-dd'));

  const { historicalData, loading, error, fetchHistoricalData } = useWeather(
    latitude,
    longitude
  );

  const handleFetchData = () => {
    fetchHistoricalData(startDate, endDate);
  };

  if (!historicalData && !loading) {
    return (
      <div className="p-6">
        <div className="card-primary mb-6">
          <h2 className="text-2xl font-bold text-light mb-4">Historical Analytics</h2>
          <div className="flex gap-4 flex-wrap">
            <div>
              <label className="text-light-muted text-sm block mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-secondary text-light px-3 py-2 rounded border border-accent/20 focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-light-muted text-sm block mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-secondary text-light px-3 py-2 rounded border border-accent/20 focus:outline-none focus:border-accent"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleFetchData}
                className="btn-primary"
              >
                Load Data
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <Loader />;
  if (error || !historicalData) {
    return (
      <div className="p-6 text-center text-red-400">
        {error || 'Failed to load historical data'}
      </div>
    );
  }

  const chartData = useMemo(() => {
    return historicalData.daily.time.map((date, idx) => ({
      date: formatDate(date, 'MMM dd'),
      tempMax: historicalData.daily.temperature_2m_max[idx],
      tempMin: historicalData.daily.temperature_2m_min[idx],
      tempMean: historicalData.daily.temperature_2m_mean[idx],
      precipitation: historicalData.daily.precipitation_sum[idx],
      windSpeed: historicalData.daily.wind_speed_10m_max[idx],
      windDir: getWindDirectionText(historicalData.daily.wind_direction_10m_dominant[idx]),
    }));
  }, [historicalData]);

  return (
    <div className="p-6 space-y-8">
      {/* Date Range Selection */}
      <div className="card-primary">
        <h2 className="text-2xl font-bold text-light mb-4">Historical Analytics</h2>
        <div className="flex gap-4 flex-wrap">
          <div>
            <label className="text-light-muted text-sm block mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-secondary text-light px-3 py-2 rounded border border-accent/20 focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="text-light-muted text-sm block mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-secondary text-light px-3 py-2 rounded border border-accent/20 focus:outline-none focus:border-accent"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleFetchData}
              className="btn-primary"
            >
              Load Data
            </button>
          </div>
        </div>
      </div>

      {/* Historical Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature Trends */}
        <ChartWrapper title="Temperature Trends">
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.2)" />
              <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#2d3561', border: '1px solid #7c3aed' }}
                labelStyle={{ color: '#e0e7ff' }}
              />
              <Legend wrapperStyle={{ color: '#9ca3af' }} />
              <Area
                type="monotone"
                dataKey="tempMax"
                stackId="1"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.6}
                name="Max Temp"
              />
              <Area
                type="monotone"
                dataKey="tempMin"
                stackId="2"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
                name="Min Temp"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* Precipitation */}
        <ChartWrapper title="Precipitation Trends">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.2)" />
              <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#2d3561', border: '1px solid #7c3aed' }}
                labelStyle={{ color: '#e0e7ff' }}
              />
              <Bar dataKey="precipitation" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* Wind Speed */}
        <ChartWrapper title="Wind Speed Trends">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.2)" />
              <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#2d3561', border: '1px solid #7c3aed' }}
                labelStyle={{ color: '#e0e7ff' }}
              />
              <Line
                type="monotone"
                dataKey="windSpeed"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                name="Max Wind Speed"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* Mean Temperature */}
        <ChartWrapper title="Mean Temperature Trend">
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorMean" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.2)" />
              <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#2d3561', border: '1px solid #7c3aed' }}
                labelStyle={{ color: '#e0e7ff' }}
              />
              <Area
                type="monotone"
                dataKey="tempMean"
                stroke="#8b5cf6"
                fillOpacity={1}
                fill="url(#colorMean)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* Combined Analysis */}
        <ChartWrapper title="Temperature vs Precipitation">
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.2)" />
              <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="left" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#2d3561', border: '1px solid #7c3aed' }}
                labelStyle={{ color: '#e0e7ff' }}
              />
              <Legend wrapperStyle={{ color: '#9ca3af' }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="tempMean"
                stroke="#7c3aed"
                name="Mean Temp"
                dot={false}
              />
              <Bar
                yAxisId="right"
                dataKey="precipitation"
                fill="#06b6d4"
                name="Precipitation"
                opacity={0.6}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>
    </div>
  );
};
