# Cheshire Tent Rentals - SaaS Platform

A comprehensive SaaS platform for tent rental service companies to manage their tent rentals and tent rental services. Built with modern web technologies, this platform provides both customer-facing booking tools and powerful admin management capabilities.

## 🚀 Features

### Customer-Facing Features

#### **Tent Rental Planning Wizard**
- **Multi-step Tent Rental Configuration**
  - Event details collection (date, venue, guest count)
  - Interactive tent selection with real-time pricing
  - Customizable extras and add-ons with dynamic pricing
  - Contact information and preferences collection
  - Real-time quote builder with instant calculations
  - Dynamic pricing based on event size and seasonality

#### **Landing Page & Marketing**
- **Hero Section** with animated quote generator
- **Features Showcase** highlighting platform benefits
- **Call-to-Action** sections for lead generation
- **Responsive Design** optimized for all devices
- **Interactive Elements** with smooth animations

#### **Quote Generation System**
- **Instant Quote Generator** with live calculations
- **Dynamic Pricing Engine** considering:
  - Event size and guest count
  - Seasonal pricing adjustments
  - Tent type and capacity requirements
  - Additional extras and services
- **Real-time Updates** as selections change
- **Professional Quote Presentation**

### Admin Dashboard

#### **Comprehensive Management System**
- **Dashboard Overview**
  - Real-time statistics and KPIs
  - Total visitors tracking (estimated from enquiries)
  - New enquiries counter (new + pending status)
  - Inventory management metrics
  - Popular tent types analytics

- **Tent Inventory Management**
  - Full CRUD operations for tent products
  - Tent type categorization and management
  - Image upload and management
  - Pricing and availability control
  - Status tracking (available, booked, maintenance)

- **Extras & Add-ons Management**
  - Multiple extra types support:
    - **CHECKBOX**: Simple yes/no extras
    - **RANGE**: Quantity-based extras with min/max limits
    - **TOGGLE_WITH_QUANTITY**: Complex options with multiple choices
  - Dynamic pricing per unit
  - Flexible configuration options
  - Status management

- **Advanced Enquiry Management**
  - **Modern Interface** with expandable details
  - **Status Workflow**: new → in_discussion → quote_sent → confirmed/cancelled
  - **Advanced Search & Filtering** by status, event type, date
  - **Real-time Status Updates** with color-coded indicators
  - **Detailed Enquiry View** with all customer information
  - **Action Capabilities**: Email, PDF export, print functionality

- **Analytics & Reporting**
  - Recent enquiries overview
  - Popular tent types with booking statistics
  - Performance metrics and trends
  - Data visualization components

### Technical Features

#### **Modern Tech Stack**
- **Frontend**: React 18+ with TypeScript
- **UI Framework**: Material-UI (MUI) with custom theming
- **Icons**: Lucide React for consistent iconography
- **Routing**: React Router v6 for SPA navigation
- **Date Handling**: DayJS for robust date operations
- **State Management**: React Context API for global state
- **Animations**: Framer Motion for smooth interactions

#### **Backend & Database**
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with RLS
- **Real-time**: Live data synchronization
- **Security**: Row Level Security (RLS) policies
- **Storage**: Supabase Storage for file uploads
- **Migrations**: Version-controlled database schema

#### **Development & Build**
- **Build Tool**: Vite for fast development and building
- **Linting**: ESLint with TypeScript support
- **Styling**: Tailwind CSS + PostCSS
- **Type Safety**: Full TypeScript implementation
- **Environment**: Configurable environment variables

## 🛠 Tech Stack

### Frontend Technologies
- **React 18.3.1** - Modern React with hooks and concurrent features
- **TypeScript 5.5.3** - Type-safe JavaScript development
- **Material-UI 5.15.10** - Comprehensive React component library
- **Lucide React 0.344.0** - Beautiful, customizable icons
- **React Router 6.22.1** - Declarative routing for React
- **DayJS 1.11.10** - Lightweight date manipulation library
- **Framer Motion 12.4.2** - Production-ready motion library
- **Radix UI Toast 1.2.6** - Accessible toast notifications

### Backend & Database
- **Supabase 2.39.7** - Open source Firebase alternative
- **PostgreSQL** - Robust relational database
- **Row Level Security (RLS)** - Database-level security
- **Real-time Subscriptions** - Live data updates
- **Supabase Auth** - Authentication and authorization
- **Supabase Storage** - File storage and management

### Development Tools
- **Vite 5.4.2** - Next generation frontend tooling
- **ESLint 9.9.1** - Code linting and quality
- **PostCSS 8.5.1** - CSS transformation tool
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Autoprefixer 10.4.20** - CSS vendor prefixing

## 📋 Prerequisites

- **Node.js 18+** and npm
- **Supabase CLI** installed globally:
  ```bash
  npm install -g supabase
  ```
- **Git** for version control
- **Supabase Account** and project setup

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Authority98/saas-for-event-service-companies.git
   cd saas-for-event-service-company
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Update Supabase credentials:
     ```env
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Database Setup**
   ```bash
   supabase init
   supabase db push
   ```

5. **Create Admin User** (Optional)
   ```bash
   npm run create-admin
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build optimized production bundle
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally
- `npm run type-check` - Run TypeScript type checking

## 🌍 Environment Variables

### Required Variables
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Optional Variables
- `VITE_API_URL` - Custom API URL (defaults to Supabase URL)
- `VITE_APP_NAME` - Application name for branding
- `NODE_ENV` - Environment mode (development/production)

## 🗄️ Database Schema

### Core Tables

#### **products**
Tent inventory management
- `id` (uuid, primary key)
- `name` (text, required)
- `description` (text, optional)
- `price` (numeric, required)
- `size` (text, optional)
- `type` (text, required) - References tent_types
- `image_url` (text, optional)
- `status` (enum: available, booked, maintenance)
- `created_at`, `updated_at` (timestamps)

#### **tent_types**
Tent categorization and specifications
- `id` (uuid, primary key)
- `name` (text, required)
- `description` (text, optional)
- `capacity` (integer, required)
- `features` (text array, optional)
- `image_url` (text, optional)
- `status` (enum: active, inactive)
- `created_at`, `updated_at` (timestamps)

#### **extras**
Additional services and add-ons
- `id` (uuid, primary key)
- `name` (text, required)
- `description` (text, optional)
- `type` (enum: CHECKBOX, RANGE, TOGGLE_WITH_QUANTITY)
- `price` (numeric, optional) - For simple extras
- `price_per_unit` (numeric, optional) - For quantity-based
- `min_quantity`, `max_quantity` (integer, optional)
- `left_label`, `right_label` (text, optional) - For toggle switches
- `options` (jsonb, optional) - For complex configurations
- `status` (enum: active, inactive)
- `created_at`, `updated_at` (timestamps)

#### **enquiries**
Customer enquiries and bookings
- `id` (uuid, primary key)
- `name` (text, required)
- `email` (text, required)
- `telephone` (text, required)
- `event_type` (text, required)
- `event_date` (date, required)
- `venue_location` (text, optional)
- `total_guests` (integer, optional)
- `formal_dining_seats` (integer, optional)
- `selected_products` (jsonb, optional) - Tent selections
- `selected_extras` (jsonb, optional) - Extra services
- `comments` (text, optional)
- `send_brochure` (boolean, default false)
- `status` (text, default 'pending') - new, in_discussion, quote_sent, confirmed, cancelled
- `created_at`, `updated_at` (timestamps)

### Security & Access Control
- **Row Level Security (RLS)** enabled on all tables
- **Anonymous access** for public data (products, tent_types, extras)
- **Authenticated access** for admin operations
- **Secure policies** for data isolation and protection

## 🔐 Security Features

### Authentication & Authorization
- **Supabase Auth** integration with secure session management
- **Protected Routes** for admin dashboard access
- **Role-based Access Control** with RLS policies
- **Secure Password Policies** and session handling
- **JWT Token Management** with automatic refresh

### Data Protection
- **Row Level Security (RLS)** at database level
- **Input Validation** and sanitization
- **SQL Injection Prevention** through parameterized queries
- **XSS Protection** with proper data handling
- **CORS Configuration** for secure API access

## 🚀 Deployment

### Production Build
1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Database Migrations**
   ```bash
   supabase db push
   ```

3. **Environment Configuration**
   - Set production environment variables
   - Configure Supabase production project
   - Update CORS settings for production domain

### Deployment Options
- **Static Hosting**: Deploy `dist` folder to Vercel, Netlify, or similar
- **Container Deployment**: Docker containerization support
- **CDN Integration**: For optimal global performance
- **SSL Certificates**: HTTPS enforcement for security

### Post-Deployment Verification
- ✅ Environment variables configured
- ✅ Database connections established
- ✅ Authentication flows tested
- ✅ Admin dashboard accessible
- ✅ Customer booking flow functional
- ✅ Error logging and monitoring setup

## 📝 Development Guidelines

### Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── Admin/           # Admin dashboard components
│   ├── Dashboard/       # Dashboard-specific components
│   ├── EventForm/       # Event booking components
│   ├── Landing/         # Landing page components
│   ├── Layout/          # Common layout components
│   ├── Quote/           # Quote builder components
│   └── ui/              # Base UI components
├── contexts/            # React context providers
├── lib/                 # Utility functions and configs
├── pages/               # Page components
├── scripts/             # Setup and utility scripts
└── types/               # TypeScript type definitions
```

### Code Standards
- **TypeScript First**: All components and functions typed
- **Component Composition**: Reusable, composable components
- **Error Handling**: Comprehensive error boundaries and handling
- **Loading States**: Proper loading and skeleton states
- **Accessibility**: WCAG compliance and keyboard navigation
- **Performance**: Optimized rendering and data fetching

### State Management
- **React Context** for global application state
- **Local State** with useState for component-specific data
- **Custom Hooks** for reusable stateful logic
- **Error Boundaries** for graceful error handling
- **Loading States** for better user experience

## 🧪 Testing Strategy

### Current Status
- **Manual Testing**: Comprehensive manual testing implemented
- **Type Safety**: Full TypeScript coverage for compile-time checks
- **Linting**: ESLint configuration for code quality

### Planned Testing Implementation
- **Unit Tests**: Jest + React Testing Library
- **Component Tests**: Isolated component testing
- **Integration Tests**: API and database integration
- **E2E Tests**: Cypress for full user journey testing
- **Performance Tests**: Lighthouse and Core Web Vitals

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes with semantic messages (`git commit -m 'feat: add amazing feature'`)
4. **Push** to your branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request with detailed description

### Commit Guidelines
- **feat**: New features or functionality
- **fix**: Bug fixes and corrections
- **docs**: Documentation updates
- **style**: Code formatting and styling
- **refactor**: Code refactoring without behavior changes
- **test**: Adding or updating tests
- **chore**: Maintenance tasks and dependencies

### Code Review Process
- All changes require peer review
- Automated checks must pass (linting, type checking)
- Manual testing verification
- Documentation updates as needed

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👥 Team & Support

### Development Team
- **Frontend Development**: React/TypeScript specialists
- **Backend Development**: Supabase/PostgreSQL experts
- **UI/UX Design**: Material-UI and responsive design
- **DevOps**: Deployment and infrastructure management

### Support Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Community discussions and Q&A
- **Email Support**: [support@cheshiretentevents.com]
- **Documentation**: Comprehensive guides and API docs

## 🎯 Roadmap

### Upcoming Features
- **Advanced Analytics**: Detailed reporting and insights
- **Payment Integration**: Stripe/PayPal payment processing
- **Email Automation**: Automated quote and follow-up emails
- **Mobile App**: React Native mobile application
- **API Documentation**: Comprehensive API documentation
- **Multi-tenant Support**: Support for multiple event companies

### Performance Improvements
- **Code Splitting**: Lazy loading for better performance
- **Caching Strategy**: Redis caching for frequently accessed data
- **Image Optimization**: WebP support and lazy loading
- **Bundle Optimization**: Tree shaking and dead code elimination

---

**Built with ❤️ for tent rental service companies worldwide**