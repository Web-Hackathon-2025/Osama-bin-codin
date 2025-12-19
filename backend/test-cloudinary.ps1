# Cloudinary Backend Testing Script
# This script tests all Cloudinary upload endpoints

Write-Host "=== Cloudinary Backend Integration Test ===" -ForegroundColor Cyan
Write-Host ""

# Configuration
$baseUrl = "http://localhost:5000"
$testImagePath = "test-image.jpg" # Replace with actual image path

# Step 1: Register a test worker account
Write-Host "1. Registering test worker account..." -ForegroundColor Yellow
try {
    $registerBody = @{
        name = "Cloudinary Test Worker"
        email = "cloudinary.worker@test.com"
        password = "Test123!"
        role = "worker"
    } | ConvertTo-Json
    
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $registerBody `
        -ErrorAction Stop
    
    Write-Host "✓ Registration successful!" -ForegroundColor Green
    Write-Host "User ID: $($registerResponse.user._id)" -ForegroundColor Gray
    $token = $registerResponse.token
}
catch {
    Write-Host "✗ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Trying to login with existing account..." -ForegroundColor Yellow
    
    # Try to login if user already exists
    $loginBody = @{
        email = "cloudinary.worker@test.com"
        password = "Test123!"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody
    
    $token = $loginResponse.token
    Write-Host "✓ Login successful!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Authentication Token: $token" -ForegroundColor Gray
Write-Host ""

# Check if test image exists
if (-not (Test-Path $testImagePath)) {
    Write-Host "⚠ WARNING: Test image not found at: $testImagePath" -ForegroundColor Yellow
    Write-Host "Please create a test image or update the path in this script." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To test with an actual image:" -ForegroundColor Cyan
    Write-Host "1. Create or download a sample image (JPG, PNG, GIF, or WEBP)" -ForegroundColor Cyan
    Write-Host "2. Save it as 'test-image.jpg' in the backend directory" -ForegroundColor Cyan
    Write-Host "3. Run this script again" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "=== Manual Testing Instructions ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Use Postman or any API client with these details:" -ForegroundColor White
    Write-Host ""
    Write-Host "Authorization Header:" -ForegroundColor Yellow
    Write-Host "Authorization: Bearer $token" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Endpoints to test:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Upload Single Image" -ForegroundColor White
    Write-Host "   POST $baseUrl/api/upload/single" -ForegroundColor Gray
    Write-Host "   Body: form-data with key 'image' and file value" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Upload Multiple Images" -ForegroundColor White
    Write-Host "   POST $baseUrl/api/upload/multiple" -ForegroundColor Gray
    Write-Host "   Body: form-data with key 'images' (multiple files)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Upload Avatar" -ForegroundColor White
    Write-Host "   POST $baseUrl/api/upload/avatar" -ForegroundColor Gray
    Write-Host "   Body: form-data with key 'avatar' and file value" -ForegroundColor Gray
    Write-Host ""
    Write-Host "4. Upload Portfolio (Workers only)" -ForegroundColor White
    Write-Host "   POST $baseUrl/api/upload/portfolio" -ForegroundColor Gray
    Write-Host "   Body: form-data with key 'portfolio' (multiple files)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "5. Delete Image" -ForegroundColor White
    Write-Host "   DELETE $baseUrl/api/upload/:publicId" -ForegroundColor Gray
    Write-Host "   Replace :publicId with actual Cloudinary public_id from upload response" -ForegroundColor Gray
    Write-Host ""
    exit
}

# Step 2: Upload Single Image
Write-Host "2. Testing single image upload..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $form = @{
        image = Get-Item -Path $testImagePath
    }
    
    $singleResponse = Invoke-RestMethod -Uri "$baseUrl/api/upload/single" `
        -Method POST `
        -Headers $headers `
        -Form $form `
        -ErrorAction Stop
    
    Write-Host "✓ Single image upload successful!" -ForegroundColor Green
    Write-Host "  URL: $($singleResponse.data.url)" -ForegroundColor Gray
    Write-Host "  Public ID: $($singleResponse.data.public_id)" -ForegroundColor Gray
    $publicIdToDelete = $singleResponse.data.public_id
}
catch {
    Write-Host "✗ Single image upload failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Step 3: Upload Avatar
Write-Host "3. Testing avatar upload..." -ForegroundColor Yellow
try {
    $form = @{
        avatar = Get-Item -Path $testImagePath
    }
    
    $avatarResponse = Invoke-RestMethod -Uri "$baseUrl/api/upload/avatar" `
        -Method POST `
        -Headers $headers `
        -Form $form `
        -ErrorAction Stop
    
    Write-Host "✓ Avatar upload successful!" -ForegroundColor Green
    Write-Host "  URL: $($avatarResponse.data.avatar)" -ForegroundColor Gray
}
catch {
    Write-Host "✗ Avatar upload failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Step 4: Upload Portfolio
Write-Host "4. Testing portfolio upload (worker only)..." -ForegroundColor Yellow
try {
    $form = @{
        portfolio = Get-Item -Path $testImagePath
    }
    
    $portfolioResponse = Invoke-RestMethod -Uri "$baseUrl/api/upload/portfolio" `
        -Method POST `
        -Headers $headers `
        -Form $form `
        -ErrorAction Stop
    
    Write-Host "✓ Portfolio upload successful!" -ForegroundColor Green
    Write-Host "  Images uploaded: $($portfolioResponse.data.portfolio.Count)" -ForegroundColor Gray
}
catch {
    Write-Host "✗ Portfolio upload failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Step 5: Delete uploaded image
if ($publicIdToDelete) {
    Write-Host "5. Testing image deletion..." -ForegroundColor Yellow
    try {
        # URL encode the public_id
        $encodedPublicId = [System.Web.HttpUtility]::UrlEncode($publicIdToDelete)
        
        $deleteResponse = Invoke-RestMethod -Uri "$baseUrl/api/upload/$encodedPublicId" `
            -Method DELETE `
            -Headers $headers `
            -ErrorAction Stop
        
        Write-Host "✓ Image deletion successful!" -ForegroundColor Green
    }
    catch {
        Write-Host "✗ Image deletion failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Check your Cloudinary dashboard at:" -ForegroundColor Yellow
Write-Host "https://cloudinary.com/console/media_library" -ForegroundColor Cyan
Write-Host "Folder: karigar-app/" -ForegroundColor Gray
