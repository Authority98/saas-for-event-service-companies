# Event+ SaaS Platform

A modern SaaS platform for event service companies to manage their tent rentals and event services.

## 🚀 Features

### Customer-Facing Features
- **Event Planning Wizard**
  - Step-by-step event details collection
  - Interactive tent selection
  - Customizable extras and add-ons
  - Contact information collection
  - Real-time quote builder
  - Dynamic pricing calculation

### Admin Dashboard
- **Comprehensive Management**
  - Tent inventory management
  - Tent type categorization
  - Extras/Add-ons management
  - Enquiry tracking
  - Real-time statistics
  - Recent enquiries overview
  - Popular tent types analytics

### Technical Features
- **Modern Tech Stack**
  - React + TypeScript
  - Material-UI (MUI)
  - Supabase for backend
  - Real-time data sync
  - Row Level Security (RLS)
  - Responsive design
  - Form validation
  - Type safety

## 🛠 Tech Stack

- **Frontend**
  - React 18+
  - TypeScript
  - Material-UI (MUI)
  - Lucide Icons
  - React Router v6
  - DayJS for date handling
  - Context API for state management

- **Backend & Database**
  - Supabase
  - PostgreSQL
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Database migrations
  - Secure authentication

- **Development**
  - Vite
  - ESLint
  - TypeScript
  - Git
  - PostCSS
  - Tailwind CSS
  - Environment variables

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd saas-for-event-service-company
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Update Supabase credentials:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Database Setup**
   ```bash
   supabase init
   supabase db push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Schema

### Tables
1. **products**
   - Stores tent inventory
   - Fields: id, name, description, price, size, type, image_url, created_at, updated_at

2. **tent_types**
   - Categorizes different tent styles
   - Fields: id, name, description, image_url, created_at, updated_at

3. **extras**
   - Additional rental items
   - Fields: id, name, description, type, category, price, options, created_at, updated_at
   - Supports multiple types: CHECKBOX, QUANTITY, TOGGLE_WITH_QUANTITY

4. **enquiries**
   - Customer enquiries and bookings
   - Fields: id, name, email, event_type, event_date, venue_location, total_guests, formal_dining_seats, selected_products, selected_extras, status, created_at, updated_at

## 🔐 Security

- **Authentication**
  - Admin authentication via Supabase Auth
  - Secure login system
  - Protected routes
  - Session management
  - Secure password policies

- **Authorization**
  - Row Level Security (RLS) policies
  - Role-based access control
  - Public/Private data separation
  - Secure API endpoints

## 🚀 Deployment

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Database Migrations**
   ```bash
   supabase db push
   ```

3. **Deploy Frontend**
   - Deploy the `dist` folder to your hosting provider
   - Configure environment variables
   - Set up SSL certificates
   - Configure CORS policies

## 📝 Development Guidelines

### Code Structure
- `src/components/` - Reusable UI components
  - `Admin/` - Admin dashboard components
  - `Dashboard/` - Dashboard UI components
  - `EventForm/` - Event booking components
  - `Layout/` - Common layout components
  - `Quote/` - Quote builder components
- `src/pages/` - Page components
- `src/contexts/` - React contexts
- `src/lib/` - Utility functions and configurations
- `src/types/` - TypeScript type definitions

### Component Guidelines
- Use TypeScript interfaces for props
- Implement proper error handling
- Follow Material-UI best practices
- Maintain consistent styling
- Use proper form validation
- Implement loading states
- Handle edge cases

### State Management
- Use React Context for global state
- Local state with useState
- Proper data fetching patterns
- Error boundary implementation
- Loading state management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- Development Team
- Project Managers
- Designers

## 📞 Support

For support, email [support@email.com] 