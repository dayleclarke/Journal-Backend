
import { CategoryModel, AffirmationModel } from '../db.js';
import { UserModel } from '../models/userModel.js';
import asyncHandler from "express-async-handler"

// @desc Get all affirmations
// @route GET /affirmations
// @access Public
const getAffirmations = asyncHandler(async (req, res) => 
  res.send(await AffirmationModel.find().populate({ path: 'category', select: ['name', 'description']}).populate({ path: 'user', select: ['username', 'email']})))

// @desc Get users own affirmations
// @route GET /affirmations/mine
// @access Private
const getMyAffirmations = asyncHandler(async (req, res) => {
  const myAffirmations = await AffirmationModel.find({user: req.user.id}).populate({ path: 'category', select: ['name', 'description']})
  res.status(200).json(myAffirmations);
})

// @desc Get one affirmation by id
// @route Get /affirmations/:id
// @access Public
const getOneAffirmation = asyncHandler(async (req, res) => {  
  try { 
    const affirmation = await AffirmationModel.findById(req.params.id).populate('category').populate('user');
    if (affirmation) { 
       res.send(affirmation) 
    } else {
        res.status(404).send({ error: 'Affirmation not found'})  
    }
  }
  catch (err) {
    res.status(500).send({ error: err.message }); 
  }
})

// Add a new affirmation 
// @desc POST one affirmation
// @route POST /affirmations
// @access Public
const addAffirmation = asyncHandler(async (req, res) => { 
  // Throw an error if the request is missing required fields
  if (!req.body.category) {
    res.status(400)
    throw new Error('Please enter a category field')
  };
  if (!req.body.content) {
    res.status(400)
    throw new Error('Please enter a content field')
  };

  // Create a new affirmation object with values passed in from the request
  const { category, content, user} = req.body  //destrcutre out the fields you are expecting. 
  const userObject =  await UserModel.findOne({username: user }) // Here we are expecting the user to enter the username of the user
  const categoryObject =  await CategoryModel.findOne({name: category }) // and the categroy name of the category
  const newAffirmation = { category: categoryObject, user: userObject, content} // The entire user and category object is stored with the affirmation
  const insertedAffirmation = await AffirmationModel.create(newAffirmation) 
  await insertedAffirmation.populate({ path: 'category', select: 'name' });
  await insertedAffirmation.populate({ path: 'user', select: 'username' });
  res.status(201).send(insertedAffirmation)
})

// @desc Update one affirmation by id
// @route PUT /affirmations/:id
// @access Private (only accessible by the author of the affirmation)

const updateAffirmation = asyncHandler(async (req, res) => { 
  // Throw an error if the id in the URL is not 24 characters long
  if (req.params.id.length !== 24) {
    res.status(400)
    throw new Error(`${req.params.id} is not a valid affirmation id.`)
  }
  
  // Retrieve the original affirmation object based on its id
  const originalAffirmation = await AffirmationModel.findById(req.params.id)

  // Throw an error if no affirmation exists with that id
  if (!originalAffirmation) {
    res.status(400)
    throw new Error(`No affirmation could be found with id:${req.params.id}.`)
  }

  // Extract the fields from the request to update
  const { category, content } = req.body  
  const categoryObject =  await CategoryModel.findOne({name: category })

  // Extract the user's information from their JWT token 
  const user = await UserModel.findById(req.user.id)

  if (!user) {
    res.status(401)
    throw new Error('User information not found')
  }
  
  const updatedAffirmation = { category: categoryObject, user, content}
  
  // Check loggedin user is the author of the affirmation
  if (originalAffirmation.user.toString() !== user.id) {
    res.status(401)
    throw new Error('User not authorised')
  }
  // If they were the original author then update the affirmation
  const finalAffirmation = await AffirmationModel.findByIdAndUpdate(req.params.id, updatedAffirmation, { returnDocument: 'after' }) // this take 3 parameters the first is the id which comes from the restful parameter, second is what you want to update it to and returnDocument after means the document is returned after it has been updated (default behaviour is before). 
  await finalAffirmation.populate({ path: 'category', select: 'name' });
  await finalAffirmation.populate({ path: 'user', select: 'username' }); 
  res.send(finalAffirmation) 
})

// @desc Delete one affirmation based on id
// @route DELETE /affirmations/:id
// @access Private (only accessible by the author of the affirmation)
const deleteAffirmation = asyncHandler(async (req, res) => { 
  // Throw an error if the id in the URL is not 24 characters long
  if (req.params.id.length !== 24){
    res.status(404)
    throw new Error(`${req.params.id} is not a valid user id.`)
  }
  
  // Retrieve the affirmation based on the id provided in the URL
  const affirmation = await AffirmationModel.findById(req.params.id)
  if (!affirmation) {
    res.status(400)
    throw new Error(`No affirmation could be found with id:${req.params.id}.`)
  }

  // Extract the user information from their JWT token
  const user = await UserModel.findById(req.user.id)

  if (!user) {
    res.status(401)
    throw new Error('User information not found')
  }
  // Throw an error if the user is not the original user who posted the affirmation
  if (affirmation.user.toString() !== user.id) {
    res.status(401)
    throw new Error('User not authorised')
  }
  await AffirmationModel.findByIdAndDelete(req.params.id) 
    res.status(200).send({ message: `Affirmation with id: ${req.params.id} has successfully been deleted.`}) 
})


export { getAffirmations, getOneAffirmation, getMyAffirmations, addAffirmation, updateAffirmation, deleteAffirmation } 
