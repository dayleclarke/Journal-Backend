import express from 'express';
import { CategoryModel } from '../db.js'; 
import { protect } from '../middleware/authMiddleware.js'

import { getCategories, getOneCategory, addCategory } from '../controllers/categoryController.js';

const router = express.Router()

router.route('/').get(getCategories).post(addCategory); 

router.route('/:id').get(getOneCategory)


export default router 