# Backend API Documentation

## Authentication System

### Three User Roles

- **User**: Regular customers looking to hire workers
- **Worker**: Service providers (plumbers, electricians, etc.)
- **Admin**: Platform administrators

## Job Categories for Workers

- plumber
- electrician
- carpenter
- painter
- cleaner
- gardener
- mechanic
- ac-technician
- appliance-repair
- pest-control
- home-renovation
- moving-services
- other

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register

**POST** `/api/auth/register`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "role": "user|worker|admin",
  "workerProfile": {
    // Required if role is "worker"
    "jobCategories": ["plumber", "electrician"],
    "experience": 5,
    "hourlyRate": 50,
    "skills": ["pipe fixing", "electrical wiring"],
    "availability": "full-time",
    "serviceAreas": ["New York", "Brooklyn"]
  }
}
```

#### Login

**POST** `/api/auth/login`

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Verify OTP

**POST** `/api/auth/verify-otp`

```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

#### Other Auth Routes

- **POST** `/api/auth/resend-otp`
- **POST** `/api/auth/forgot-password`
- **POST** `/api/auth/reset-password`
- **POST** `/api/auth/change-password` (Protected)
- **GET** `/api/auth/me` (Protected)

---

### Worker Routes (`/api/workers`)

#### Public Routes

**GET** `/api/workers`
Query Parameters:

- `jobCategory`: Filter by job category
- `minRate`: Minimum hourly rate
- `maxRate`: Maximum hourly rate
- `availability`: Filter by availability
- `serviceArea`: Filter by service area
- `search`: Search by name, bio, or skills

**GET** `/api/workers/:id` - Get specific worker details

#### Protected Routes (Worker Only)

**GET** `/api/workers/profile/me` - Get own profile

**PUT** `/api/workers/profile/me` - Update profile

```json
{
  "jobCategories": ["plumber"],
  "experience": 6,
  "hourlyRate": 55,
  "skills": ["pipe fixing", "drain cleaning"],
  "availability": "part-time",
  "serviceAreas": ["Manhattan"],
  "bio": "Expert plumber with 6 years experience",
  "phone": "+1234567890"
}
```

**GET** `/api/workers/stats/me` - Get worker statistics

---

### Admin Routes (`/api/admin`)

All routes require admin authentication.

#### User Management

**GET** `/api/admin/users`
Query Parameters:

- `role`: Filter by role (user|worker|admin)
- `isVerified`: Filter verified users
- `isActive`: Filter active users
- `search`: Search by name or email
- `page`: Page number
- `limit`: Results per page

**PUT** `/api/admin/users/:id/status` - Activate/Deactivate user

```json
{
  "isActive": true
}
```

**DELETE** `/api/admin/users/:id` - Delete user

#### Worker Management

**GET** `/api/admin/workers/pending` - Get workers pending approval

**PUT** `/api/admin/workers/:id/approval` - Approve/Reject worker

```json
{
  "isApproved": true
}
```

#### Dashboard Stats

**GET** `/api/admin/stats` - Get dashboard statistics
Returns:

- Total users, workers, admins
- Approved/pending workers
- Verified/active users

#### Job Category Management

**POST** `/api/admin/job-categories`

```json
{
  "name": "HVAC Technician",
  "description": "Heating, ventilation, and air conditioning services",
  "icon": "hvac-icon-url"
}
```

**GET** `/api/admin/job-categories` - Get all categories

**PUT** `/api/admin/job-categories/:id` - Update category

**DELETE** `/api/admin/job-categories/:id` - Delete category

---

## Middleware

### Authentication

- `protect`: Verify JWT token
- `isVerified`: Check if user email is verified
- `authorize(...roles)`: Check if user has required role
- `isWorkerApproved`: Check if worker is approved by admin

### Usage Example

```javascript
router.get(
  "/workers/profile/me",
  protect,
  authorize("worker"),
  getWorkerProfile
);
router.get("/admin/stats", protect, authorize("admin"), getDashboardStats);
```

---

## User Model Fields

### Common Fields

- name, email, password
- phone, avatar, bio
- role, isVerified, isActive
- createdAt, updatedAt

### Worker-Specific Fields (workerProfile)

- jobCategories: Array of job types
- experience: Years of experience
- hourlyRate: Hourly rate
- skills: Array of skills
- certifications: Array of certification objects
- availability: full-time|part-time|weekends|flexible
- serviceAreas: Array of service locations
- isApproved: Admin approval status
- rating: Average rating (0-5)
- totalJobs: Total jobs count
- completedJobs: Completed jobs count

---

## Environment Variables Required

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```
