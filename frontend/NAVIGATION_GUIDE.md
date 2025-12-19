# 🎯 Karigar MVP - Quick Navigation Guide

## 🏠 Landing Page
**URL**: `/`

**What to see**:
- Hero section with search bar
- 8 service category cards
- "How It Works" section (3 steps)
- Why Choose Karigar features
- Call-to-action sections

**Actions**:
- Click "Browse Services Now" button
- Click any service category card

---

## 🔍 Browse Services
**URL**: `/browse`

**What to see**:
- Filter section (Category + Location dropdowns)
- Grid of service provider cards
- Provider details: name, category, rating, location, services, price
- "View Profile" buttons

**Actions**:
- Filter by category (Plumber, Electrician, etc.)
- Filter by location (Indiranagar, Koramangala, etc.)
- Click any provider card

---

## 👤 Provider Profile
**URL**: `/provider/:id`

**What to see**:
- Provider header (name, photo, rating, contact)
- About section
- Services offered
- Customer reviews
- Pricing and availability (sidebar)
- "Request Service" button

**Actions**:
- Click "Request Service" button

---

## 📝 Request Service
**URL**: `/request-service/:id`

**What to see**:
- Provider info card
- Service selection dropdown
- Date picker
- Time picker
- Description textarea
- Availability info

**Actions**:
- Fill form and submit
- See success message
- Auto-redirect to bookings

---

## 📋 My Bookings (Customer View)
**URL**: `/customer/bookings`

**What to see**:
- Status filter buttons (All, Requested, Confirmed, Completed, Cancelled)
- List of bookings with:
  - Service name and category
  - Provider name
  - Date and time
  - Status badge
  - Price (if available)
- "View Provider" button
- "Write Review" button (for completed bookings)

**Actions**:
- Filter by status
- Click "Write Review" for completed booking

---

## ⭐ Write Review
**URL**: `/review/:bookingId`

**What to see**:
- Booking details summary
- Interactive star rating (1-5 stars)
- Review text area
- Submit button

**Actions**:
- Click stars to rate
- Write review
- Submit

---

## 🔄 Switch to Provider Role
**Action**: Click user icon (top right) → Select "Service Provider"

---

## 📊 Provider Dashboard
**URL**: `/provider/dashboard`

**What to see**:
- 4 stat cards:
  - Pending Requests
  - Confirmed Bookings
  - Completed Jobs
  - Total Earnings
- Recent bookings list
- Quick action cards

**Actions**:
- Click "View all" on pending requests
- Click "Manage Requests"
- Click "Update Profile"
- Click "Booking History"

---

## 📥 Service Requests (Provider View)
**URL**: `/provider/requests`

**What to see**:
- List of incoming requests
- Customer name and details
- Service description
- Date/time
- Status badges
- Action buttons: Accept, Reschedule, Reject

**Actions**:
- Click "Accept" - Shows confirmation modal
- Click "Reschedule" - Shows date/time picker modal
- Click "Reject" - Shows confirmation modal

---

## 🔧 Manage Profile (Provider View)
**URL**: `/provider/profile`

**What to see**:
- Personal Information section:
  - Name, Email, Phone, Location
- Service Information section:
  - Category dropdown
  - Services offered (comma-separated)
  - Price range
  - Availability
  - Bio/description
- Reset and Save buttons

**Actions**:
- Edit any field
- Click "Save Changes" - Shows success message
- Click "Reset Changes" - Restores original values

---

## 📜 Booking History (Provider View)
**URL**: `/provider/history`

**What to see**:
- 3 stat cards (Total Bookings, Completed Jobs, Total Earnings)
- Status filter buttons
- List of all bookings:
  - Customer name
  - Service details
  - Date/time
  - Status
  - Earnings

**Actions**:
- Filter by status

---

## 🔄 Switch to Admin Role
**Action**: Click user icon (top right) → Select "Admin"

---

## 🛡️ Admin Dashboard
**URL**: `/admin/dashboard`

**What to see**:
- 5 stat cards:
  - Total Users
  - Providers
  - Bookings
  - Reviews
  - Pending Reports
- 4 tabs:
  1. **Users Tab**: Table with name, email, phone, role, joined date, status
  2. **Service Listings Tab**: Table with provider, category, location, rating, reviews, price
  3. **Reviews Tab**: Cards with customer name, rating, comment, date
  4. **Reports Tab**: Cards with reporter, reason, status, action buttons

**Actions**:
- Click tabs to switch views
- In Reports tab: Click "Resolve" button for pending reports

---

## 🎨 Role-Specific Navigation

### Customer Navigation (Top Bar)
- Browse Services
- My Bookings
- [User Icon with role]

### Provider Navigation (Top Bar)
- Dashboard
- Service Requests
- My Profile
- History
- [User Icon with role]

### Admin Navigation (Top Bar)
- Dashboard
- [User Icon with role]

---

## 📱 Mobile Responsive Features

**All pages adapt to mobile**:
- Hamburger menu on mobile
- Stacked layouts
- Touch-friendly buttons
- Responsive tables (horizontal scroll if needed)
- Mobile-optimized filters

---

## 🎯 Key User Flows to Test

### Flow 1: Customer Books a Service
1. Start at Landing (/)
2. Click "Browse Services"
3. Select any provider
4. Click "Request Service"
5. Fill form and submit
6. View in "My Bookings"

### Flow 2: Provider Manages Requests
1. Switch to "Service Provider" role
2. View Dashboard stats
3. Go to "Service Requests"
4. Accept a pending request (modal opens)
5. Confirm acceptance
6. View in "Booking History"

### Flow 3: Customer Reviews Service
1. Switch to "Customer" role
2. Go to "My Bookings"
3. Filter by "Completed"
4. Click "Write Review"
5. Rate with stars and add comment
6. Submit review

### Flow 4: Admin Monitors Platform
1. Switch to "Admin" role
2. View dashboard statistics
3. Click "Users" tab - see all users
4. Click "Service Listings" tab - see providers
5. Click "Reviews" tab - see customer feedback
6. Click "Reports" tab - handle issues

---

## 🔍 Data to Look For

### Mock Customers
- Arjun Mehta (has 3 bookings)
- Meera Iyer (has 2 bookings)

### Top-Rated Providers
- Priya Sharma (Electrician) - 4.9 ⭐
- Vikram Singh (Tutor) - 4.9 ⭐
- Sunita Rao (Cleaner) - 4.9 ⭐

### Service Categories
- Plumber (2 providers)
- Cleaner (2 providers)
- Electrician, Carpenter, Painter, Tutor, AC Repair, Pest Control (1 each)

---

## 💡 Pro Tips

1. **Role Switching**: Use this to see how the same data appears to different users
2. **Filters Work**: Try filtering services by category and location
3. **Status Badges**: Color-coded for easy identification
4. **Responsive**: Resize browser to see mobile view
5. **Mock Data**: All data is static but realistic

---

## 🎨 UI Elements to Notice

- **Color System**: Blue (primary), Green (success), Yellow (pending), Red (cancelled)
- **Icons**: Consistent Lucide icons throughout
- **Hover Effects**: Subtle animations on cards and buttons
- **Status Badges**: Rounded pills with appropriate colors
- **Star Ratings**: Yellow stars with numeric value
- **Modals**: Clean overlays for confirmations
- **Cards**: Consistent shadow and border styling

---

## 🚀 Quick Links Summary

| Page | URL | Who Can Access |
|------|-----|----------------|
| Landing | `/` | Everyone |
| Browse | `/browse` | Everyone |
| Provider Profile | `/provider/:id` | Everyone |
| Request Service | `/request-service/:id` | Customers |
| My Bookings | `/customer/bookings` | Customers |
| Review | `/review/:bookingId` | Customers |
| Provider Dashboard | `/provider/dashboard` | Providers |
| Manage Profile | `/provider/profile` | Providers |
| Service Requests | `/provider/requests` | Providers |
| Booking History | `/provider/history` | Providers |
| Admin Dashboard | `/admin/dashboard` | Admins |

---

**Happy Exploring! 🎉**

*Remember: All data is mock - changes won't persist after page refresh*
