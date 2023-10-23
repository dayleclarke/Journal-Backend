import express from 'express';
import { UserModel } from '../models/userModel.js';
import { registerUser, loginUser, getMe, getUsers } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js'
const router = express.Router();

//Get all users
router.route('/').get(getUsers).post(registerUser)

router.post('/login', loginUser)

router.get('/me', protect, getMe)


export default router 