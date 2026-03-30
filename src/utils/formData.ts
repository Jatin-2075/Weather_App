import { format, parse } from 'date-fns';

export const formatDate = (dateString: string, formatStr = 'MMM dd, yyyy'): string => {
    try {
        const date = parse(dateString, 'yyyy-MM-dd', new Date());
        return format(date, formatStr);
    } catch {
        return dateString;
    }
};

export const formatTime = (timeString: string, formatStr = 'HH:mm'): string => {
    try {
        const date = new Date(timeString);
        return format(date, formatStr);
    } catch {
        return timeString;
    }
};

export const formatHourlyTime = (timeString: string): string => {
    try {
        const date = new Date(timeString);
        return format(date, 'HH:mm');
    } catch {
        return timeString;
    }
};

export const getWeatherDescription = (weatherCode: number): string => {
    const codes: Record<number, string> = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with hail',
        99: 'Thunderstorm with hail',
    };

    return codes[weatherCode] || 'Unknown';
};

export const getWindDirectionText = (degrees: number): string => {
    const directions = [
        'N',
        'NNE',
        'NE',
        'ENE',
        'E',
        'ESE',
        'SE',
        'SSE',
        'S',
        'SSW',
        'SW',
        'WSW',
        'W',
        'WNW',
        'NW',
        'NNW',
    ];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
};

export const getAQILabel = (aqi: number): string => {
    if (aqi <= 1) return 'Excellent';
    if (aqi <= 2) return 'Good';
    if (aqi <= 3) return 'Fair';
    if (aqi <= 4) return 'Poor';
    return 'Very Poor';
};

export const getAQIColor = (aqi: number): string => {
    if (aqi <= 1) return '#10b981';
    if (aqi <= 2) return '#3b82f6';
    if (aqi <= 3) return '#f59e0b';
    if (aqi <= 4) return '#ef4444';
    return '#991b1b';
};
