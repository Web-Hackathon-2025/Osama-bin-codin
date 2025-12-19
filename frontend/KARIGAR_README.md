# Karigar - Hyperlocal Services Marketplace MVP

A modern, frontend-only MVP for connecting customers with nearby service providers. Built with React, TypeScript, and Tailwind CSS.

## 🎯 Project Overview

Karigar is a hyperlocal services marketplace that enables customers to find and book trusted service providers in their area. This MVP focuses on core user flows, clarity, and usability with **no backend integration** - all data is mocked.

## 🛠️ Tech Stack

- **Framework**: React 19 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Routing**: React Router v7
- **Icons**: Lucide React
- **State Management**: React Context API

## 👥 User Roles

The application supports three user roles with easy switching:

1. **Customer** - Browse services, book providers, leave reviews
2. **Service Provider** - Manage profile, handle requests, view bookings
3. **Admin** - Oversee platform operations, users, and content

## 📱 Features

### Landing Page
- Hero section with search functionality
- Service category cards
- "How It Works" section
- Feature highlights
- Call-to-action sections

### Customer Features
- **Browse Services**: Filter by category and location
- **Provider Profiles**: View detailed provider information and reviews
- **Request Service**: Submit service requests with date/time preferences
- **My Bookings**: Track all bookings with status filters
- **Write Reviews**: Rate and review completed services

### Provider Features
- **Dashboard**: Overview of requests, bookings, and earnings
- **Manage Profile**: Update services, pricing, and availability
- **Service Requests**: Accept, reject, or reschedule requests
- **Booking History**: View all confirmed and completed jobs

### Admin Features
- **Dashboard**: Platform statistics and metrics
- **User Management**: View all customers and providers
- **Service Listings**: Monitor all service providers
- **Review Moderation**: Oversee customer reviews
- **Report Management**: Handle user reports and issues

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

## 📂 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ServiceCard.tsx
│   │   ├── RatingStars.tsx
│   │   ├── StatusBadge.tsx
│   │   └── Modal.tsx
│   ├── pages/               # Page components
│   │   ├── Landing.tsx
│   │   ├── BrowseServices.tsx
│   │   ├── ProviderProfile.tsx
│   │   ├── RequestService.tsx
│   │   ├── CustomerBookings.tsx
│   │   ├── Review.tsx
│   │   ├── ProviderDashboard.tsx
│   │   ├── ManageProfile.tsx
│   │   ├── ServiceRequests.tsx
│   │   ├── BookingHistory.tsx
│   │   └── AdminDashboard.tsx
│   ├── context/             # React Context
│   │   └── UserContext.tsx
│   ├── data/                # Mock JSON data
│   │   ├── services.json
│   │   ├── providers.json
│   │   ├── bookings.json
│   │   └── reviews.json
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
└── package.json
```

## 🎨 Design System

### Color Palette
- **Primary**: #2563EB (Blue) - Trust and professionalism
- **Secondary**: #0F172A (Dark Slate) - Depth and contrast
- **Accent**: #22C55E (Green) - Success and confirmation
- **Background**: #F8FAFC (Light Slate) - Clean, modern feel
- **Text**: #1E293B (Slate) - Readable and professional

### UI Principles
- Clean and minimal design
- Generous white space
- Subtle hover animations
- Professional and trustworthy aesthetic
- Mobile-responsive layouts

## 🔄 Role Switching

To test different user perspectives:

1. Click on the user role button in the navigation bar
2. Select from Customer, Service Provider, or Admin
3. The interface will update to show role-specific pages and features

**Default Role**: Customer

## 📊 Mock Data

All data is stored in JSON files located in `src/data/`:

- **services.json**: 8 service categories (Plumber, Electrician, etc.)
- **providers.json**: 10 service providers with profiles
- **bookings.json**: 8 sample bookings with various statuses
- **reviews.json**: Sample customer reviews

## 🧭 User Flows

### Customer Journey
1. Land on homepage → Browse service categories
2. Filter services by category/location
3. View provider profile with reviews
4. Request a service with preferred date/time
5. Track booking status
6. Write review after completion

### Provider Journey
1. View dashboard with stats
2. Check pending service requests
3. Accept/reject/reschedule requests
4. Manage profile and services
5. View booking history and earnings

### Admin Journey
1. View platform statistics
2. Monitor users and providers
3. Review service listings
4. Moderate reviews
5. Handle reports and issues

## ⚙️ Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🚫 Out of Scope (Important)

This is a **frontend-only MVP**. The following are explicitly not included:

- ❌ Backend/API integration
- ❌ User authentication
- ❌ Payment processing
- ❌ Real-time updates
- ❌ GPS/Maps integration
- ❌ Database connections
- ❌ File uploads
- ❌ Email notifications

## 🎯 Evaluation Criteria

This MVP is designed to demonstrate:

✅ **Simple & Intuitive Flows**: Clear user journeys for all roles
✅ **Role Separation**: Distinct interfaces for customers, providers, and admins
✅ **Booking Lifecycle**: Complete request-to-review flow
✅ **Logical Navigation**: Easy-to-understand routing structure
✅ **Clean Data Modeling**: Well-structured TypeScript types
✅ **No Feature Overload**: Focused on core functionality
✅ **Professional UI**: Modern, trustworthy design

## 🔧 Customization

### Adding New Service Categories

Edit `src/data/services.json`:

```json
{
  "id": "cat-9",
  "name": "Your Service",
  "icon": "icon-name",
  "description": "Service description"
}
```

### Adding New Providers

Edit `src/data/providers.json` following the existing structure.

### Changing Color Scheme

Update colors in Tailwind classes throughout components, or extend the theme in your Tailwind configuration.

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1024px and above)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🐛 Known Limitations

Since this is a frontend-only MVP:
- Data changes are not persisted (page refresh resets)
- No actual email/SMS notifications
- Search is UI-only (doesn't actually filter by text)
- Location filtering uses predefined locations
- No real-time provider availability

## 🤝 Contributing

This is an MVP for demonstration purposes. If extending:

1. Consider adding proper state management (Redux, Zustand)
2. Implement local storage for persistence
3. Add form validation libraries
4. Include proper error boundaries
5. Add loading states and skeletons

## 📄 License

This project is created as an MVP demonstration.

## 👨‍💻 Development Notes

- All components use TypeScript for type safety
- Tailwind CSS is used for consistent styling
- React Router handles all navigation
- Context API manages user role state
- Lucide React provides consistent iconography

## 🎉 Getting Started - Quick Test

1. Start the app
2. Browse the landing page
3. Click "Browse Services" 
4. Select a provider and view their profile
5. Request a service
6. Switch role to "Service Provider" (top right)
7. View dashboard and manage requests
8. Switch to "Admin" role to see platform overview

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
