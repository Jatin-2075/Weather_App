# 🌤️ Weather Dashboard

A comprehensive, responsive weather application built with React, TypeScript, and Vite. Integrates with the Open-Meteo API to provide real-time weather data, hourly forecasts, and historical weather analytics.

## ✨ Features

### 📍 Current Weather Page
- **Real-time Weather Metrics**
  - Current, minimum, and maximum temperature
  - Relative humidity and UV index
  - Sunrise and sunset times
  - Wind speed and direction
  - Precipitation data

- **Air Quality Monitoring**
  - Air Quality Index (AQI)
  - PM10 and PM2.5 levels
  - Gas concentrations (CO, CO₂, NO₂, SO₂)

- **Interactive Hourly Charts** (6 visualizations)
  - Temperature trend with gradient fill
  - Humidity levels
  - Precipitation amounts
  - Visibility distance
  - Wind speed dynamics
  - Particulate matter (PM10 & PM2.5 combined)

### 📊 Historical Analytics Page
- **Date Range Selection** (up to 2 years)
- **5 Advanced Chart Types**
  - Temperature trends (min/max/mean)
  - Precipitation analysis
  - Wind speed variations

### 🎨 Design Features
- **Dark Theme** with purple accent colors
- **Fully Responsive** (mobile, tablet, desktop)
- **Touch-friendly** UI components

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔧 Technology Stack

- React 19.2.4 + TypeScript
- Vite 8.0.1
- Recharts 2.10.3
- Tailwind CSS 3.4.1
- Axios 1.6.8
- date-fns 3.0.0

## 🌐 API Integration

- **Open-Meteo**: Free weather data API
- **Auto Location Detection**: Browser Geolocation API
- **Air Quality Data**: Real-time monitoring

## 📝 Available Scripts

```bash
npm run dev       # Development server
npm run build     # Production build
npm run preview   # Preview build
npm run lint      # Run ESLint
```

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers