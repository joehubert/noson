# Noson Frontend

Frontend application for Noson - Sonos Control Application

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS + Headless UI
- **State Management**: React Context API

## Prerequisites

- Node.js 18 or higher
- npm
- Backend API running (see backend README)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env`:

```bash
# For local backend
VITE_API_URL=http://localhost:3000

# For Render backend
# VITE_API_URL=https://your-app.onrender.com
```

### 3. Start Development Server

```bash
npm run dev
```

The app will open at http://localhost:5173

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Project Structure

```
frontend/
├── src/
│   ├── components/           # React components
│   │   ├── Auth/            # Authentication components
│   │   ├── Devices/         # Device list and controls
│   │   ├── Services/        # Music services
│   │   ├── Layout/          # App layout components
│   │   └── common/          # Reusable components
│   ├── contexts/            # React contexts
│   │   └── AuthContext.jsx  # Authentication state
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useDevices.js
│   │   └── useServices.js
│   ├── pages/               # Page components
│   │   ├── LoginPage.jsx
│   │   ├── AuthSuccessPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── DevicesPage.jsx
│   │   └── ServicesPage.jsx
│   ├── services/            # API services
│   │   └── api.js           # Axios configuration
│   ├── utils/               # Utilities
│   │   └── constants.js
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── package.json
```

## Features

### Authentication
- Sonos OAuth 2.0 login flow
- JWT token storage in localStorage
- Automatic token validation
- Protected routes

### Dashboard
- View connected Sonos households
- Quick navigation to devices and services

### Devices Page
- List all Sonos devices/groups in household
- Real-time volume control with slider
- Volume adjustment buttons (+/- 5)
- Mute/unmute toggle
- Auto-refresh every 30 seconds
- Manual refresh button
- Expandable device details

### Services Page
- View all connected music services
- Display service authorization status
- Service icons and metadata

## Development

### Component Guidelines

- Use functional components with hooks
- Keep components small and focused
- Use Tailwind utility classes for styling
- Add loading and error states
- Make components responsive (mobile-first)

### State Management

- Use React Context for global state (auth)
- Use local state for component-specific data
- Custom hooks for shared logic

### API Integration

All API calls go through `src/services/api.js`:
- Automatic JWT token injection
- 401 error handling (redirect to login)
- Centralized error handling

### Styling

- Tailwind CSS utility classes
- Black and white color scheme (Sonos-inspired)
- Responsive breakpoints: sm, md, lg, xl
- Hover states and transitions

## Troubleshooting

### CORS Errors
- Make sure backend `FRONTEND_URL` environment variable is set correctly
- Backend should allow requests from `http://localhost:5173`

### OAuth Not Working
- Verify `VITE_API_URL` points to correct backend
- Check that backend `SONOS_REDIRECT_URI` is set correctly
- Ensure backend is accessible from browser

### API 401 Errors
- JWT token may be expired - logout and login again
- Check browser console for token presence: `localStorage.getItem('jwt_token')`

### Components Not Updating
- Check React DevTools for state changes
- Verify useEffect dependencies are correct
- Check API responses in Network tab

## Building for Production

```bash
# Build
npm run build

# Output in dist/ directory
# Deploy dist/ folder to your hosting service
```

## Deployment Options

- **Vercel**: Connect GitHub repo, auto-deploys
- **Netlify**: Drag-and-drop dist folder
- **AWS S3 + CloudFront**: Static hosting
- **GitHub Pages**: Free static hosting

## Environment Variables

- `VITE_API_URL` - Backend API URL (required)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

MIT
