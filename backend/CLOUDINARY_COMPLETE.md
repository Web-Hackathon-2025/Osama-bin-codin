## ✅ Cloudinary Backend Integration - Complete!

Your Cloudinary backend integration has been successfully implemented and configured!

### 📦 What's Been Implemented

1. **Cloudinary Configuration** ([src/config/cloudinary.js](d:/WebCompetion/backend/src/config/cloudinary.js))
   - SDK initialized with your credentials
   - Cloud Name: `dv7naw4hi`

2. **Upload Middleware** ([src/middleware/upload.js](d:/WebCompetion/backend/src/middleware/upload.js))
   - File size limit: 5MB
   - Supported formats: JPG, JPEG, PNG, GIF, WEBP
   - Auto-resize to 1000x1000px max
   - Storage folder: `karigar-app/`

3. **Upload Controller** ([src/controllers/uploadController.js](d:/WebCompetion/backend/src/controllers/uploadController.js))
   - 5 fully functional endpoints

4. **API Routes** ([src/routes/uploadRoutes.js](d:/WebCompetion/backend/src/routes/uploadRoutes.js))
   - All routes require authentication
   - Integrated with Express server

5. **Database Updates** ([src/models/User.js](d:/WebCompetion/backend/src/models/User.js))
   - User avatar field added
   - Worker portfolio array added

### 🔌 API Endpoints

All endpoints require: `Authorization: Bearer YOUR_JWT_TOKEN`

#### 1. **Upload Single Image**
```
POST http://localhost:5000/api/upload/single
Content-Type: multipart/form-data

Body: form-data
  - image: [file]
```

#### 2. **Upload Multiple Images** 
```
POST http://localhost:5000/api/upload/multiple
Content-Type: multipart/form-data

Body: form-data
  - images: [file1]
  - images: [file2]
  - ...up to 10 files
```

#### 3. **Upload Avatar**
```
POST http://localhost:5000/api/upload/avatar
Content-Type: multipart/form-data

Body: form-data
  - avatar: [file]

Response: Updates user.avatar in database
```

#### 4. **Upload Portfolio** (Workers Only)
```
POST http://localhost:5000/api/upload/portfolio
Content-Type: multipart/form-data

Body: form-data
  - portfolio: [file1]
  - portfolio: [file2]
  - ...up to 10 files

Response: Updates user.workerProfile.portfolio in database
```

#### 5. **Delete Image**
```
DELETE http://localhost:5000/api/upload/:publicId

Example: DELETE http://localhost:5000/api/upload/karigar-app/abc123
```

### 🧪 Testing Instructions

**Option 1: Using Postman (Recommended)**

1. **Get Auth Token:**
   - POST `http://localhost:5000/api/auth/register`
   - Body (JSON):
     ```json
     {
       "name": "Test Worker",
       "email": "worker@test.com",
       "password": "Test123!",
       "role": "worker"
     }
     ```
   - Copy the `token` from response

2. **Upload Image:**
   - POST `http://localhost:5000/api/upload/single`
   - Headers: `Authorization: Bearer YOUR_TOKEN`
   - Body: form-data
   - Key: `image`, Type: File, Value: [select your image]
   - Click Send

3. **Verify:**
   - Check response for Cloudinary URL
   - Visit: https://cloudinary.com/console/media_library
   - Look in `karigar-app/` folder

**Option 2: Using cURL**

```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"Test123!","role":"worker"}'

# 2. Login (if already registered)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!"}'

# 3. Upload (replace YOUR_TOKEN and image.jpg)
curl -X POST http://localhost:5000/api/upload/single \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@image.jpg"
```

**Option 3: Using Frontend Integration**

Once your frontend uploads are ready, you can integrate by:
1. Get the JWT token from AuthContext
2. Use FormData to append files
3. Send POST request with Authorization header

Example:
```javascript
const formData = new FormData();
formData.append('image', file);

const response = await fetch('http://localhost:5000/api/upload/single', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

### 📊 Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/dv7naw4hi/image/upload/v1234567890/karigar-app/xyz.jpg",
    "public_id": "karigar-app/xyz",
    "uploadedAt": "2025-12-19T05:00:00.000Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message here"
}
```

### 🔍 Troubleshooting Server Connection

If you're experiencing "Unable to connect" errors:

1. **Verify server is running:**
   ```bash
   cd d:\WebCompetion\backend
   npm run dev
   ```
   You should see: "Server is running on port 5000"

2. **Try alternate localhost:**
   - Replace `localhost` with `127.0.0.1`
   - Example: `http://127.0.0.1:5000/api/auth/login`

3. **Check Windows Firewall:**
   - Search "Windows Defender Firewall"
   - Allow Node.js through firewall

4. **Test from browser:**
   - Open: http://localhost:5000/
   - Should see server response (even if it's an error page, it proves connection works)

5. **Check port availability:**
   ```powershell
   Get-NetTCPConnection -LocalPort 5000
   ```

6. **Restart server:**
   - Stop current server (Ctrl+C in terminal)
   - Run `npm run dev` again

### 📚 Additional Documentation

- [CLOUDINARY_GUIDE.md](d:/WebCompetion/backend/CLOUDINARY_GUIDE.md) - Complete implementation guide
- [CLOUDINARY_TESTING.md](d:/WebCompetion/backend/CLOUDINARY_TESTING.md) - Testing procedures  
- [CLOUDINARY_IMPLEMENTATION_SUMMARY.md](d:/WebCompetion/backend/CLOUDINARY_IMPLEMENTATION_SUMMARY.md) - Technical summary
- [CLOUDINARY_QUICK_REFERENCE.md](d:/WebCompetion/backend/CLOUDINARY_QUICK_REFERENCE.md) - Quick reference
- [API_DOCUMENTATION.md](d:/WebCompetion/backend/API_DOCUMENTATION.md) - Full API docs

### ✨ Summary

✅ Cloudinary SDK configured with your credentials  
✅ 5 upload endpoints implemented  
✅ Authentication integrated  
✅ Database schema updated  
✅ File validation (size, type)  
✅ Image optimization (auto-resize)  
✅ Secure storage folder structure  
✅ Error handling  
✅ Complete documentation  

**Your backend is ready to handle image uploads through Cloudinary!**

To verify everything works, use Postman or cURL to test the endpoints with the instructions above.
