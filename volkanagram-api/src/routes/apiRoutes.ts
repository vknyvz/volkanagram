import {Router} from 'express'
import {optionalAuth, requireAuth} from "../middleware/auth"
import {uploadMiddleware} from "../middleware/uploader"
import {get, edit} from "../controllers/userController"
import {uploader, viewer} from "../controllers/fileController"
import {comment, create, byId, like, unlike} from "../controllers/postController"
import {stories} from "../controllers/feedController"
import {feed} from "../controllers/feedController"
import {follow, profile, unfollow} from "../controllers/profileController"
import {health} from "../controllers/healthController"
import {login, logout, me, register} from "../controllers/authController"

const router = Router();

router.post('/auth/login', login)
router.post('/auth/logout', logout)
router.post('/auth/register', register)
router.post('/feed', optionalAuth, feed)
router.post('/post/byId/:id', requireAuth, byId)
router.post('/post/comment', requireAuth, comment)
router.post('/post/create', requireAuth, create)
router.post('/post/like', requireAuth, like)
router.post('/post/unlike', requireAuth, unlike)
router.post('/profile/:username/follow', requireAuth, follow);
router.post('/profile/:username/unfollow', requireAuth, unfollow);
router.post('/uploader', [requireAuth, uploadMiddleware], uploader)
router.post('/user', requireAuth, get)
router.post('/user/edit', requireAuth, edit)

router.get('/auth/me', requireAuth, me)
router.get('/health', health)
router.get('/profile/:username', optionalAuth, profile)
router.get('/stories', stories)
router.get('/:type/:filename', viewer)

export default router