# 🚀 Deployment & Hosting Guide

## Table of Contents
1. [Local Setup](#local-setup)
2. [GitHub Setup](#github-setup)
3. [Hosting Options](#hosting-options)
4. [Production Build](#production-build)
5. [Environment Setup](#environment-setup)

## Local Setup

### Prerequisites
- Node.js v16+ (LTS recommended)
- npm v8+ or yarn
- Git
- A text editor (VS Code, Sublime, etc.)

### Installation

```bash
# Navigate to project directory
cd Weather_App

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
# Visit: http://localhost:5173
```

## GitHub Setup

### 1. Create GitHub Repository

```bash
# Initialize git (if not already done)
git init

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/weather-dashboard.git

# Create main branch
git branch -M main

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Weather Dashboard app

- Implemented current weather page with hourly forecasts
- Added historical analytics with date range selection
- Integrated Open-Meteo API for weather data
- Responsive design with dark theme
- 11 interactive charts with Recharts
- Mobile-first implementation

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

# Push to GitHub
git push -u origin main
```

### 2. GitHub Repository Settings

Navigate to repository settings and:
- Enable "Discussions" for user feedback
- Add descriptive repository description
- Add topics: `weather`, `react`, `typescript`, `tailwindcss`
- Set homepage to deployed URL (once hosted)

## Hosting Options

### Option 1: Vercel (Recommended ⭐)

**Advantages:**
- Free tier with unlimited deployments
- Automatic deployments from GitHub
- Edge functions support
- Best performance

**Setup:**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy project
vercel

# For production
vercel --prod
```

**Or connect via Vercel Dashboard:**
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New..." > "Project"
4. Select your weather-dashboard repository
5. Click "Import"
6. Vercel auto-detects Vite configuration
7. Click "Deploy"

### Option 2: Netlify

**Setup:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

**Or connect via Netlify Dashboard:**
1. Go to [netlify.com](https://netlify.com)
2. Sign in with GitHub
3. Click "Add new site" > "Import an existing project"
4. Select repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Deploy

### Option 3: GitHub Pages

**Setup:**
1. Enable GitHub Pages in repository settings
2. Source: `GitHub Actions`
3. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

4. Update `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/weather-dashboard/', // Replace with your repo name
  plugins: [react()],
})
```

### Option 4: Traditional VPS/Server

**For Digital Ocean, AWS EC2, Linode, etc.:**

```bash
# Build project
npm run build

# Copy dist/ folder to server
scp -r dist/* user@server:/var/www/weather-dashboard/

# Configure Nginx
sudo nano /etc/nginx/sites-available/weather-dashboard
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name weather-dashboard.yourdomain.com;
    
    location / {
        root /var/www/weather-dashboard;
        try_files $uri $uri/ /index.html;
    }
    
    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/json;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/weather-dashboard /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Enable SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d weather-dashboard.yourdomain.com
```

## Production Build

### 1. Optimize Build

```bash
# Create production build
npm run build

# Check build size
ls -lh dist/

# Preview build locally
npm run preview

# Open http://localhost:4173
```

### 2. Build Optimization Tips

**Update `vite.config.ts`:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable in production
    minify: 'terser', // Minify with Terser
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
        },
      },
    },
  },
})
```

### 3. Performance Checklist

- [ ] Build size < 500KB
- [ ] Gzip compression enabled
- [ ] Cache headers configured
- [ ] Images optimized
- [ ] Fonts self-hosted
- [ ] Sourcemaps disabled
- [ ] Production URL set
- [ ] HTTPS enabled

## Environment Setup

### Development Environment

```bash
# .env.local (not committed)
VITE_API_BASE_URL=https://api.open-meteo.com/v1
VITE_AIR_QUALITY_URL=https://air-quality-api.open-meteo.com/v1
```

### Production Environment

```bash
# .env.production (can be committed)
VITE_API_BASE_URL=https://api.open-meteo.com/v1
VITE_AIR_QUALITY_URL=https://air-quality-api.open-meteo.com/v1
```

## Monitoring & Analytics

### Add to index.html

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>

<!-- Sentry Error Tracking -->
<script src="https://browser.sentry-cdn.com/VERSION/bundle.min.js"></script>
<script>
  Sentry.init({ dsn: "YOUR_SENTRY_DSN" });
</script>
```

## Domain Setup

### 1. Purchase Domain
- Namecheap, GoDaddy, Google Domains, etc.

### 2. Point to Hosting
- Update DNS records
- For Vercel: Add CNAME record
- For Netlify: Update nameservers
- For custom server: Point A record to IP

### 3. Enable HTTPS
- Vercel/Netlify: Automatic
- Custom server: Use Let's Encrypt

## CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Build & Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Build
        run: npm run build
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Post-Deployment

### 1. Test Deployment
- [ ] Load homepage
- [ ] Check geolocation
- [ ] Verify all charts render
- [ ] Test mobile responsiveness
- [ ] Check API integration
- [ ] Verify performance

### 2. Set Up Redirects (Vercel)

Create `vercel.json`:
```json
{
  "redirects": [
    {
      "source": "/old-path",
      "destination": "/",
      "permanent": true
    }
  ]
}
```

### 3. Monitor Performance

- Set up Vercel Analytics
- Enable Netlify Analytics
- Use Google PageSpeed Insights
- Monitor error rates
- Track user engagement

## Troubleshooting

### Build Fails
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf dist
npm run build
```

### Slow Performance
- Enable gzip compression
- Add caching headers
- Optimize images
- Code split with lazy loading
- Check API response times

### Geolocation Not Working
- Ensure HTTPS on production
- Check browser permissions
- Verify browser support
- Test with fallback location

## Security Checklist

- [ ] HTTPS enabled
- [ ] No secrets in code
- [ ] npm audit passed
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Input validation implemented
- [ ] Rate limiting enabled
- [ ] DDoS protection active

## Scaling

### If Traffic Grows
- Enable CDN (Cloudflare, Fastly)
- Add API caching layer
- Use serverless functions
- Implement rate limiting
- Monitor server resources

---

**Happy Hosting! 🎉**

For questions or issues, check the README.md or GitHub Issues.
