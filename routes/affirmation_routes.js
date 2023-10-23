import express from 'express';
import { CategoryModel, AffirmationModel } from '../db.js'; 
import { UserModel } from '../models/userModel.js';
import { protect } from '../middleware/authMiddleware.js'

import { getAffirmations, getOneAffirmation, getMyAffirmations, addAffirmation, updateAffirmation, deleteAffirmation } from '../controllers/affirmationController.js';
// We can't import index.js to get access to app because it needs to import affirmation_routes and that would create a circular reference
// Because we can't use app directly we instead create a stand alone instance of the router. When we created the express app in index.js with express() internally that creates an instance of the router.  app.get then internally delegates that to the router. We don't have to just use the one that is built into app we can create our own instances of that router class. 
const router = express.Router();// A constructor function this creates a new instance of the router. We then attach the routes to this.

// We then remove /affirmations from the start of each of the routes because we can pass the base URL into app.use when we pass it the affirmation router. 

router.route('/').get(getAffirmations).post(addAffirmation); 
router.route('/mine').get(protect, getMyAffirmations);

router.route('/:id').get(getOneAffirmation).put(protect, updateAffirmation).delete(protect, deleteAffirmation);


export default router // If you only have one export make it the default export. When it is the default export the name is irrelevant. When we import it into index.js we will call it entrRoutes. 