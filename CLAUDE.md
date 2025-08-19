# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server
npm run dev              # Start Next.js development server on localhost:3000

# Production builds
npm run build           # Build production bundle
npm start              # Start production server

# Code quality
npm run lint           # Run ESLint checks
```

## Project Overview

**Wattphase Demo** is a Next.js 15 application showcasing a power monitoring and electrician dispatch system for electrical infrastructure management. The app simulates real-time power readings, alerts, and emergency response coordination.

## Architecture

### Tech Stack
- **Next.js 15** (App Router) with React 19
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **shadcn/ui** components (New York style variant)
- **React Context** for state management
- **Leaflet/React-Leaflet** for interactive maps
- **Recharts** for data visualization

### Core Structure

#### State Management
- **PowerContext** (`src/contexts/power-context.tsx`): Central state management using React Context + useReducer
- Manages power readings, alerts, electrician selection, and simulation states
- Real-time data updates every 2 seconds via intervals

#### Key Components
- **Dashboard** (`src/app/page.tsx`): Main monitoring interface with gauges, charts, and alerts
- **Dispatch Page** (`src/app/dispatch/page.tsx`): Electrician selection and assignment interface  
- **ElectricianMap** (`src/components/electrician-map.tsx`): Interactive Leaflet map with SSR disabled
- **Confirmation Page** (`src/app/confirmation/page.tsx`): Job assignment confirmation

#### Data Layer
- **Types** (`src/lib/types.ts`): TypeScript interfaces for PowerReading, Alert, Electrician, etc.
- **Mock Data** (`src/lib/mock-data.ts`): Simulation functions and sample data
- **Utils** (`src/lib/utils.ts`): Utility functions including Tailwind class merging

### Application Flow
1. **Dashboard** displays real-time power monitoring with 3-phase electrical readings
2. **Issue Detection** triggers alerts when voltage drops or power loss occurs  
3. **Dispatch Dialog** prompts user to dispatch electrician for critical issues
4. **Electrician Selection** shows available contractors on interactive map
5. **Confirmation** displays job assignment details and tracking

### Key Features
- Real-time power monitoring simulation (voltage, current, frequency)
- Interactive charts showing historical trends
- Geolocation-based electrician dispatch (Cork, Ireland area)
- Responsive design with mobile-first approach
- Accessibility-focused UI components via shadcn/ui

## Development Notes

### Map Component
The ElectricianMap component uses dynamic imports with `ssr: false` to avoid server-side rendering issues with Leaflet's browser-specific APIs.

### Responsive Design
The app uses Tailwind's responsive utilities extensively (`sm:`, `md:`, `lg:`) for mobile-first responsive layouts.

### State Updates
Power readings update every 2 seconds. Issue simulations auto-stop after 30 seconds. Historical data maintains last 288 readings (24 hours at 5-minute intervals).

### Location Context
The app is themed around Cork, Ireland electrical infrastructure with realistic coordinates and addresses around Clonakilty area.