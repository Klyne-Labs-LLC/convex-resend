# Klyne Labs - Pulse Email Testing Platform

A comprehensive email testing and management platform built with **Convex** and **Resend**. This application provides a full-featured dashboard for sending, tracking, and analyzing emails with modern UI components and real-time monitoring.

## ✨ Features

### 🔐 Authentication
- **Secure Authentication**: Password-based authentication with Convex Auth
- **Protected Routes**: All dashboard routes require authentication
- **User Management**: Profile management with email domain verification

### 📧 Email Management
- **Advanced Email Composer**: Rich text editor with templates and recipient management
- **Email History**: Searchable history with delivery status tracking
- **Real-time Analytics**: Comprehensive metrics for email performance
- **Template System**: Pre-built email templates for common use cases

### 🎨 Modern UI/UX
- **Multiple Themes**: 4+ custom themes (Bubblegum, Catppuccin, Neo-Brutalism, Perpetuity)
- **Dark Mode**: Complete dark mode support with theme persistence
- **Responsive Design**: Mobile-first design with collapsible sidebar
- **shadcn/ui Components**: Consistent, accessible UI component library

### 🚀 Technical Features
- **Real-time Updates**: Live email status updates via webhooks
- **Type Safety**: Full TypeScript coverage with strict typing
- **Testing Framework**: Vitest setup with UI testing capabilities
- **Modern Stack**: React 19, Vite, Tailwind CSS v4

## 🛠 Tech Stack

### Backend
- **[Convex](https://convex.dev/)** - Backend-as-a-Service (database + server logic)
- **[Convex Auth](https://labs.convex.dev/auth/)** - Authentication with password provider
- **[Resend Component](https://www.convex.dev/components/resend)** - Email delivery with advanced features:
  - ⚡ **Queueing & Batching**: Automatic email batching for efficient delivery
  - 🔄 **Durable Execution**: Guaranteed delivery with retry mechanisms
  - 🛡️ **Idempotency**: Prevents duplicate emails with automatic key management
  - 📊 **Rate Limiting**: Built-in Resend API rate limit handling
  - 📈 **Event Tracking**: Webhook integration for delivery status monitoring

### Frontend
- **[React 19](https://react.dev/)** - Latest React with modern features
- **[TypeScript](https://www.typescriptlang.org/)** - Full type safety
- **[Vite](https://vitejs.dev/)** - Fast build tool and dev server
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[React Router v6](https://reactrouter.com/)** - Client-side routing
- **[shadcn/ui](https://ui.shadcn.com/)** - High-quality component library

### Development & Testing
- **[Vitest](https://vitest.dev/)** - Fast unit testing framework
- **[ESLint](https://eslint.org/)** - Code linting with strict rules
- **[Prettier](https://prettier.io/)** - Code formatting
- **TypeScript Strict Mode** - Maximum type safety

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Resend account with verified domain

### Installation

1. **Clone and install dependencies:**
```bash
git clone https://github.com/Klyne-Labs-LLC/pulse-engine.git
cd resend-demo
npm install
```

2. **Set up Convex Auth:**
```bash
npx @convex-dev/auth
```

3. **Configure environment variables:**
```bash
# Set your Resend API key
npx convex env set RESEND_API_KEY "<your-resend-api-key>"

# Get your Convex site URL for webhook configuration
npx convex env get CONVEX_SITE_URL

# Set webhook secret from your Resend dashboard
npx convex env set RESEND_WEBHOOK_SECRET "<your-webhook-secret>"
```

4. **Start development servers:**
```bash
# Starts both frontend (Vite) and backend (Convex) in parallel
npm run dev

# Or start individually:
npm run dev:frontend  # Vite dev server
npm run dev:backend   # Convex dev server
```

5. **Access the application:**
   - Frontend: `http://localhost:5173`
   - Convex Dashboard: Automatically opened via `predev` script

## 📱 Application Structure

### Routes
- `/dashboard` - Main dashboard with email stats and quick send
- `/send-email` - Advanced email composer with templates
- `/email-history` - Searchable email history with status tracking
- `/analytics` - Comprehensive email performance metrics  
- `/settings` - Account management and theme selection
- `/resources` - Documentation and helpful links
- `/help` - User support and troubleshooting

### Key Components
- **Dashboard Layout**: Responsive sidebar with navigation
- **Email Composer**: Rich editing experience with templates
- **Theme System**: Dynamic theme loading with localStorage persistence
- **Analytics Charts**: Real-time email performance visualization

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start both frontend and backend
npm run predev       # Full setup with Convex dashboard

# Build & Deploy
npm run build        # TypeScript compilation + Vite build
npm run preview      # Preview built application

# Code Quality
npm run lint         # TypeScript check + ESLint (max 0 warnings)

# Testing
npm run test         # Run tests with Vitest
npm run test:ui      # Visual test UI
npm run test:run     # Run tests once
```

## 📧 Email Configuration

### Domain Requirements
- **Authentication**: Sign in with email from your verified Resend domain
- **From Address**: Uses authenticated user's email and name
- **Test Addresses**: Use `delivered@resend.dev`, `bounced@resend.dev`, `complained@resend.dev`

### Webhook Setup
1. Get your Convex site URL: `npx convex env get CONVEX_SITE_URL`
2. Configure webhook in Resend dashboard: `<CONVEX_SITE_URL>/api/resend/webhook`
3. Set webhook secret: `npx convex env set RESEND_WEBHOOK_SECRET "<secret>"`

## 🎨 Theming System

### Available Themes
- **Bubblegum** - Playful pink and purple gradients
- **Catppuccin** - Soothing pastel color palette  
- **Neo-Brutalism** - Bold, high-contrast design
- **Perpetuity** - Classic, timeless styling

### Adding Custom Themes
1. Create new CSS file in `src/themes/`
2. Define CSS custom properties for colors
3. File automatically detected and added to theme selector

## 🔒 Security & Best Practices

- **Authentication**: Secure password-based auth with Convex Auth
- **Environment Variables**: Sensitive data stored in Convex environment
- **Type Safety**: Comprehensive TypeScript coverage
- **Data Validation**: Zod schemas for runtime type checking
- **Rate Limiting**: Built-in Resend API rate limiting

## 📊 Database Schema

```typescript
// Users table (generated by Convex Auth)
users: {
  _id: Id<"users">,
  email: string,
  name: string,
  // ... other auth fields
}

// Email tracking
emails: {
  _id: Id<"emails">,
  userId: Id<"users">,
  emailId: string, // Resend email ID
  // ... indexed by userId for efficient queries
}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📚 Resources

### Convex
- [Convex Documentation](https://docs.convex.dev/)
- [Convex Auth Guide](https://labs.convex.dev/auth/)
- [Convex Discord Community](https://convex.dev/community)

### Resend
- [Resend Documentation](https://resend.com/docs)
- [Resend Component Guide](https://www.convex.dev/components/resend)

### Frontend
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Guide](https://reactrouter.com/docs)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by Klyne Labs**
