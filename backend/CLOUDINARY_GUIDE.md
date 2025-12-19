# Cloudinary Image Upload Integration Guide

## Overview

This application uses Cloudinary for cloud-based image storage and delivery. All uploaded images are stored on Cloudinary's CDN and URLs are saved in the MongoDB database.

## Table of Contents

1. [Setup](#setup)
2. [Features](#features)
3. [API Endpoints](#api-endpoints)
4. [Frontend Integration](#frontend-integration)
5. [Configuration](#configuration)
6. [Troubleshooting](#troubleshooting)

---

## Setup

### 1. Create Cloudinary Account

1. Visit [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account (free tier includes 25GB storage and 25GB bandwidth)
3. Verify your email address

### 2. Get Your Credentials

After logging in to your Cloudinary dashboard:

1. Go to **Dashboard** (default page after login)
2. You'll see your credentials:
   - **Cloud Name:** e.g., `dxxxxx`
   - **API Key:** e.g., `123456789012345`
   - **API Secret:** Click "Reveal" to see it

### 3. Configure Environment Variables

Add these to your `.env` file in the backend directory:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Example:**
```env
CLOUDINARY_CLOUD_NAME=dxyz12345
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdef1234567890abcdef
```

### 4. Install Dependencies

The required packages are already included in package.json:

```bash
npm install
```

This installs:
- `cloudinary` - Cloudinary SDK
- `multer` - File upload handling
- `multer-storage-cloudinary` - Cloudinary storage engine for multer

---

## Features

### Supported Image Operations

✅ **Profile Avatar Upload** - Single profile picture per user  
✅ **Portfolio Upload** - Multiple images for worker portfolios  
✅ **General Single Image** - Upload any single image  
✅ **General Multiple Images** - Upload up to 10 images at once  
✅ **Image Deletion** - Remove images from Cloudinary  
✅ **Automatic Optimization** - Images auto-resized to 1000x1000px max  
✅ **Format Validation** - Only allows JPG, PNG, GIF, WEBP  
✅ **Size Limit** - Max 5MB per file  

### Storage Structure

All images are stored in Cloudinary under the folder: `karigar-app/`

```
karigar-app/
├── user_avatars/
├── worker_portfolios/
└── general/
```

---

## API Endpoints

Base URL: `http://localhost:5000/api/upload`

### Authentication Required

All endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

### 1. Upload Profile Avatar

**Endpoint:** `POST /api/upload/avatar`

**Description:** Upload or update user's profile picture. Automatically updates the user's avatar field in database.

**Request:**
```http
POST /api/upload/avatar HTTP/1.1
Host: localhost:5000
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

Body:
- avatar: [image file]
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "data": {
    "avatar": "https://res.cloudinary.com/dxyz12345/image/upload/v1234567890/karigar-app/abc123.jpg",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "https://res.cloudinary.com/...",
      "role": "user"
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "No file uploaded"
}
```

**Example (JavaScript):**
```javascript
const uploadAvatar = async (imageFile, token) => {
  const formData = new FormData();
  formData.append('avatar', imageFile);

  const response = await fetch('http://localhost:5000/api/upload/avatar', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  return await response.json();
};
```

---

### 2. Upload Portfolio Images (Workers Only)

**Endpoint:** `POST /api/upload/portfolio`

**Description:** Upload multiple portfolio images for workers. Only users with role='worker' can use this endpoint.

**Request:**
```http
POST /api/upload/portfolio HTTP/1.1
Host: localhost:5000
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

Body:
- portfolio: [image file 1]
- portfolio: [image file 2]
- portfolio: [image file 3]
... (up to 10 files)
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Portfolio images uploaded successfully",
  "data": {
    "portfolio": [
      {
        "url": "https://res.cloudinary.com/.../image1.jpg",
        "public_id": "karigar-app/abc123",
        "uploadedAt": "2024-12-19T10:30:00.000Z"
      },
      {
        "url": "https://res.cloudinary.com/.../image2.jpg",
        "public_id": "karigar-app/def456",
        "uploadedAt": "2024-12-19T10:30:01.000Z"
      }
    ]
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Only workers can upload portfolio images"
}
```

**Example (JavaScript):**
```javascript
const uploadPortfolio = async (imageFiles, token) => {
  const formData = new FormData();
  
  // Append multiple files
  imageFiles.forEach(file => {
    formData.append('portfolio', file);
  });

  const response = await fetch('http://localhost:5000/api/upload/portfolio', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  return await response.json();
};

// Usage with file input
const handlePortfolioUpload = async (event) => {
  const files = Array.from(event.target.files);
  const token = localStorage.getItem('token');
  const result = await uploadPortfolio(files, token);
  console.log(result);
};
```

---

### 3. Upload Single Image (General)

**Endpoint:** `POST /api/upload/single`

**Description:** Upload a single image for general purposes (not tied to user profile).

**Request:**
```http
POST /api/upload/single HTTP/1.1
Host: localhost:5000
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

Body:
- image: [image file]
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/.../image.jpg",
    "public_id": "karigar-app/xyz789"
  }
}
```

---

### 4. Upload Multiple Images (General)

**Endpoint:** `POST /api/upload/multiple`

**Description:** Upload multiple images for general purposes.

**Request:**
```http
POST /api/upload/multiple HTTP/1.1
Host: localhost:5000
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

Body:
- images: [image file 1]
- images: [image file 2]
... (up to 10 files)
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Images uploaded successfully",
  "data": [
    {
      "url": "https://res.cloudinary.com/.../image1.jpg",
      "public_id": "karigar-app/abc123"
    },
    {
      "url": "https://res.cloudinary.com/.../image2.jpg",
      "public_id": "karigar-app/def456"
    }
  ]
}
```

---

### 5. Delete Image

**Endpoint:** `DELETE /api/upload/:publicId`

**Description:** Delete an image from Cloudinary using its public_id.

**Request:**
```http
DELETE /api/upload/karigar-app/abc123 HTTP/1.1
Host: localhost:5000
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

**Example (JavaScript):**
```javascript
const deleteImage = async (publicId, token) => {
  const response = await fetch(`http://localhost:5000/api/upload/${publicId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  return await response.json();
};

// Usage
await deleteImage('karigar-app/abc123', token);
```

---

## Frontend Integration

### Complete React Example

```jsx
import React, { useState } from 'react';

const ImageUploadComponent = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('avatar', selectedFile);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/upload/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        setUploadedUrl(data.data.avatar);
        alert('Image uploaded successfully!');
      } else {
        alert('Upload failed: ' + data.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileSelect}
      />
      
      {preview && (
        <div>
          <img src={preview} alt="Preview" style={{ width: '200px' }} />
          <button onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      )}

      {uploadedUrl && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={uploadedUrl} alt="Uploaded" style={{ width: '200px' }} />
          <p>URL: {uploadedUrl}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploadComponent;
```

### Multiple Images Upload Example

```jsx
const MultipleImageUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFilesSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('portfolio', file);
    });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/upload/portfolio', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('Uploaded images:', data.data.portfolio);
        alert(`${files.length} images uploaded successfully!`);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        multiple 
        accept="image/*" 
        onChange={handleFilesSelect}
      />
      <p>Selected: {files.length} files</p>
      <button onClick={handleUpload} disabled={uploading || files.length === 0}>
        {uploading ? 'Uploading...' : `Upload ${files.length} Images`}
      </button>
    </div>
  );
};
```

---

## Configuration

### Image Upload Settings

Located in `src/middleware/upload.js`:

```javascript
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'karigar-app', // Cloudinary folder
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 1000, height: 1000, crop: 'limit' } // Max dimensions
    ],
  },
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});
```

### Customization Options

#### Change Max File Size

```javascript
limits: {
  fileSize: 10 * 1024 * 1024, // Change to 10MB
}
```

#### Change Max Images Per Upload

```javascript
router.post('/multiple', upload.array('images', 20), uploadMultipleImages);
//                                              ^^ Change from 10 to 20
```

#### Change Image Transformations

```javascript
transformation: [
  { width: 500, height: 500, crop: 'fill' }, // Square crop
  { quality: 'auto' }, // Auto quality
  { fetch_format: 'auto' } // Auto format
]
```

#### Add More Formats

```javascript
allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'],
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. "Cloudinary configuration error"

**Problem:** Missing or incorrect Cloudinary credentials

**Solution:**
- Check `.env` file has correct values
- Verify no extra spaces in credentials
- Ensure .env file is in backend root directory
- Restart server after updating .env

```bash
# Correct format
CLOUDINARY_CLOUD_NAME=dxyz12345
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdef1234567890

# Wrong - has spaces
CLOUDINARY_CLOUD_NAME = dxyz12345  ❌
```

#### 2. "Only image files are allowed"

**Problem:** Trying to upload non-image file

**Solution:**
- Ensure file is JPG, PNG, GIF, or WEBP
- Check file extension
- Verify MIME type is image/*

#### 3. "File too large"

**Problem:** File exceeds 5MB limit

**Solution:**
- Compress image before upload
- Or increase limit in `upload.js`:
```javascript
limits: {
  fileSize: 10 * 1024 * 1024, // Increase to 10MB
}
```

#### 4. "User not found" (Avatar Upload)

**Problem:** JWT token invalid or expired

**Solution:**
- Check token is valid
- Ensure user is logged in
- Token format: `Bearer YOUR_TOKEN`

#### 5. "Only workers can upload portfolio"

**Problem:** User role is not 'worker'

**Solution:**
- Verify user role in database
- Portfolio endpoint only for workers
- Use general upload for non-workers

#### 6. Images Not Displaying on Frontend

**Problem:** CORS or URL issues

**Solution:**
- Check Cloudinary URLs are complete
- Verify URLs start with `https://res.cloudinary.com`
- Check browser console for CORS errors
- Cloudinary URLs should work without CORS issues

#### 7. Upload Hangs or Times Out

**Problem:** Network issues or large file

**Solution:**
- Check internet connection
- Reduce image size
- Try smaller file first
- Check Cloudinary account is active

#### 8. "Invalid signature" Error

**Problem:** Cloudinary API secret is wrong

**Solution:**
- Verify API secret in Cloudinary dashboard
- Ensure no extra characters in .env
- Click "Reveal" in dashboard to see full secret

---

## Database Schema

### User Model Changes

The User model includes avatar and portfolio fields:

```javascript
{
  avatar: {
    type: String,
    default: "",
  },
  workerProfile: {
    // ... other fields
    portfolio: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  }
}
```

---

## Security Best Practices

1. **Never expose API credentials** - Keep in .env file only
2. **Validate file types** - Only allow image formats
3. **Limit file sizes** - Prevent large uploads (5MB limit)
4. **Require authentication** - All endpoints need JWT token
5. **Rate limiting** - Consider adding rate limits for uploads
6. **Input validation** - Validate all user inputs
7. **Error handling** - Don't expose sensitive error details

---

## Cloudinary Free Tier Limits

- **Storage:** 25 GB
- **Bandwidth:** 25 GB/month
- **Transformations:** 25,000/month
- **Images/Videos:** Unlimited

For most small to medium applications, the free tier is sufficient.

---

## Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Multer Documentation](https://github.com/expressjs/multer)
- [Image Optimization Guide](https://cloudinary.com/documentation/image_optimization)

---

## Support

For issues or questions:
1. Check this documentation
2. Review Cloudinary dashboard for quota/errors
3. Check server logs for error messages
4. Verify environment variables are set correctly
