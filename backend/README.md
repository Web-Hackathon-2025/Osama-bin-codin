# Backend README

## Complete Authentication System with MERN Stack

This backend includes a full authentication system with:

- User registration with email OTP verification
- Login/Logout
- Forgot password with email reset link
- Change password for logged-in users
- User profile management
- JWT-based authentication

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the backend directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/your_database_name
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
JWT_EXPIRE=30d

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_digit_app_password

# Frontend URL (for password reset links)
FRONTEND_URL=http://localhost:5173

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. **Gmail Setup for Email Service:**

   - Go to your Google Account settings
   - Enable 2-Factor Authentication
   - Generate an App Password:
     - Go to Security → 2-Step Verification → App passwords
     - Select "Mail" and "Other (Custom name)"
     - Generate and copy the 16-digit password
     - Use this password in `EMAIL_PASSWORD` in .env

4. Make sure MongoDB is running on your system

5. Start the development server:

```bash
npm run dev
```

## Available Scripts

- `npm start` - Run the server in production mode
- `npm run dev` - Run the server in development mode with nodemon

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                    # MongoDB configuration
│   ├── controllers/
│   │   ├── authController.js        # Authentication logic
│   │   ├── profileController.js     # Profile management
│   │   └── exampleController.js     # Example CRUD
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification & protection
│   │   └── errorMiddleware.js       # Error handling
│   ├── models/
│   │   ├── User.js                  # User schema with auth fields
│   │   └── Example.js               # Example model
│   ├── routes/
│   │   ├── authRoutes.js            # Auth endpoints
│   │   ├── profileRoutes.js         # Profile endpoints
│   │   └── exampleRoutes.js         # Example endpoints
│   ├── services/
│   │   └── emailService.js          # Email sending service
│   └── server.js                    # Main server file
├── .env
├── .env.example
├── .gitignore
├── API_DOCUMENTATION.md              # Complete API docs
├── package.json
└── README.md
```

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /register` - Register new user (sends OTP)
- `POST /verify-otp` - Verify email with OTP
- `POST /resend-otp` - Resend OTP to email
- `POST /login` - Login user
- `POST /forgot-password` - Send password reset email
- `POST /reset-password` - Reset password with token
- `POST /change-password` - Change password (protected)
- `GET /me` - Get current user (protected)

### Profile Routes (`/api/profile`)

- `GET /` - Get user profile (protected, verified)
- `PUT /` - Update user profile (protected, verified)
- `DELETE /` - Delete user account (protected, verified)
- `GET /stats` - Get profile statistics (protected, verified)

### Example Routes (`/api/examples`)

- `GET /` - Get all examples
- `GET /:id` - Get single example
- `POST /` - Create example
- `PUT /:id` - Update example
- `DELETE /:id` - Delete example

## Features Implemented

### 🔐 Authentication System

- **Registration**: Email-based registration with OTP verification
- **OTP System**: 6-digit OTP sent via email, expires in 10 minutes
- **Email Verification**: Users must verify email before accessing protected features
- **Login**: Secure login with JWT token generation
- **Forgot Password**: Reset password via email link
- **Change Password**: Change password while logged in

### 👤 User Profile

- **Get Profile**: Retrieve user information
- **Update Profile**: Update name, phone, bio, avatar
- **Delete Account**: Delete user account with password confirmation
- **Profile Stats**: View account statistics and completeness

### 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected routes middleware
- Email verification requirement
- Token expiration handling
- Secure password reset flow

### 📧 Email Service

- OTP verification emails
- Password reset emails
- Welcome emails after verification
- Professional HTML email templates

## Authentication Flow

1. **Register** → User signs up → OTP sent to email
2. **Verify OTP** → User enters OTP → Email verified → JWT token issued
3. **Login** → User logs in → JWT token issued
4. **Access Protected Routes** → JWT token in Authorization header

## Password Reset Flow

1. **Forgot Password** → User enters email → Reset link sent
2. **Click Reset Link** → User redirected with token
3. **Reset Password** → User enters new password → Password updated

## Testing the API

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for detailed API documentation with examples.

### Quick Test with cURL:

**Register:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

**Login:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Get Profile (with token):**

```bash
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Environment Variables Explained

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `NODE_ENV` - Environment (development/production)
- `JWT_SECRET` - Secret key for JWT signing (change in production!)
- `JWT_EXPIRE` - JWT expiration time (e.g., 30d, 7d, 24h)
- `EMAIL_USER` - Gmail address for sending emails
- `EMAIL_PASSWORD` - Gmail app password (16 digits)
- `FRONTEND_URL` - Frontend URL for reset links
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret

## Notes

- Change `JWT_SECRET` in production to a secure random string
- Use environment variables, never commit `.env` file
- Email service uses Gmail - ensure app password is set up correctly
- OTP expires in 10 minutes
- Password reset token expires in 1 hour
- JWT tokens expire in 30 days by default

## Troubleshooting

**Email not sending:**

- Verify Gmail app password is correct (16 digits, no spaces)
- Check if 2FA is enabled on Google account
- Verify `EMAIL_USER` and `EMAIL_PASSWORD` in .env

**MongoDB connection error:**

- Ensure MongoDB is running
- Check `MONGODB_URI` is correct
- Verify network connectivity

**JWT errors:**

- Ensure `JWT_SECRET` is set in .env

## 📸 Cloudinary Image Upload Integration

This backend includes full Cloudinary integration for handling image uploads. Images are uploaded to Cloudinary and the URLs are stored in MongoDB.

### Cloudinary Setup

1. **Create a Cloudinary Account:**
   - Go to [https://cloudinary.com](https://cloudinary.com)
   - Sign up for a free account
   - Navigate to Dashboard to get your credentials

2. **Get Your Credentials:**
   - Cloud Name: Found in your dashboard (e.g., `dxxxxx`)
   - API Key: Found in your dashboard (e.g., `123456789012345`)
   - API Secret: Found in your dashboard (click "Reveal" to see it)

3. **Add to .env file:**
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### Image Upload Features

The backend supports the following image upload functionalities:

1. **Profile Avatar Upload** - Single profile picture for users
2. **Portfolio Upload** - Multiple images for worker portfolios
3. **General Purpose Upload** - Single or multiple images for any use
4. **Image Deletion** - Delete images from Cloudinary

### Upload Endpoints (`/api/upload`)

All upload endpoints require authentication (`Authorization: Bearer TOKEN`)

#### 1. Upload Profile Avatar

```http
POST /api/upload/avatar
Content-Type: multipart/form-data

Body:
- avatar: [image file]
```

**Response:**
```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "data": {
    "avatar": "https://res.cloudinary.com/...jpg",
    "user": { /* updated user object */ }
  }
}
```

#### 2. Upload Portfolio Images (Workers)

```http
POST /api/upload/portfolio
Content-Type: multipart/form-data

Body:
- portfolio: [image files] (up to 10 files)
```

**Response:**
```json
{
  "success": true,
  "message": "Portfolio images uploaded successfully",
  "data": {
    "portfolio": [
      {
        "url": "https://res.cloudinary.com/...jpg",
        "public_id": "karigar-app/xxx",
        "uploadedAt": "2024-12-19T..."
      }
    ]
  }
}
```

#### 3. Upload Single Image (General)

```http
POST /api/upload/single
Content-Type: multipart/form-data

Body:
- image: [image file]
```

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/...jpg",
    "public_id": "karigar-app/xxx"
  }
}
```

#### 4. Upload Multiple Images (General)

```http
POST /api/upload/multiple
Content-Type: multipart/form-data

Body:
- images: [image files] (up to 10 files)
```

**Response:**
```json
{
  "success": true,
  "message": "Images uploaded successfully",
  "data": [
    {
      "url": "https://res.cloudinary.com/...jpg",
      "public_id": "karigar-app/xxx"
    }
  ]
}
```

#### 5. Delete Image

```http
DELETE /api/upload/:publicId
```

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

### Image Upload Configuration

- **Supported Formats:** JPG, JPEG, PNG, GIF, WEBP
- **Max File Size:** 5MB per file
- **Max Images:** 10 files per request (for multiple uploads)
- **Auto Optimization:** Images are automatically resized to max 1000x1000px
- **Storage Folder:** All images stored in `karigar-app` folder on Cloudinary

### Frontend Integration Example

```javascript
// Upload avatar
const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await fetch('http://localhost:5000/api/upload/avatar', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  const data = await response.json();
  return data;
};

// Upload portfolio (multiple images)
const uploadPortfolio = async (files) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('portfolio', file);
  });

  const response = await fetch('http://localhost:5000/api/upload/portfolio', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  const data = await response.json();
  return data;
};
```

### Database Schema Updates

The User model now includes:

1. **Avatar field** (String) - Stores Cloudinary URL for profile picture
2. **Portfolio field** (Array) - Stores multiple portfolio images with:
   - `url`: Cloudinary image URL
   - `public_id`: Cloudinary public ID for deletion
   - `uploadedAt`: Timestamp of upload

### Cloudinary Features Used

- **Automatic Format Conversion:** Images optimized for web
- **CDN Delivery:** Fast global image delivery
- **Transformation:** Automatic resizing and optimization
- **Secure Storage:** Images stored securely in the cloud
- **Easy Deletion:** Remove images using public_id

### Troubleshooting Cloudinary

**Upload fails:**
- Verify Cloudinary credentials in .env
- Check file size is under 5MB
- Ensure file is a valid image format
- Verify network connectivity

**Images not displaying:**
- Check if URL is correctly saved in database
- Verify Cloudinary account is active
- Check CORS settings on Cloudinary dashboard

**Deletion fails:**
- Ensure public_id is correct format
- Verify API credentials have deletion permissions
- Check token format: `Bearer <token>`
- Verify token hasn't expired
