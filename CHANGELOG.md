# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Enhanced Enquiry Details popup:
  - Modern and visually appealing design
  - Sections for contact info, event details, products, and extras
  - Gradient accents and smooth animations
  - Action buttons for email, PDF download, and print
  - All sections expanded by default for better UX
  - Status indicators with appropriate colors
  - Better organization of information
- Search and filter features in enquiries section:
  - Search by name, email, or event type
  - Filter by status, event type, and date
  - Clean white background integration
  - Real-time filtering
- Dashboard improvements:
  - Click on recent enquiry opens enhanced details popup
  - Popular tents navigation to tent section
  - Better visual hierarchy
- Custom Material-UI toast notifications
  - Success, error, warning, and info variants
  - White theme with colored accents
  - Bottom-right positioning
  - Auto-dismiss functionality
  - Subtle animations and transitions
  - Used for all important events
    - Login success/failure
    - Product CRUD operations
    - Tent type operations
    - Logout notifications
    - Form validation warnings
- Improved logout functionality
  - Added toast notifications sequence
  - Proper delay before navigation
  - Better error handling
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
- Admin Dashboard Structure
  - Core features implemented:
    - Dashboard overview with stats
    - Tent management (CRUD)
    - Tent type management
    - Extras management
  - Placeholder sections added:
    - Enquiries management (coming soon)
    - Analytics dashboard (coming soon)
    - Settings panel (coming soon)
  - Mock data for demonstration:
    - Recent enquiries preview
    - Popular tent types statistics
    - Total visitors count
- Enhanced Database Schema
  - Added enum types for extras:
    - CHECKBOX for simple extras
    - QUANTITY for countable items
    - TOGGLE_WITH_QUANTITY for complex selections
  - Implemented table relationships
  - Added comprehensive RLS policies
- Improved Authentication System
  - Session persistence across page reloads
  - Protected route implementation
  - Admin user creation script
  - Role-based access control
- Enhanced landing page animations and interactions
  - Added smooth guest count animation in quote generator
  - Added initial animation state handling
  - Improved spacing between hero and features sections
  - Updated CTA button navigation to payment page
- Enhanced enquiry management system:
  - Added status management functionality with new statuses:
    - New Enquiry (info)
    - In Discussion (warning)
    - Quote Sent (secondary)
    - Confirmed (success)
    - Cancelled (error)
  - Added status change menu in enquiries list
  - Added status chip in enquiry details dialog
- Real-time dashboard components:
  - Added RecentEnquiries component showing latest enquiries
  - Added PopularTentTypes component showing most selected tent types
  - Added real-time data fetching from Supabase
  - Added loading states and error handling
  - Added empty state messages
  - Added visual enhancements (gradients, animations, hover effects)

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
  - Removed redundant logout button from header
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
- Improved sidebar logout interaction
  - Added hover effect with error color
  - Better visual feedback
  - Consistent toast notifications
- Refined InstantQuoteGenerator component
  - Fixed initial guest count animation
  - Added isFirstLoad state for better animation control
  - Improved animation timing and transitions
  - Enhanced visual feedback during animations
- Updated landing page layout
  - Increased spacing between hero and features sections
  - Improved visual hierarchy and readability
  - Better component transitions
- Enhanced QuoteBuilder UI/UX:
  - Improved empty state with animated tent icon and better messaging
  - Added dashed borders and hover effects for selected tents
  - Enhanced visual hierarchy with better typography and spacing
  - Improved extras display in product cards
  - Added price tooltips for quantity sliders
  - Removed total extras price display for cleaner UI
  - Added "Selected" badge for shortlisted tents
  - Improved Next button styling and positioning
  - Made extras section conditionally visible (only on tent selection page)
- Improved dashboard layout:
  - Reorganized dashboard components for better visual hierarchy
  - Made Recent Enquiries and Popular Tents boxes equal width
  - Removed duplicate components
  - Enhanced responsive design
- Enhanced enquiry submission:
  - Fixed column name mismatches in database schema
  - Updated form field names to match database
  - Added proper error handling
  - Added success confirmation
- Updated status management:
  - Changed status labels to be more event-focused
  - Improved status color coding
  - Enhanced status change UX

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
- Toast notification system
  - Fixed hook usage in non-component code
  - Improved toast message visibility
  - Fixed timing issues with navigation
- Fixed enquiry submission issues:
  - Corrected column name mismatches (eventType to event_type)
  - Fixed telephone/phone field inconsistency
  - Added missing created_at field
- Fixed dashboard duplication:
  - Removed duplicate Recent Enquiries and Popular Tents boxes
  - Fixed component rendering logic
- Fixed data fetching:
  - Added proper error handling
  - Added loading states
  - Added empty state handling

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