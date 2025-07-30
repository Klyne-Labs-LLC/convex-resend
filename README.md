# Pulse Email Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Convex](https://img.shields.io/badge/Convex-FF6154?logo=convex&logoColor=white)](https://convex.dev/)
[![Resend](https://img.shields.io/badge/Resend-000000?logo=resend&logoColor=white)](https://resend.com/)

> Enterprise-grade email infrastructure testing and management platform built on modern serverless architecture.

## Overview

Pulse is a production-ready email testing and analytics platform designed for enterprise development teams. Built with Convex's serverless backend-as-a-service and Resend's email infrastructure, it provides comprehensive email delivery testing, real-time monitoring, and performance analytics with enterprise-grade reliability and security.

### Key Capabilities

- **Enterprise Authentication** - OAuth2-compliant authentication with role-based access control
- **Email Infrastructure Testing** - Comprehensive email delivery testing with detailed analytics
- **Real-time Monitoring** - Live delivery status tracking with webhook integration
- **Performance Analytics** - Advanced metrics and reporting for email campaigns
- **Multi-tenant Architecture** - Secure isolation with domain-based access control
- **Enterprise UI/UX** - Professional interface with accessibility compliance

## Architecture

### Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Frontend** | React | 19.x | Modern reactive UI framework |
| **Type Safety** | TypeScript | 5.7.x | Static type checking and IDE support |
| **Build System** | Vite | 6.x | High-performance build tooling |
| **Backend** | Convex | 1.23.x | Serverless backend infrastructure |
| **Authentication** | Convex Auth | 0.0.81 | Enterprise authentication provider |
| **Email Service** | Resend | Latest | Transactional email infrastructure |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS framework |
| **UI Components** | shadcn/ui | Latest | Accessible component library |
| **Routing** | React Router | 6.x | Client-side routing solution |
| **Testing** | Vitest | 3.x | Unit and integration testing |

### Infrastructure Features

#### Convex Serverless Backend
- **Automatic Scaling** - Zero-configuration horizontal scaling
- **Real-time Subscriptions** - Live data synchronization across clients
- **ACID Transactions** - Guaranteed data consistency
- **Built-in Caching** - Optimized query performance
- **Edge Distribution** - Global CDN for low-latency access

#### Resend Email Infrastructure
- **High Deliverability** - Industry-leading inbox placement rates
- **Queue Management** - Automatic batching and retry mechanisms
- **Rate Limiting** - Built-in throttling to prevent API abuse
- **Webhook Integration** - Real-time delivery status notifications
- **Idempotency** - Guaranteed exactly-once delivery semantics

## Getting Started

### System Requirements

- **Node.js** 18.x or higher (LTS recommended)
- **npm** 8.x or higher / **yarn** 1.22.x or higher
- **Git** 2.x or higher
- **Resend Account** with verified sending domain

### Installation

```bash
# Clone the repository
git clone https://github.com/Klyne-Labs-LLC/pulse-engine.git
cd pulse-engine

# Install dependencies
npm install

# Configure environment
npm run setup
```

### Environment Configuration

```bash
# Initialize Convex authentication
npx @convex-dev/auth

# Configure Resend API credentials
npx convex env set RESEND_API_KEY "re_xxxxxxxxxxxxxxxxxx"

# Retrieve webhook endpoint URL
npx convex env get CONVEX_SITE_URL

# Configure webhook security
npx convex env set RESEND_WEBHOOK_SECRET "whsec_xxxxxxxxxxxxxxxxxx"
```

### Development Workflow

```bash
# Start development environment
npm run dev                 # Parallel frontend + backend development
npm run dev:frontend        # Frontend development server only
npm run dev:backend         # Backend development server only

# Pre-development setup
npm run predev             # Full environment setup + dashboard

# Code quality assurance
npm run lint               # TypeScript + ESLint validation
npm run test               # Unit and integration tests
npm run test:ui            # Interactive test runner

# Production builds
npm run build              # Optimized production build
npm run preview            # Preview production build locally
```

## Application Architecture

### Route Hierarchy

```
/                          # Root redirect to dashboard
├── /dashboard             # Executive summary and quick actions
├── /send-email            # Advanced email composition interface
├── /email-history         # Comprehensive delivery tracking
├── /analytics             # Performance metrics and insights
├── /settings              # Account configuration and preferences
├── /resources             # Documentation and API references
└── /help                  # Support resources and troubleshooting
```

### Component Architecture

```
src/
├── components/
│   ├── ui/                # Base UI component library (shadcn/ui)
│   ├── auth/              # Authentication flow components
│   ├── layout/            # Application layout and navigation
│   └── pages/             # Route-specific page components
├── services/              # Business logic and API integrations
├── hooks/                 # Reusable React hooks
├── themes/                # CSS custom property definitions
└── types/                 # TypeScript type definitions
```

### Security Architecture

- **Authentication** - JWT-based authentication with secure token management
- **Authorization** - Role-based access control with domain verification
- **Data Validation** - Runtime type checking with Zod schemas
- **API Security** - Rate limiting and request validation
- **Environment Isolation** - Secure environment variable management

## Email Infrastructure Configuration

### Domain Verification Requirements

For production deployment, configure the following DNS records:

```dns
# SPF Record
TXT @ "v=spf1 include:_spf.resend.com ~all"

# DKIM Record
TXT resend._domainkey "v=DKIM1; k=rsa; p=[PUBLIC_KEY]"

# DMARC Record
TXT _dmarc "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### Webhook Configuration

Configure the following webhook endpoint in your Resend dashboard:

```
Endpoint: https://[your-convex-site-url]/api/resend/webhook
Events: email.sent, email.delivered, email.bounced, email.complained
Secret: [RESEND_WEBHOOK_SECRET]
```

### Test Environment Setup

For development and testing, use these Resend test addresses:

- `delivered@resend.dev` - Simulates successful delivery
- `bounced@resend.dev` - Simulates hard bounce
- `complained@resend.dev` - Simulates spam complaint

## Data Schema

### Database Design

```typescript
// User Management (Convex Auth)
interface User {
  _id: Id<"users">
  email: string
  name: string
  emailVerified: boolean
  role: "admin" | "user"
  createdAt: number
  updatedAt: number
}

// Email Tracking
interface EmailRecord {
  _id: Id<"emails">
  userId: Id<"users">
  resendEmailId: string
  subject: string
  recipient: string
  status: "queued" | "sent" | "delivered" | "bounced" | "complained"
  createdAt: number
  deliveredAt?: number
}

// Analytics Aggregation
interface EmailMetrics {
  _id: Id<"metrics">
  userId: Id<"users">
  date: string
  sent: number
  delivered: number
  bounced: number
  complained: number
  deliveryRate: number
}
```

### Query Optimization

All database queries are optimized with appropriate indexes:

```typescript
// Optimized queries by user
emails.index("by_user", ["userId"])
emails.index("by_user_status", ["userId", "status"])
emails.index("by_user_date", ["userId", "createdAt"])
```

## Theme System

### Available Themes

| Theme | Description | Use Case |
|-------|-------------|----------|
| **Default** | Clean, professional design | Corporate environments |
| **Bubblegum** | Vibrant, modern aesthetic | Creative teams |
| **Catppuccin** | Soothing, developer-focused | Technical teams |
| **Neo-Brutalism** | Bold, high-contrast design | Design-forward organizations |
| **Perpetuity** | Timeless, accessible design | Enterprise compliance |

### Custom Theme Development

Create custom themes by extending the CSS custom property system:

```css
/* src/themes/custom.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* Additional custom properties */
}
```

## Performance Benchmarks

### Core Web Vitals

- **First Contentful Paint (FCP)**: < 1.2s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms

### Email Delivery Performance

- **Queue Processing**: < 100ms average
- **Delivery Latency**: < 5s to major providers
- **Webhook Response**: < 200ms average
- **Analytics Update**: Real-time via Convex subscriptions

## Deployment

### Production Deployment

```bash
# Build for production
npm run build

# Deploy to Convex
npx convex deploy

# Configure production environment variables
npx convex env set --prod RESEND_API_KEY "your_production_key"
npx convex env set --prod RESEND_WEBHOOK_SECRET "your_production_secret"
```

### Environment Management

| Environment | Purpose | Configuration |
|-------------|---------|---------------|
| **Development** | Local development | `.env.local` |
| **Staging** | Pre-production testing | Convex staging deployment |
| **Production** | Live application | Convex production deployment |

### Monitoring and Observability

- **Application Monitoring** - Real-time performance metrics
- **Error Tracking** - Comprehensive error logging and alerting
- **Email Analytics** - Delivery and engagement tracking
- **User Analytics** - Usage patterns and feature adoption

## API Reference

### Authentication Endpoints

```typescript
// Sign up new user
POST /api/auth/signup
Body: { email: string, password: string, name: string }

// Authenticate user
POST /api/auth/signin
Body: { email: string, password: string }

// Sign out user
POST /api/auth/signout
Headers: { Authorization: "Bearer <token>" }
```

### Email Management Endpoints

```typescript
// Send email
POST /api/emails/send
Headers: { Authorization: "Bearer <token>" }
Body: { to: string, subject: string, html: string }

// Get email history
GET /api/emails/history
Headers: { Authorization: "Bearer <token>" }
Query: { limit?: number, offset?: number, status?: string }

// Get email analytics
GET /api/emails/analytics
Headers: { Authorization: "Bearer <token>" }
Query: { startDate?: string, endDate?: string }
```

## Contributing

### Development Standards

- **Code Style** - Prettier + ESLint configuration
- **Type Safety** - Strict TypeScript compilation
- **Testing** - Minimum 80% code coverage
- **Documentation** - Comprehensive JSDoc comments
- **Git Workflow** - Conventional commit messages

### Pull Request Process

1. **Fork** the repository
2. **Create** feature branch: `git checkout -b feature/FEATURE_NAME`
3. **Implement** changes with appropriate tests
4. **Validate** code quality: `npm run lint && npm run test`
5. **Commit** using conventional commits
6. **Submit** pull request with detailed description

### Code Review Criteria

- [ ] Functionality meets requirements
- [ ] Code follows established patterns
- [ ] Tests provide adequate coverage
- [ ] Documentation is updated
- [ ] Performance impact is acceptable
- [ ] Security considerations are addressed

## Support

### Enterprise Support

For enterprise customers requiring dedicated support:

- **Email**: support@klynelabs.com
- **SLA**: 4-hour response time
- **Escalation**: Technical account manager
- **Documentation**: Enterprise knowledge base

### Community Support

- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: Community Q&A and best practices
- **Discord**: Real-time community support

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

**© 2025 Klyne Labs LLC. All rights reserved.**

*Enterprise-grade solutions for modern development teams.*