# volkanagram - Instagram Clone 

An Instagram clone written only in Javascript.

This is currently Work in Progress (WIP)

## 🏗️ Architecture

### Frontend ([volkanagram-web](volkanagram-web))
- **Next.js**: Next.js 15
- **React**: React 19
- **State Management** Redux
- **TypeScript** 5.9
- **Web Socket**: Socket.io

### Backend ([volkanagram-api](volkanagram-api))
- **Framework**: Express.js 5
- **Database**: Mongo
- **ODM**: Mongoose
- **Authentication**: JWT
- **Web Socket**: Socket.io

## 🚀 Quick Start

### Start Services
```bash
# Build and run all services
docker compose up -d --build
```

### Access Services
#### dev
- **API**: http://localhost:5001
- **WEB**: http://localhost:3000
#### live
- **API**: https://volkanagram.vknyvz.com
- **WEB**: https://api-volkanagram.vknyvz.com

## 📡 API Endpoints

```bash
GET  - /api/auth/me
POST - /api/auth/login
POST - /api/auth/logout
POST - /api/auth/register
POST - /api/feed
GET  - /api/health
POST - /api/post/byId/:id
POST - /api/post/comment
POST - /api/post/create
POST - /api/post/like
POST - /api/post/unlike
POST - /api/profile/:username/follow
POST - /api/profile/:username/unfollow
GET  - /api/stories
POST - /api/uploader
POST - /api/user
POST - /api/user/edit

GET  - /:type/:filename
GET  - /profile/:username 
```

## 🔧 Development & Maintenance

### Frontend Environment Configuration
```bash
# Set environments
NODE_ENV=development
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:5001/api 
NEXT_PUBLIC_URL=http://localhost:5001
NEXT_PUBLIC_IMAGE_URL=http://volkanagram-api:5001/api
NEXT_PUBLIC_SOCKET_ENDPOINT=http://localhost:5001 
```

### Backend Environment Configuration
```bash
# Set environments
PORT=5001
MONGO_URI=mongodb://mongo:27017/volkanagram
FRONTEND_ENDPOINT=http://localhost:3000
JWT_SECRET=volkanagram-very-secret-key
```

### 🐳 Useful Docker Commands
```bash
# List
docker ps

# Destroy & Rebuild docker
docker-compose down && docker-compose up --build

# See Next.js environment variables
docker exec volkanagram-web env | grep NEXT_PUBLIC
or
docker exec volkanagram-api printenv | grep PORT

# Logs 
docker logs -f volkanagram-web
docker logs -f volkanagram-api

# System prune
docker system prune -a --volumes
```

### Recommended IDE Setup
- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [WebStorm](https://www.jetbrains.com/webstorm/download/?section=mac)

