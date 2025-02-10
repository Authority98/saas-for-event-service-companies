# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Decorative gradient borders to all dashboard cards
  - Added to stat boxes with alternating gradient directions
  - Consistent gradient styling across all components
  - Enhanced visual hierarchy
- InfoItem component for displaying event details
- EventSummaryBar visibility control
  - Now only appears on tent selection page
  - Hidden in admin/dashboard area and login page
- Improved state management for event details
  - Added proper date parsing
  - Enhanced error handling
  - Added clearEventDetails functionality
- Initial project setup with React, TypeScript, and Vite
- Material-UI integration for UI components
- Supabase integration for backend services
- Authentication system with protected routes
- Admin dashboard with management features
- Event planning wizard for customers
- Real-time quote builder
- Dynamic pricing calculations
- Form validation and error handling
- Comprehensive documentation
  - Prerequisites section
  - Available scripts
  - Environment variables guide
  - Testing roadmap
  - Deployment verification steps
  - Commit guidelines
  - Support channels

### Changed
- Enhanced dashboard UI components
  - Removed pending tag from recent enquiries
  - Improved shadows and hover effects
  - Replaced light backgrounds with white + shadows
  - Better visual consistency across components
- Updated component visibility
  - Footer now hidden in admin/dashboard area
  - EventSummaryBar hidden in specific routes
  - Better route-based conditional rendering
- Updated EventSummaryBar styling
  - Black background with white text for tent type chips
  - Improved layout and spacing
  - Better responsive design
- Enhanced event details persistence
  - Better local storage handling
  - Improved state synchronization
  - Added data cleanup on unmount
- Enhanced header styling
  - Updated background color to #F5F5F5
  - Added subtle shadow effect
  - Improved visual hierarchy

### Fixed
- Real-time update issues with InfoItem component
- Event details persistence problems
- State management in EventContext
- Date parsing and handling in forms
- Initial data loading in edit forms
- Form reset on dialog close
- Type validation in form submissions
- Dialog transition smoothness
- Data refresh after operations
- Error message display
- Loading state indicators

## [0.2.0] - 2024-02-08

### Added
- Admin Dashboard Features
  - Tent management with CRUD operations
  - Tent type categorization system
  - Extras/Add-ons management
  - Popup forms for better UX
  - Form validation and error handling
  - Real-time data updates
  - Recent enquiries overview
  - Popular tent types analytics
  - Dashboard statistics

### Changed
- Enhanced form designs with better UX
  - Improved dialog component styling
  - Better state management in forms
  - Refined table layouts and actions
  - Added form validation
  - Added loading states
  - Added error handling
  - Added success feedback
  - Added confirmation dialogs

## [0.1.0] - 2024-02-07

### Added
- Database Schema
  - Products table for tent inventory
  - Tent types table for categorization
  - Extras table for additional items
  - Enquiries table for customer requests
- Row Level Security (RLS) policies
- Migration scripts for database setup
- Type definitions for all entities
- Context providers for state management
- Protected routes implementation
- Authentication flow
- Event booking wizard

### Changed
- Updated authentication flow
  - Added protected routes
  - Added session management
  - Added role-based access
- Improved data fetching patterns
  - Added loading states
  - Added error handling
  - Added data caching
- Enhanced type definitions
  - Added interfaces for all entities
  - Added type guards
  - Added utility types

### Security
- Implemented Row Level Security
  - Added policies for public access
  - Added policies for authenticated users
  - Added policies for admin users
- Added protected routes
  - Route guards for admin pages
  - Authentication checks
  - Role-based access control
- Secured API endpoints
  - Added request validation
  - Added response validation
  - Added error handling

## [0.0.1] - 2024-02-06

### Added
- Initial project structure
  - Component organization
  - Page layouts
  - Routing setup
- Basic routing setup
  - Public routes
  - Protected routes
  - Not found handling
- Core dependencies installation
  - React and React DOM
  - Material-UI
  - TypeScript
  - Vite
  - ESLint
  - Supabase Client
- Environment configuration
  - Development variables
  - Production variables
  - Type definitions
- Basic component architecture
  - Layout components
  - Form components
  - UI components

### Security
- Basic authentication setup
  - Login form
  - Authentication context
  - Session management
- Environment variable handling
  - Secure storage
  - Type safety
  - Access control 