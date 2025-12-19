# 📸 Cloudinary Upload - Quick Reference

## 🚀 Quick Start

### 1. Setup (.env)
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Get Token
```javascript
// Login first
POST /api/auth/login
Body: { email, password }
Response: { token: "..." }
```

---

## 📤 Upload Endpoints

All require: `Authorization: Bearer TOKEN`

### Avatar Upload
```
POST /api/upload/avatar
FormData: { avatar: file }
→ Updates user.avatar in DB
```

### Portfolio Upload (Workers)
```
POST /api/upload/portfolio
FormData: { portfolio: file1, portfolio: file2, ... }
→ Updates user.workerProfile.portfolio in DB
```

### Single Image
```
POST /api/upload/single
FormData: { image: file }
→ Returns URL only
```

### Multiple Images
```
POST /api/upload/multiple
FormData: { images: file1, images: file2, ... }
→ Returns array of URLs
```

### Delete Image
```
DELETE /api/upload/:publicId
→ Deletes from Cloudinary
```

---

## 💻 Frontend Code

### Upload Avatar
```javascript
const uploadAvatar = async (file, token) => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  const res = await fetch('http://localhost:5000/api/upload/avatar', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  
  return await res.json();
};
```

### Upload Portfolio
```javascript
const uploadPortfolio = async (files, token) => {
  const formData = new FormData();
  files.forEach(f => formData.append('portfolio', f));
  
  const res = await fetch('http://localhost:5000/api/upload/portfolio', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  
  return await res.json();
};
```

### React Component
```jsx
const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  
  const handleUpload = async () => {
    const token = localStorage.getItem('token');
    const result = await uploadAvatar(file, token);
    setUrl(result.data.avatar);
  };
  
  return (
    <>
      <input 
        type="file" 
        accept="image/*"
        onChange={e => setFile(e.target.files[0])} 
      />
      <button onClick={handleUpload}>Upload</button>
      {url && <img src={url} alt="Uploaded" />}
    </>
  );
};
```

---

## ✅ Response Format

### Success
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/.../image.jpg",
    "public_id": "karigar-app/abc123"
  }
}
```

### Error
```json
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error"
}
```

---

## 🔧 Configuration

### Image Limits
- **Max Size:** 5MB per file
- **Max Files:** 10 per request (multiple upload)
- **Formats:** JPG, JPEG, PNG, GIF, WEBP
- **Max Dimensions:** 1000x1000px (auto-resize)

### Cloudinary Folder
All images → `karigar-app/` folder

---

## 🧪 Test with cURL

```bash
# Avatar
curl -X POST http://localhost:5000/api/upload/avatar \
  -H "Authorization: Bearer TOKEN" \
  -F "avatar=@image.jpg"

# Portfolio
curl -X POST http://localhost:5000/api/upload/portfolio \
  -H "Authorization: Bearer TOKEN" \
  -F "portfolio=@img1.jpg" \
  -F "portfolio=@img2.jpg"

# Delete
curl -X DELETE http://localhost:5000/api/upload/karigar-app/abc123 \
  -H "Authorization: Bearer TOKEN"
```

---

## 📊 Database Schema

### User Model
```javascript
{
  avatar: String, // Cloudinary URL
  workerProfile: {
    portfolio: [{
      url: String,
      public_id: String,
      uploadedAt: Date
    }]
  }
}
```

---

## ⚠️ Common Errors

| Error | Solution |
|-------|----------|
| "No file uploaded" | Check FormData key matches endpoint |
| "Only images allowed" | Use JPG, PNG, GIF, or WEBP |
| "File too large" | Compress to < 5MB |
| "Unauthorized" | Check JWT token is valid |
| "Only workers..." | User role must be 'worker' |

---

## 📚 Full Documentation

- `CLOUDINARY_GUIDE.md` - Complete guide
- `CLOUDINARY_TESTING.md` - Testing guide
- `CLOUDINARY_IMPLEMENTATION_SUMMARY.md` - Implementation details
- `README.md` - Setup instructions

---

## 🎯 Quick Checklist

- [ ] Cloudinary credentials in .env
- [ ] Server running on port 5000
- [ ] User logged in (has JWT token)
- [ ] File is valid image < 5MB
- [ ] FormData key matches endpoint
- [ ] Authorization header set

---

## 🔗 Useful Links

- Cloudinary Dashboard: https://cloudinary.com/console
- Get Credentials: Dashboard → Settings
- Free Tier: 25GB storage, 25GB bandwidth/month

---

**Need help? Check the full documentation files! 📖**
