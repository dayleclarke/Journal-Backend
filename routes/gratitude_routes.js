import express from 'express';
import { protect } from '../middleware/authMiddleware.js'
import { getGratitudes, getOneGratitude, getMyGratitudes, addGratitude, updateGratitude, deleteGratitude } from '../controllers/gratitudeController.js';

const router = express.Router();

router.route('/').get(getGratitudes).post(addGratitude); 
router.route('/mine').get(protect, getMyGratitudes);

router.route('/:id').get(getOneGratitude).put(protect, updateGratitude).delete(protect, deleteGratitude);


export default router 