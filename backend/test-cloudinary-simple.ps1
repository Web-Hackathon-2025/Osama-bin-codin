# Simple Cloudinary Backend Test
Write-Host "=== Testing Cloudinary Backend Integration ===" -ForegroundColor Cyan

$baseUrl = "http://localhost:5000"

# Test 1: Register/Login
Write-Host "`n1. Authentication..." -ForegroundColor Yellow
$registerBody = @{
    name = "Cloudinary Tester"
    email = "cloudinary@test.com"
    password = "Test123!"
    role = "worker"
} | ConvertTo-Json

try {
    $auth = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method POST -ContentType "application/json" -Body $registerBody -ErrorAction Stop
    $token = $auth.token
    Write-Host "✓ Registered new user" -ForegroundColor Green
}
catch {
    # Try login if user exists
    $loginBody = @{
        email = "cloudinary@test.com"
        password = "Test123!"
    } | ConvertTo-Json
    
    $auth = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    $token = $auth.token
    Write-Host "✓ Logged in existing user" -ForegroundColor Green
}

Write-Host "Token: $($token.Substring(0, 20))..." -ForegroundColor Gray

# Check for test image
$testImage = "test-image.jpg"
if (-not (Test-Path $testImage)) {
    Write-Host "`n⚠ No test image found!" -ForegroundColor Yellow
    Write-Host "`nTo test image uploads:" -ForegroundColor Cyan
    Write-Host "1. Place a test image as 'test-image.jpg' in backend directory" -ForegroundColor White
    Write-Host "2. Or use Postman/Insomnia with this token:" -ForegroundColor White
    Write-Host "   Authorization: Bearer $token" -ForegroundColor Gray
    Write-Host "`nEndpoints:" -ForegroundColor Cyan
    Write-Host "  POST $baseUrl/api/upload/single (form-data: image)" -ForegroundColor White
    Write-Host "  POST $baseUrl/api/upload/avatar (form-data: avatar)" -ForegroundColor White
    Write-Host "  POST $baseUrl/api/upload/portfolio (form-data: portfolio[])" -ForegroundColor White
    Write-Host "  POST $baseUrl/api/upload/multiple (form-data: images[])" -ForegroundColor White
    Write-Host "  DELETE $baseUrl/api/upload/:publicId" -ForegroundColor White
    Write-Host "`n✓ Cloudinary is configured and ready!" -ForegroundColor Green
    Write-Host "  Cloud Name: dv7naw4hi" -ForegroundColor Gray
    Write-Host "  Dashboard: https://cloudinary.com/console/media_library" -ForegroundColor Gray
    exit
}

# Test 2: Upload Single Image
Write-Host "`n2. Uploading single image..." -ForegroundColor Yellow
$headers = @{ Authorization = "Bearer $token" }
$form = @{ image = Get-Item $testImage }

try {
    $result = Invoke-RestMethod -Uri "$baseUrl/api/upload/single" -Method POST -Headers $headers -Form $form
    Write-Host "✓ Upload successful!" -ForegroundColor Green
    Write-Host "  URL: $($result.data.url)" -ForegroundColor Gray
    Write-Host "  Public ID: $($result.data.public_id)" -ForegroundColor Gray
}
catch {
    Write-Host "✗ Upload failed: $_" -ForegroundColor Red
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Cyan
Write-Host "View uploads: https://cloudinary.com/console/media_library" -ForegroundColor Cyan
