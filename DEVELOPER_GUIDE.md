# 📚 Weather Dashboard - Developer Guide

## Quick Reference

### Start Development
```bash
npm install      # First time setup
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Production build
npm run preview  # Test production build
npm run lint     # Check code quality
```

### File Structure Quick Links
```
src/
├── Pages/           ← User-facing pages (Current, Historical)
├── components/      ← Reusable UI components
├── services/        ← API integration (Open-Meteo)
├── hooks/           ← Custom React hooks (useWeather, useLocation)
├── types/           ← TypeScript interfaces
├── utils/           ← Helper functions
├── constants/       ← App configuration
├── routes/          ← Router setup
└── styles/          ← Global CSS (Tailwind)
```

## Code Organization

### Component Naming Convention
```typescript
// Functional component with TypeScript
export const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  return <div>Component</div>;
};

// With interface
interface ComponentNameProps {
  title: string;
  onClick: () => void;
}
```

### Hook Naming Convention
```typescript
// Custom hooks start with "use"
export const useCustomHook = () => {
  const [state, setState] = useState<Type>(initial);
  return { state, setState };
};
```

### File Naming
- **Components**: PascalCase (WeatherCard.tsx)
- **Utilities**: camelCase (formData.ts)
- **Hooks**: camelCase (useWeather.ts)
- **Types**: PascalCase (weather.types.ts)

## Component Hierarchy

```
App
└── AppRoutes
    ├── Navbar
    ├── Navigation Tabs
    └── CurrentWeather OR Historical
        ├── ChartWrapper (Multiple)
        │   └── Chart (Recharts)
        ├── WeatherCard (Multiple)
        ├── ToggleUnit
        └── Loader (if loading)
```

## Data Flow

```
Browser GPS Request
    ↓
useLocation Hook
    ↓
Location State
    ↓
Pass to useWeather
    ↓
weatherAPI Service
    ↓
Open-Meteo API Call
    ↓
Parse & Store in State
    ↓
Render Components with Data
```

## Adding New Features

### 1. New Chart
```typescript
// 1. Add type in weather.types.ts
export interface NewMetricData {
  time: string[];
  value: number[];
}

// 2. Update weatherAPI.tsx
export const weatherAPI = {
  getNewMetric: async (lat, lon) => {
    // API call
  }
};

// 3. Add to useWeather.ts
const [newMetricData, setNewMetricData] = useState<NewMetricData | null>(null);

// 4. Create chart component
export const NewChart: React.FC = () => {
  return (
    <ChartWrapper title="New Chart">
      <ResponsiveContainer>
        {/* Chart content */}
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

// 5. Add to page component
<NewChart data={newMetricData} />
```

### 2. New Weather Metric
```typescript
// Add to CurrentWeather.tsx
<WeatherCard
  title="New Metric"
  value={data.value}
  unit="unit"
  icon={<Icon />}
/>
```

### 3. New Utility Function
```typescript
// In utils/formData.ts or new file
export const newUtilityFunction = (input: Type): OutputType => {
  // Implementation
};

// Import and use
import { newUtilityFunction } from '../utils/formData';
```

## Styling Guide

### Tailwind Classes
```typescript
// Layout
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"

// Colors
className="bg-primary text-light border-accent"

// Responsive
className="px-4 md:px-6 lg:px-8"

// States
className="hover:bg-accent/80 transition-colors"

// Dark Mode
className="dark:bg-primary dark:text-light"
```

### Custom Tailwind Components (in index.css)
```css
@layer components {
  .card-primary {
    @apply bg-secondary rounded-lg p-6 border border-accent/20;
  }
  
  .btn-primary {
    @apply px-4 py-2 rounded-lg bg-accent hover:bg-accent/80 text-white;
  }
}
```

## Performance Tips

### Memoization
```typescript
// Memoize component
export const ExpensiveComponent = React.memo((props) => {
  return <div>{props.data}</div>;
});

// Memoize calculations
const chartData = useMemo(() => {
  return processData(rawData);
}, [rawData]);
```

### Lazy Loading
```typescript
// Code splitting with React.lazy
const Historical = lazy(() => import('./Pages/Historical'));

// In component
<Suspense fallback={<Loader />}>
  <Historical />
</Suspense>
```

## Testing Patterns

### Component Testing
```typescript
import { render, screen } from '@testing-library/react';
import { WeatherCard } from './WeatherCard';

describe('WeatherCard', () => {
  it('renders weather data correctly', () => {
    render(
      <WeatherCard
        title="Temperature"
        value={25}
        unit="°C"
      />
    );
    expect(screen.getByText('Temperature')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });
});
```

### Hook Testing
```typescript
import { renderHook, act } from '@testing-library/react';
import { useWeather } from './useWeather';

describe('useWeather', () => {
  it('fetches weather data', async () => {
    const { result } = renderHook(() => useWeather(40.7128, -74.006));
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.weatherData).toBeDefined();
  });
});
```

## Common Issues & Solutions

### Issue: Chart Not Rendering
```typescript
// Solution: Ensure ResponsiveContainer has parent width/height
<div style={{ width: '100%', height: 300 }}>
  <ResponsiveContainer>
    {/* Chart */}
  </ResponsiveContainer>
</div>
```

### Issue: API Timeout
```typescript
// Solution: Add timeout in axios config
const api = axios.create({
  timeout: 5000 // 5 second timeout
});
```

### Issue: Memory Leak Warning
```typescript
// Solution: Cleanup in useEffect
useEffect(() => {
  let mounted = true;
  
  fetchData().then(() => {
    if (mounted) setData(result);
  });
  
  return () => { mounted = false; };
}, []);
```

### Issue: GPS Not Working
```typescript
// Check browser console for errors
// Ensure HTTPS on production
// Use fallback location
const fallbackLocation = {
  latitude: 40.7128,
  longitude: -74.006,
  name: 'New York'
};
```

## Debugging

### Browser DevTools
```javascript
// In console
// Check component props
$r.props

// Check state
$r.state

// Network tab shows API calls
// Elements tab for HTML structure
// Performance tab for metrics
```

### React DevTools Extension
```
1. Install Chrome/Firefox extension
2. Look for ⚛️ Components tab
3. Inspect component tree
4. Check props and hooks
5. Highlight re-renders
```

### Performance Profiling
```javascript
// In React DevTools Profiler tab
1. Click "Record"
2. Interact with app
3. Click "Stop"
4. Analyze flame chart
5. Find slow components
```

## Environment Checklist

- [ ] Node.js v16+ installed
- [ ] npm v8+ installed
- [ ] Git configured
- [ ] .env files configured
- [ ] VS Code extensions (ESLint, Prettier)
- [ ] Browser dev tools installed
- [ ] React DevTools installed

## Recommended VS Code Extensions

```json
{
  "es7-react-js-snippets": "ES7 code snippets",
  "tailwind-css-intellisense": "Tailwind CSS autocomplete",
  "typescript-vue-plugin": "TypeScript support",
  "eslint": "Linting integration",
  "prettier": "Code formatter",
  "vscode-icons": "File icons"
}
```

## Git Workflow

```bash
# Feature branch
git checkout -b feature/weather-alerts
git add .
git commit -m "feat: add weather alerts"
git push origin feature/weather-alerts
# Create Pull Request on GitHub

# After approval
git checkout main
git pull origin main
git merge feature/weather-alerts
git push origin main

# Cleanup
git branch -d feature/weather-alerts
```

## API Reference

### Open-Meteo Weather
```typescript
weatherAPI.getCurrentWeather(latitude, longitude, forecastDays?, timezone?)
// Returns: WeatherData with current, hourly, daily forecasts
```

### Open-Meteo Air Quality
```typescript
weatherAPI.getAirQuality(latitude, longitude, forecastDays?)
// Returns: AirQualityData with pollution metrics
```

### Historical Weather
```typescript
weatherAPI.getHistoricalWeather(latitude, longitude, startDate, endDate, timezone?)
// Returns: HistoricalWeatherData for date range
```

## Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ✅ |
| Firefox | Latest | ✅ |
| Safari | Latest | ✅ |
| Edge | Latest | ✅ |
| Mobile Chrome | Latest | ✅ |
| Mobile Safari | iOS 12+ | ✅ |

## Security Best Practices

- [ ] No API keys in code
- [ ] Validate all inputs
- [ ] Use HTTPS in production
- [ ] Sanitize user input
- [ ] Keep dependencies updated
- [ ] Review npm audit reports
- [ ] Use Content Security Policy
- [ ] Implement rate limiting

## Performance Metrics

- First Contentful Paint (FCP): < 1s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3s
- Bundle Size: < 500KB

## Resources

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Recharts](https://recharts.org/en-US/)
- [Open-Meteo API](https://open-meteo.com)
- [Vite Guide](https://vitejs.dev/guide/)

## Support & Contact

- GitHub Issues: Report bugs
- Discussions: Ask questions
- Pull Requests: Submit improvements
- Email: Your contact info

---

**Happy Coding! 🚀**
