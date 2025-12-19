# Karigar Docker Setup

## 🐳 Quick Start

### 1. Prerequisites
- Docker Desktop installed and running
- Copy `.env.docker` to `.env` and update with your credentials

### 2. Start All Services
```bash
docker-compose up -d
```

### 3. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **MongoDB**: mongodb://localhost:27017

### 4. View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f mongodb
```

### 5. Stop Services
```bash
docker-compose down
```

### 6. Rebuild After Changes
```bash
docker-compose down
docker-compose build
docker-compose up -d
```

## 📦 Services

### Backend (Node.js)
- **Port**: 8080
- **Health Check**: Automatic
- **Rate Limiting**: Enabled
- **WebSocket**: Enabled on port 8080

### MongoDB
- **Port**: 27017
- **Username**: admin
- **Password**: securepassword123
- **Database**: karigar
- **Persistent Storage**: Docker volume

### Frontend (React + Vite)
- **Port**: 5173
- **Nginx**: Production-ready server
- **Gzip**: Enabled
- **SPA Routing**: Configured

## 🔒 Rate Limiting

The backend includes the following rate limits:
- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 requests per 15 minutes
- **Account Creation**: 3 requests per hour
- **Chat Messages**: 50 messages per minute

## 🛠️ Development vs Production

### Development (Current)
```bash
npm run dev
```

### Production (Docker)
```bash
docker-compose up -d
```

## 📝 Environment Variables

Create `.env` file in root directory:
```env
MONGODB_URI=mongodb://admin:securepassword123@mongodb:27017/karigar?authSource=admin
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
# ... add other variables
```

## 🔄 Useful Commands

```bash
# View running containers
docker ps

# Stop specific service
docker-compose stop backend

# Restart specific service
docker-compose restart backend

# Remove all containers and volumes
docker-compose down -v

# View backend logs
docker-compose logs backend --tail=100 -f

# Execute command in container
docker-compose exec backend sh
```

## 🚀 Production Deployment

For production, update:
1. Change MongoDB password in docker-compose.yml
2. Use MongoDB Atlas connection string
3. Set NODE_ENV=production
4. Update FRONTEND_URL to your domain
5. Enable HTTPS with reverse proxy (nginx/traefik)

## 📊 Health Checks

All services include health checks:
- **Backend**: HTTP GET to /
- **MongoDB**: mongosh ping command
- **Auto-restart**: Services restart if unhealthy
