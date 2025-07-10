# Employee Rewards System - System Kleen

A modern employee rewards and attendance tracking system built with React, TypeScript, and Clerk authentication.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Authentication**: Clerk
- **Styling**: TailwindCSS
- **PWA**: Vite PWA Plugin
- **State Management**: Zustand
- **Data Fetching**: React Query

## Features

- 🔐 **Secure Authentication** with Clerk
- 📱 **Responsive Design** for mobile and desktop
- ⚡ **Real-time Points Tracking**
- 🏆 **Leaderboards and Streaks**
- 📊 **Employee Dashboard**
- 🎯 **QR Code Check-ins**
- 🏢 **Company Branding** (System Kleen)
- 💻 **PWA Support** for offline usage

## Project Structure

```
vibecode-web/
├── backend/
│   ├── pb_data/        # PocketBase data (gitignored)
│   ├── pb_migrations/  # Database migrations
│   └── docker-compose.yml
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

## Getting Started

### Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Create environment file:
   ```bash
   # Create .env.local in frontend directory
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Deployment

This project is configured for easy deployment to:

- **Netlify** (recommended)
- **Vercel** 
- **GitHub Pages**

### Deploy to Netlify

1. Push code to GitHub
2. Connect repository to Netlify
3. Configure environment variables in Netlify dashboard
4. Deploy automatically on push to main branch

## Company Configuration

Currently configured for **System Kleen** with:
- Company branding and colors
- MST timezone (6-9 AM check-in window)
- Custom point allocation rules
- Professional UI/UX design