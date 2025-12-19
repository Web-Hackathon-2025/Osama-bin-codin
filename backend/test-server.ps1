Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/login' -Method POST -ContentType 'application/json' -Body '{\
email\:\test@test.com\,\password\:\Test123!\}'
