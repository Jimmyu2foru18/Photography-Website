# J&W Creative Studio

J&W Creative Studio is a photography management platform built for photographers and clients. It provides a centralized hub for showcasing portfolios, managing bookings, and professional networking.

## Features

### Photographer Portfolios
- Dedicated profiles for photographers.
- Integrated image galleries showcasing professional work.
- Bio, equipment list, and pricing information.

### Booking System
- Client-to-photographer booking interface.
- Budget offer and message submission.
- Status tracking for booking requests.

### User Dashboards
- Client Dashboard: Manage personal bookings and profile.
- Photographer Dashboard: Edit profile, equipment, and portfolio.
- Admin Dashboard: Oversight of platform users and activities.

### Education
- Educational resources and networking tools for photographers.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Framer Motion.
- **Backend:** Node.js, Express.
- **Database:** MySQL.
- **State Management:** React Context API.

## Project Structure

- `src/pages`: Individual route components (Home, Profile, Booking, etc.).
- `src/components`: Reusable UI components.
- `src/contexts`: Authentication and global state logic.
- `server.ts`: Express server implementation and API routes.
- `schema.sql`: Database schema definition.

## Setup Instructions

### Prerequisites
- Node.js
- MySQL Server

### Configuration
1. Create a `.env` file in the root directory.
2. Configure the following variables:
   - `DB_HOST`: Database host address.
   - `DB_USER`: Database username.
   - `DB_PASSWORD`: Database password.
   - `DB_NAME`: Database name.
   - `DB_PORT`: Database port (default 3306).
   - `GEMINI_API_KEY`: Google Gemini API key.

### Installation
```bash
npm install
```

### Database Migration
Initialize the database schema:
```bash
npx tsx migrate.ts
```

### Run Locally
Start the development server:
```bash
npm run dev
```
The application will be accessible at `http://localhost:3000`.

## Build and Production
Compile the frontend and backend for production:
```bash
npm run build
npm start
```
