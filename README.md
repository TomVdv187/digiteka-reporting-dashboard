# Digiteka Reporting Dashboard

A modern Next.js dashboard for visualizing and analyzing Digiteka platform data. Built for easy deployment to Vercel and GitHub integration.

## Features

- 📊 Interactive charts and visualizations
- 📈 Real-time metrics tracking
- 📅 Customizable date range filtering
- 📱 Responsive design for all devices
- 💾 Export data to CSV and JSON formats
- 🎨 Clean, modern UI with Tailwind CSS

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Digiteka API credentials

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd digiteka-reporting-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Digiteka API credentials:
```
DIGITEKA_API_KEY=your_api_key_here
DIGITEKA_BASE_URL=https://api.digiteka.com/v1
DIGITEKA_SITE_ID=your_site_id_here
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `DIGITEKA_API_KEY`
   - `DIGITEKA_BASE_URL`
   - `DIGITEKA_SITE_ID`
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fdigiteka-reporting-app)

### Manual Deployment

```bash
npm run build
npm start
```

## API Configuration

The app is designed to work with the Digiteka platform API. You'll need:

1. **API Key**: Your Digiteka API authentication key
2. **Base URL**: The base URL for Digiteka API endpoints
3. **Site ID**: Your specific Digiteka site identifier

Contact Digiteka support to obtain these credentials.

## Data Structure

The dashboard expects data in this format:

```typescript
interface DigitekaMetrics {
  id: string;
  timestamp: string;
  views: number;
  impressions: number;
  clicks: number;
  revenue: number;
  duration: number;
  completion_rate: number;
  geography?: string;
  device_type?: string;
  content_id?: string;
  content_title?: string;
}
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # React components
├── lib/                # API client and utilities
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues related to:
- **App functionality**: Open a GitHub issue
- **Digiteka API**: Contact Digiteka support
- **Deployment**: Check Vercel documentation