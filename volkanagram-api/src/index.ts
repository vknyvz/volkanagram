import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import http from 'http'
import {connectDB} from './config/db'
import cookieParser from 'cookie-parser'
import apiRoutes from "./routes/apiRoutes"
import path from 'path'
import {initSocketService} from "./services/socketService"

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT || 5000)

const allowedOrigins = [
  process.env.FRONTEND_ENDPOINT,
  /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:3000$/
]

app.use((req, res, next) => {
  console.log(`[message] ${req.method} ${req.url} received`);
  next()
})

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true)

    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return allowedOrigin === origin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())
app.use('/api', apiRoutes)
app.use(express.static(path.join(__dirname, '../public')))

const httpServer = http.createServer(app)
initSocketService(httpServer)

connectDB().then(() => {
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`)
  });
});
