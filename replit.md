# Overview

This is a premium mobile shisha and mocktail catering service website for "Shisha Chauffeurs". The application is a full-stack web platform that allows customers to browse services, view flavor menus, explore an event gallery, and submit booking requests. It serves as both a marketing website and a booking management system for a luxury mobile entertainment service that operates exclusively at outdoor locations and private residences.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built with React and TypeScript using Vite as the build tool. The application follows a component-based architecture with shadcn/ui components for consistent UI design. Key architectural decisions include:

- **Single Page Application (SPA)**: Uses Wouter for client-side routing with only two routes (home and 404)
- **Component Organization**: Features modular components for different sections (hero, services, flavors, gallery, about, contact form, footer, navigation)
- **Styling**: Tailwind CSS with custom CSS variables for theming, using a dark theme with gold accents
- **State Management**: React Hook Form for form handling with Zod validation, TanStack Query for server state management
- **UI Components**: shadcn/ui component library providing accessible, customizable components

## Backend Architecture

The backend uses Express.js with TypeScript in a REST API pattern. Core architectural choices include:

- **Server Structure**: Express application with middleware for request logging, JSON parsing, and error handling
- **Storage Abstraction**: Interface-based storage system currently using in-memory storage (MemStorage) with plans for database integration
- **Route Organization**: Centralized route registration with RESTful endpoints for booking management
- **Development Setup**: Vite integration for development with hot module replacement

## Data Storage Solutions

The application currently uses an in-memory storage system but is architected for easy migration to a database:

- **Current Storage**: MemStorage class implementing IStorage interface for development/testing
- **Database Ready**: Drizzle ORM configured for PostgreSQL with complete schema definitions
- **Schema Design**: Two main entities - users (for future authentication) and bookings (for customer reservations)
- **Data Validation**: Zod schemas for runtime validation matching database schema

## Database Schema

The PostgreSQL schema includes:
- **Users Table**: Basic user authentication structure (id, username, password)
- **Bookings Table**: Comprehensive booking information including customer details, event information, service selections, and special requirements
- **Validation**: Client and server-side validation using Zod schemas derived from Drizzle table definitions

## API Structure

RESTful API design with the following endpoints:
- `POST /api/bookings` - Create new booking requests with full validation
- `GET /api/bookings` - Retrieve all bookings (admin functionality)
- `GET /api/bookings/:id` - Retrieve specific booking details

# External Dependencies

## Core Framework Dependencies
- **React 18**: Frontend framework with hooks and modern patterns
- **Express.js**: Backend web framework for Node.js
- **TypeScript**: Type safety across frontend and backend
- **Vite**: Build tool and development server with HMR

## Database and ORM
- **Drizzle ORM**: Type-safe database toolkit for PostgreSQL
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon database
- **Drizzle Kit**: Database migrations and schema management

## UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Component library built on Radix UI primitives
- **Radix UI**: Comprehensive collection of accessible UI components
- **Lucide React**: Icon library for consistent iconography

## Form Handling and Validation
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: TypeScript-first schema validation library
- **@hookform/resolvers**: Validation resolver for React Hook Form + Zod integration

## State Management and Data Fetching
- **TanStack Query**: Server state management with caching and synchronization
- **Wouter**: Lightweight client-side routing library

## Development and Build Tools
- **tsx**: TypeScript execution environment for development
- **esbuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration

## External Services
- **Replit Integration**: Development environment with specific Replit plugins and error handling
- **Google Fonts**: Custom font loading (Playfair Display, Inter, JetBrains Mono)
- **Unsplash Images**: Stock photography for gallery and visual content

The application is designed to be easily deployable on Replit with seamless development experience, while maintaining production-ready architecture patterns for potential scaling and database integration.