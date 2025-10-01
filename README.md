# NuelReserve - Professional Service Booking Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.2.16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.39.3-green)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.9-blue)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> A comprehensive, feature-rich service booking platform connecting customers with trusted service providers through an intuitive, real-time experience.

## 📋 Table of Contents

- [🎯 Problem Statement](#-problem-statement)
- [💡 Solution Statement](#-solution-statement)
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📊 Database Setup](#-database-setup)
- [🎨 User Experience](#-user-experience)
- [🔧 API Reference](#-api-reference)
- [📱 Screenshots](#-screenshots)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🎯 Problem Statement

### The Service Booking Challenge

Traditional service booking platforms suffer from several critical issues:

**For Customers:**
- **Lack of Trust**: No way to verify provider quality or read genuine reviews
- **Poor Discovery**: Limited search and filtering options make finding the right service difficult
- **Communication Gaps**: No direct communication with providers before/during booking
- **No Personalization**: Generic experiences without favorites or preferences
- **Delayed Updates**: No real-time notifications about booking status

**For Service Providers:**
- **Limited Business Tools**: No analytics, customer management, or performance insights
- **Poor Customer Relationships**: No CRM tools or communication channels
- **Revenue Blindness**: No visibility into earnings, trends, or business metrics
- **Operational Inefficiency**: Manual processes for scheduling and customer management

**Platform-Wide Issues:**
- **Static Experience**: No real-time updates or live communication
- **Trust Deficit**: Lack of reviews, ratings, and quality assurance
- **Business Intelligence Gap**: No data-driven insights for growth
- **User Retention Problems**: Generic experiences don't encourage repeat usage

## 💡 Solution Statement

### NuelReserve: The Complete Service Booking Ecosystem

NuelReserve revolutionizes service booking by providing a **comprehensive, intelligent platform** that addresses all stakeholder needs through:

**🎯 Customer-Centric Innovation:**
- **Trust Through Transparency**: Comprehensive review and rating system
- **Smart Discovery**: Advanced search with AI-powered recommendations
- **Seamless Communication**: Real-time messaging between customers and providers
- **Personalized Experience**: Favorites, preferences, and tailored recommendations

**🏢 Provider Empowerment:**
- **Business Intelligence Dashboard**: Real-time analytics and revenue tracking
- **Customer Relationship Management**: Complete customer history and insights
- **Operational Excellence**: Automated scheduling and performance metrics
- **Growth Tools**: Marketing insights and customer acquisition strategies

**⚡ Technical Excellence:**
- **Real-Time Experience**: Live updates via WebSocket connections
- **Scalable Architecture**: Modern tech stack for enterprise-grade performance
- **Data-Driven Insights**: Advanced analytics for continuous improvement
- **Mobile-First Design**: Responsive experience across all devices

## ✨ Key Features

### 🎨 User Experience Features

#### For Customers
- **⭐ Advanced Reviews & Ratings**: 5-star rating system with detailed comments
- **🔍 Intelligent Search**: Multi-criteria filtering (price, category, rating, location)
- **❤️ Favorites System**: Save and organize preferred services
- **💬 Real-Time Messaging**: Direct communication with service providers
- **🔔 Smart Notifications**: Real-time booking updates and reminders
- **📱 Mobile-Optimized**: Seamless experience across all devices

#### For Service Providers
- **📊 Analytics Dashboard**: Revenue tracking, booking trends, and KPIs
- **👥 Customer Management**: Complete customer profiles and history
- **📈 Performance Metrics**: Conversion rates, customer satisfaction, growth trends
- **⚡ Automated Workflows**: Smart scheduling and reminder systems
- **💰 Revenue Insights**: Detailed earnings reports and financial analytics

### 🛠️ Technical Features

- **🔄 Real-Time Updates**: WebSocket connections for live notifications
- **🔒 Enterprise Security**: Row-level security and data encryption
- **📊 Advanced Analytics**: Interactive charts and business intelligence
- **🎯 Smart Recommendations**: AI-powered service suggestions
- **🌐 Multi-Device Support**: Progressive Web App capabilities
- **⚡ High Performance**: Optimized queries and caching strategies

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14.2.16 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI + shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-Time**: Supabase Realtime
- **File Storage**: Supabase Storage
- **API**: RESTful APIs with Next.js API Routes

### Development Tools
- **Package Manager**: pnpm
- **Linting**: ESLint
- **Formatting**: Prettier
- **Deployment**: Vercel

### Key Dependencies
```json
{
  "@supabase/supabase-js": "^2.39.3",
  "@supabase/ssr": "^0.1.0",
  "recharts": "^2.15.4",
  "embla-carousel-react": "^8.0.0",
  "react-hook-form": "^7.60.0",
  "zod": "^3.25.67"
}
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm package manager
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nuelreserve.git
   cd nuelreserve
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.local.example .env.local
   ```

   Configure your `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Database Setup**
   Run the SQL scripts in your Supabase dashboard in order:
   ```sql
   -- Run these in Supabase SQL Editor
   scripts/001_create_profiles.sql
   scripts/002_create_services.sql
   scripts/003_create_availability.sql
   scripts/004_create_bookings.sql
   scripts/005_create_reviews.sql
   scripts/006_create_favorites.sql
   scripts/007_create_notifications.sql
   scripts/008_create_messages.sql
   ```

5. **Development Server**
   ```bash
   pnpm dev
   ```

6. **Build for Production**
   ```bash
   pnpm build
   pnpm start
   ```

## 📊 Database Setup

### Schema Overview

The application uses 8 core tables:

#### Core Entities
- **`profiles`**: User profiles (customers and providers)
- **`services`**: Service offerings by providers
- **`availability`**: Time slots for services
- **`bookings`**: Service reservations

#### Enhancement Features
- **`reviews`**: Customer feedback and ratings
- **`favorites`**: User wishlists
- **`notifications`**: System alerts and updates
- **`messages`**: Real-time communication

### Key Relationships

```
profiles (users/providers)
├── services (provider offers)
│   ├── availability (time slots)
│   │   └── bookings (reservations)
│   │       ├── reviews (feedback)
│   │       └── messages (communication)
│   └── favorites (user saves)
└── notifications (alerts)
```

### Row Level Security (RLS)

All tables implement comprehensive RLS policies ensuring:
- Users can only access their own data
- Providers can manage their services and bookings
- Public read access for service discovery
- Secure message and notification delivery

## 🎨 User Experience

### Customer Journey

1. **Discovery**: Browse services with advanced filters
2. **Research**: Read reviews and check provider profiles
3. **Booking**: Real-time availability and instant confirmation
4. **Communication**: Direct messaging with providers
5. **Experience**: Seamless service delivery
6. **Feedback**: Rate and review completed services

### Provider Journey

1. **Onboarding**: Create professional service profiles
2. **Management**: Set availability and manage services
3. **Operations**: Handle bookings and customer communication
4. **Analytics**: Monitor performance and revenue
5. **Growth**: Use insights to optimize offerings

### Real-Time Features

- **Live Notifications**: Instant booking updates
- **Real-Time Chat**: Synchronous communication
- **Live Availability**: Real-time slot updates
- **Dynamic Pricing**: Flexible rate management

## 🔧 API Reference

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration
- `POST /auth/logout` - User logout

### Service Endpoints
- `GET /api/services` - List services with filters
- `GET /api/services/[id]` - Get service details
- `POST /api/services` - Create service (providers)
- `PUT /api/services/[id]` - Update service (providers)

### Booking Endpoints
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/[id]` - Update booking status

### Real-Time Subscriptions
```typescript
// Notifications
realtimeService.subscribeToNotifications(userId, callback)

// Messages
realtimeService.subscribeToMessages(userId, callback)

// Booking Updates
realtimeService.subscribeToBookingUpdates(providerId, callback)
```

## 📱 Screenshots

### Customer Experience
- **Service Discovery**: Advanced search with filters and ratings
- **Booking Flow**: Intuitive calendar and time slot selection
- **Provider Communication**: Real-time messaging interface
- **Review System**: Comprehensive rating and feedback

### Provider Dashboard
- **Analytics Overview**: Revenue charts and KPIs
- **Customer Management**: Detailed client profiles and history
- **Booking Management**: Status tracking and operations
- **Performance Metrics**: Growth trends and insights

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- **Code Style**: Follow TypeScript and ESLint rules
- **Testing**: Add tests for new features
- **Documentation**: Update README for API changes
- **Security**: Follow security best practices
- **Performance**: Optimize database queries and components

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for the amazing backend-as-a-service platform
- **Next.js** for the incredible React framework
- **shadcn/ui** for beautiful, accessible components
- **Recharts** for powerful data visualization
- **The Open Source Community** for inspiration and tools

---

**Built with ❤️ for seamless service experiences**

*Transforming service booking into a delightful, professional experience for everyone involved.*
