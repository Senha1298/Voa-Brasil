# Voa Brasil Portal

## Overview

This is a full-stack web application for the "Voa Brasil" program, which appears to be a Brazilian government travel benefit system. The application allows users to login with their CPF (Brazilian tax ID), verify their eligibility, and access discounted flights for R$200 to anywhere in Brazil. The system includes user verification workflows, payment processing integration, and a multi-step registration process designed to match Brazilian government digital services standards.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript running on Vite for fast development and building
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom Brazilian government design system (gov.br theme)
- **UI Components**: Radix UI components with shadcn/ui library for consistent, accessible interface elements
- **State Management**: React Hook Form for form handling, TanStack Query for server state management
- **Animations**: Framer Motion for smooth page transitions and loading states
- **Charts**: Recharts for data visualization (program statistics)

### Backend Architecture
- **Runtime**: Node.js with Express.js as the web framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **Development**: tsx for TypeScript execution in development, esbuild for production builds
- **API Structure**: RESTful endpoints with `/api` prefix (routes currently minimal, suggesting external API integration)

### Data Storage
- **Database**: PostgreSQL configured through Drizzle ORM
- **Schema**: Basic user table with username/password fields (expandable for program participant data)
- **Migrations**: Drizzle Kit for database schema management and migrations
- **Type Safety**: Drizzle-Zod integration for runtime schema validation

### Authentication & User Flow
- **Multi-step verification**: CPF validation → Data verification → Eligibility check → Payment
- **External API integration**: Fetches user data from external service using CPF
- **Local storage**: Temporarily stores user data during registration flow
- **Mock verification**: Simulated government data verification process with progress indicators

### Payment Integration
- **PIX Payment System**: Integrated with Pagnet Brasil API for real-time PIX transaction generation
- **Transaction Processing**: Backend API creates PIX transactions with R$64.80 value for ANAC registration fee
- **API Migration**: Replaced Medius Pag with Pagnet API due to transaction refusal issues
- **User Experience**: Dedicated PIX payment page with copy-to-clipboard functionality and countdown timer
- **Session management**: Maintains user context through localStorage during payment flow

### Styling & Design System
- **Government compliance**: Brazilian gov.br design standards with official color scheme (#1451B4 blue)
- **Typography**: Rawline font family matching government specifications
- **Responsive design**: Mobile-first approach with Tailwind breakpoints
- **Accessibility**: Radix UI primitives ensure WCAG compliance

### Development & Build Process
- **Hot reload**: Vite dev server with TypeScript checking
- **Error handling**: Runtime error overlays and comprehensive error boundaries
- **Asset optimization**: Vite handles bundling, code splitting, and asset optimization
- **Theme customization**: Dynamic theme configuration through JSON with professional variant

## Heroku Deployment Configuration

### Files Added for Heroku Deploy
- **Procfile**: Defines web process command (`npm run build && npm start`)
- **app.json**: Heroku app metadata with environment variables and buildpack configuration
- **Dockerfile**: Container configuration for Docker-based deployments
- **runtime.txt**: Specifies Node.js 20.x runtime
- **README.md**: Comprehensive deployment instructions and project documentation
- **.slugignore**: Excludes unnecessary files from deployment slug

### Environment Variables Required
- `PAGNET_PUBLIC_KEY`: Payment API public key
- `PAGNET_SECRET_KEY`: Payment API secret key  
- `NODE_ENV`: Set to "production" for Heroku deployment
- `PORT`: Automatically provided by Heroku (configured in server/index.ts)

### Server Configuration Updates
- Modified `server/index.ts` to use `process.env.PORT` for Heroku compatibility
- Maintained development port 5000 as fallback
- Production-ready error handling and static file serving

## External Dependencies

### Core Framework Dependencies
- **React ecosystem**: React 18 with TypeScript, Vite build system
- **Routing**: Wouter for lightweight client-side navigation
- **HTTP client**: Built-in fetch with TanStack Query for caching and state management

### UI & Styling
- **Component library**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with PostCSS processing and autoprefixer
- **Icons**: Lucide React for consistent iconography
- **Animations**: Framer Motion for page transitions and micro-interactions

### Database & Backend
- **Database**: PostgreSQL (configured but may need provisioning)
- **ORM**: Drizzle ORM with Neon serverless connection
- **Validation**: Zod schema validation with Drizzle integration
- **WebSocket**: ws library for database connections

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **Build tools**: esbuild for fast production builds, tsx for development
- **Form handling**: React Hook Form with Hookform Resolvers for validation
- **Date handling**: date-fns for date formatting and manipulation

### External Services
- **Payment processing**: Third-party payment gateway (portal-cac-registro.org)
- **Government APIs**: External data verification services (likely Brazilian government APIs)
- **Font delivery**: Google Fonts for Rawline typography
- **CDN assets**: Font Awesome and external image hosting for UI assets

### Theme & Customization
- **Theme system**: Custom Replit plugin for shadcn theme JSON configuration
- **Color system**: CSS custom properties following gov.br design tokens
- **Component variants**: Class Variance Authority for consistent component styling