# Cloudinary Image Upload - API Testing Guide

## Quick Start Testing

### Prerequisites
1. Backend server running on `http://localhost:5000`
2. Valid JWT token (login first to get token)
3. Cloudinary credentials set in `.env` file

---

## Test Using Postman

### 1. Get JWT Token First

**Login Request:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

Body:
{
  "email": "your@email.com",
  "password": "yourpassword"
}
```

**Copy the token from response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

### 2. Test Avatar Upload

**Request:**
```
POST http://localhost:5000/api/upload/avatar
Authorization: Bearer YOUR_JWT_TOKEN
```

**In Postman:**
1. Select POST method
2. URL: `http://localhost:5000/api/upload/avatar`
3. Headers tab:
   - Key: `Authorization`
   - Value: `Bearer YOUR_JWT_TOKEN`
4. Body tab:
   - Select `form-data`
   - Key: `avatar` (change type to File)
   - Value: Select image file
5. Click Send

**Expected Response:**
```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "data": {
    "avatar": "https://res.cloudinary.com/.../image.jpg",
    "user": {
      "_id": "...",
      "name": "...",
      "avatar": "https://res.cloudinary.com/.../image.jpg"
    }
  }
}
```

### 3. Test Portfolio Upload (Workers)

**Request:**
```
POST http://localhost:5000/api/upload/portfolio
Authorization: Bearer YOUR_JWT_TOKEN
```

**In Postman:**
1. Body tab → form-data
2. Add multiple rows with key: `portfolio` (File type)
3. Select different image files for each row
4. Click Send

### 4. Test Single Image Upload

**Request:**
```
POST http://localhost:5000/api/upload/single
Authorization: Bearer YOUR_JWT_TOKEN
```

**In Postman:**
1. Body tab → form-data
2. Key: `image` (File type)
3. Value: Select image file
4. Click Send

### 5. Test Multiple Images Upload

**Request:**
```
POST http://localhost:5000/api/upload/multiple
Authorization: Bearer YOUR_JWT_TOKEN
```

**In Postman:**
1. Body tab → form-data
2. Add multiple rows with key: `images` (File type)
3. Select image files
4. Click Send

### 6. Test Image Deletion

**Request:**
```
DELETE http://localhost:5000/api/upload/karigar-app/IMAGE_PUBLIC_ID
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Test Using cURL

### Avatar Upload
```bash
curl -X POST http://localhost:5000/api/upload/avatar \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "avatar=@/path/to/your/image.jpg"
```

### Portfolio Upload
```bash
curl -X POST http://localhost:5000/api/upload/portfolio \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "portfolio=@/path/to/image1.jpg" \
  -F "portfolio=@/path/to/image2.jpg" \
  -F "portfolio=@/path/to/image3.jpg"
```

### Single Image Upload
```bash
curl -X POST http://localhost:5000/api/upload/single \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/your/image.jpg"
```

### Delete Image
```bash
curl -X DELETE http://localhost:5000/api/upload/karigar-app/abc123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Test Using HTML Form

```html
<!DOCTYPE html>
<html>
<head>
  <title>Image Upload Test</title>
</head>
<body>
  <h1>Test Image Upload</h1>
  
  <h2>Upload Avatar</h2>
  <input type="file" id="avatarFile" accept="image/*">
  <button onclick="uploadAvatar()">Upload Avatar</button>
  
  <h2>Upload Portfolio (Multiple)</h2>
  <input type="file" id="portfolioFiles" accept="image/*" multiple>
  <button onclick="uploadPortfolio()">Upload Portfolio</button>
  
  <div id="result"></div>

  <script>
    const token = 'YOUR_JWT_TOKEN'; // Replace with actual token
    
    async function uploadAvatar() {
      const file = document.getElementById('avatarFile').files[0];
      if (!file) return alert('Please select a file');
      
      const formData = new FormData();
      formData.append('avatar', file);
      
      try {
        const response = await fetch('http://localhost:5000/api/upload/avatar', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        
        const data = await response.json();
        document.getElementById('result').innerHTML = 
          `<h3>Result:</h3><pre>${JSON.stringify(data, null, 2)}</pre>
           <img src="${data.data?.avatar}" width="200">`;
      } catch (error) {
        alert('Upload failed: ' + error.message);
      }
    }
    
    async function uploadPortfolio() {
      const files = document.getElementById('portfolioFiles').files;
      if (files.length === 0) return alert('Please select files');
      
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('portfolio', file);
      });
      
      try {
        const response = await fetch('http://localhost:5000/api/upload/portfolio', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        
        const data = await response.json();
        document.getElementById('result').innerHTML = 
          `<h3>Result:</h3><pre>${JSON.stringify(data, null, 2)}</pre>`;
      } catch (error) {
        alert('Upload failed: ' + error.message);
      }
    }
  </script>
</body>
</html>
```

---

## Common Test Scenarios

### Scenario 1: Valid Image Upload
- File: JPG, PNG, GIF, or WEBP
- Size: Under 5MB
- Expected: Success response with Cloudinary URL

### Scenario 2: Invalid File Type
- File: PDF, DOC, etc.
- Expected: Error "Only image files are allowed!"

### Scenario 3: File Too Large
- File: Over 5MB
- Expected: Error about file size limit

### Scenario 4: No Token
- Request without Authorization header
- Expected: 401 Unauthorized error

### Scenario 5: Invalid Token
- Request with wrong/expired token
- Expected: 401 Unauthorized error

### Scenario 6: Worker Portfolio (Non-Worker User)
- User role: "user" or "admin"
- Endpoint: /api/upload/portfolio
- Expected: 403 Forbidden "Only workers can upload portfolio images"

### Scenario 7: Multiple Images
- Files: 10 images at once
- Expected: Success with array of 10 URLs

---

## Verification Checklist

After upload, verify:

✅ Response has success: true  
✅ Response includes Cloudinary URL  
✅ URL starts with https://res.cloudinary.com  
✅ Image opens in browser when URL is visited  
✅ Database is updated (check MongoDB)  
✅ Avatar appears in user profile (for avatar upload)  
✅ Portfolio array is updated (for portfolio upload)  

---

## Debugging Tips

### Check Server Logs
Look for these messages:
```
Upload error: [error details]
Cloudinary configuration error
```

### Check Cloudinary Dashboard
1. Go to https://cloudinary.com/console
2. Click Media Library
3. Check if images appear in `karigar-app` folder
4. Verify upload count and storage usage

### Common Errors and Solutions

**"Invalid token"**
- Token might be expired
- Login again to get new token
- Check token format: `Bearer TOKEN`

**"Cloudinary configuration error"**
- Check .env file has correct credentials
- Restart server after updating .env

**"User not found"**
- Token might be for deleted user
- Create new user and login again

**"Network error" / "CORS error"**
- Check backend server is running
- Verify URL is correct
- Check network connectivity

---

## Performance Testing

### Test with Different Image Sizes

```bash
# Small image (100KB)
curl -X POST http://localhost:5000/api/upload/avatar \
  -H "Authorization: Bearer TOKEN" \
  -F "avatar=@small.jpg"

# Medium image (1MB)
curl -X POST http://localhost:5000/api/upload/avatar \
  -H "Authorization: Bearer TOKEN" \
  -F "avatar=@medium.jpg"

# Large image (4MB)
curl -X POST http://localhost:5000/api/upload/avatar \
  -H "Authorization: Bearer TOKEN" \
  -F "avatar=@large.jpg"

# Too large (6MB) - Should fail
curl -X POST http://localhost:5000/api/upload/avatar \
  -H "Authorization: Bearer TOKEN" \
  -F "avatar=@toolarge.jpg"
```

### Test with Multiple Formats

```bash
# JPG
curl -X POST http://localhost:5000/api/upload/single \
  -H "Authorization: Bearer TOKEN" \
  -F "image=@test.jpg"

# PNG
curl -X POST http://localhost:5000/api/upload/single \
  -H "Authorization: Bearer TOKEN" \
  -F "image=@test.png"

# GIF
curl -X POST http://localhost:5000/api/upload/single \
  -H "Authorization: Bearer TOKEN" \
  -F "image=@test.gif"

# WEBP
curl -X POST http://localhost:5000/api/upload/single \
  -H "Authorization: Bearer TOKEN" \
  -F "image=@test.webp"
```

---

## Sample Test Data

Create test images of different sizes:

```bash
# Using ImageMagick (if installed)
convert -size 100x100 xc:blue small.jpg      # ~10KB
convert -size 1000x1000 xc:green medium.jpg  # ~100KB
convert -size 3000x3000 xc:red large.jpg     # ~1MB
```

Or download test images from:
- https://picsum.photos/200 (small)
- https://picsum.photos/1000 (medium)
- https://picsum.photos/3000 (large)

---

## Integration Testing Checklist

Before deploying to production:

- [ ] Test all upload endpoints
- [ ] Test with different image formats
- [ ] Test with different file sizes
- [ ] Test authentication (valid/invalid tokens)
- [ ] Test role-based access (worker portfolio)
- [ ] Test error handling (invalid files, large files)
- [ ] Verify images appear on Cloudinary dashboard
- [ ] Verify database is updated correctly
- [ ] Test image deletion
- [ ] Check frontend integration works
- [ ] Verify URLs are accessible
- [ ] Test with slow network connection
- [ ] Check file upload limits work
- [ ] Verify CORS is configured correctly

---

## Next Steps

1. ✅ Complete all tests above
2. ✅ Verify images appear in Cloudinary
3. ✅ Check database has correct URLs
4. ✅ Test frontend integration
5. 🎉 Ready for production!
