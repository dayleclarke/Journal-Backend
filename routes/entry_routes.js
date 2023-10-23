import express from 'express';
import { CategoryModel, EntryModel } from '../db.js'; 
import { UserModel } from '../models/userModel.js';
import { protect } from '../middleware/authMiddleware.js'

import { getEntries, getOneEntry, getMyEntries, addEntry, updateEntry, deleteEntry } from '../controllers/entryController.js';
// We can't import index.js to get access to app because it needs to import entry_routes and that would create a circular reference
// Because we can't use app directly we instead create a stand alone instance of the router. When we created the express app in index.js with express() internally that creates an instance of the router.  app.get then internally delegates that to the router. We don't have to just use the one that is built into app we can create our own instances of that router class. 
const router = express.Router();// A constructor function this creates a new instance of the router. We then attach the routes to this.

// We then remove /entries from the start of each of the routes because we can pass the base URL into app.use when we pass it the entry router. 

router.route('/').get(getEntries).post(addEntry); 
router.route('/mine').get(protect, getMyEntries);

router.route('/:id').get(getOneEntry).put(protect, updateEntry).delete(protect, deleteEntry);


export default router // If you only have one export make it the default export. When it is the default export the name is irrelevant. When we import it into index.js we will call it entrRoutes. 