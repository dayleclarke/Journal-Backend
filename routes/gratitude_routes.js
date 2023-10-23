import express from 'express';
import { GratitudeModel, CategoryModel } from '../db.js'
import { UserModel } from '../models/userModel.js';


const router = express.Router()

//Get all gratitudes
router.get('/', async (req, res) => res.send(await GratitudeModel.find().populate({ path: 'category', select: ['name', 'description']}).populate({ path: 'user', select: ['username', 'email']})));  

// Get a single gratitude based on it's id
router.get('/:id', async (req, res) => {  
  try { 
    const gratitude = await GratitudeModel.findById(req.params.id).populate('category').populate('user')
    if (gratitude) { 
       res.send(gratitude) 
    } else {
        res.status(404).send({ error: 'Gratitude not found'})  
    }
  }
  catch (err) {
    res.status(500).send({ error: err.message }); 
  }
}) 

// Post (Add) a new gratitude  
router.post('/', async (req, res) => { 
  try {
    const { category, content, user} = req.body
    const categoryObject =  await CategoryModel.findOne({name: category })
    const userObject =  await UserModel.findOne({username: user })
    const newGratitude = { category: categoryObject._id, user: userObject._id, content} 
    const insertedGratitude = await GratitudeModel.create(newGratitude)
    await insertedGratitude.populate({ path: 'category', select:'name' })
    await insertedGratitude.populate({ path: 'user', select: 'username' });
    res.status(201).send(insertedGratitude)
  }
  catch (err) {
    res.status(500).send({ error: err.message });
  }
})

// Update a single affirmation based on it's id
router.put('/:id', async (req, res) => { // id is a restful parameter prefixed with a colon : 
  const { category, content, user} = req.body  //destrcutre out the fields you are expecting to get the category and content from the request body.  
  const categoryObject =  await CategoryModel.findOne({name: category })
  const userObject =  await UserModel.findOne({username: user })
  const updatedGratitude = { category: categoryObject._id, user: userObject._id, content} //create a new variable to store the category and content with the same keys and values.  
  try {
    const gratitude = await GratitudeModel.findByIdAndUpdate(req.params.id, updatedGratitude, { returnDocument: 'after' }) // this take 3 parameters the first is the id which comes from the restful parameter, second is what you want to update it to and returnDocument after means the document is returned after it has been updated (default behaviour is before). 
    if (gratitude) { // if the affirmation is truthy
      await gratitude.populate({ path: 'category', select: 'name' });
      await gratitude.populate({ path: 'user', select: 'username' }); 
      res.send(gratitude) 
    } else {
        res.status(404).send({ error: 'Gratitude not found'}) // this error is returned if it is a valid id but doesn't match anything in the db
    }
  }
  catch (err) {
    res.status(500).send({ error: err.message }); //If something else goes wrong other than being unable to find the affirmation such as if we lose network or database connection it will throw an exception. It will catch the error and return a 500 error. 
  }
}) 

// Delete a single affirmation based on it's id
router.delete('/:id', async (req, res) => {  
  try {
    const affirmation = await AffirmationModel.findByIdAndDelete(req.params.id) 
    if (affirmation) { // if the affirmation is truthy
      res.sendStatus(204) 
    } else {
        res.status(404).send({ error: 'Affirmation not found'}) // this error is returned if it is a valid id but doesn't match anything in the db
    }
  }
  catch (err) {
    res.status(500).send({ error: err.message }); //If something else goes wrong other than being unable to find the affirmation such as if we lose network or database connection it will throw an exception. It will catch the error and return a 500 error. 
  }
}) 

export default router // If you only have one export make it the default export. When it is the default export the name is irrelevant. When we import it into index.js we will call it entrRoutes. 