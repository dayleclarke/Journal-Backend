import { CategoryModel, GratitudeModel } from '../db.js';
import { UserModel } from '../models/userModel.js';
import asyncHandler from "express-async-handler"

// @desc Get all gratitudes
// @route GET /gratitudes
// @access Public
const getGratitudes = asyncHandler(async (req, res) => 
  res.send(await GratitudeModel.find().populate({ path: 'category', select: ['name', 'description']}).populate({ path: 'user', select: ['username', 'email']})))

// @desc Get users own gratitudes
// @route GET /gratitudes/mine
// @access Private
const getMyGratitudes = asyncHandler(async (req, res) => {
  const myGratitudes = await GratitudeModel.find({user: req.user.id}).populate({ path: 'category', select: ['name', 'description']})
  res.status(200).json(myGratitudes);
})

// @desc Get one gratitude by id
// @route Get /gratitudes/:id
// @access Public
const getOneGratitude = asyncHandler(async (req, res) => {  
  try { 
    const gratitude = await GratitudeModel.findById(req.params.id).populate('category').populate('user');
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

// Add a new gratitude 
// @desc POST one gratitude
// @route POST /gratitudes
// @access Public
const addGratitude = asyncHandler(async (req, res) => { 
  // Throw an error if the request is missing required fields
  if (!req.body.category) {
    res.status(400)
    throw new Error('Please enter a category field')
  };
  if (!req.body.content) {
    res.status(400)
    throw new Error('Please enter a content field')
  };

  // Create a new gratitude object with values passed in from the request
  const { category, content, user} = req.body  //destrcutre out the fields you are expecting. 
  const userObject =  await UserModel.findOne({username: user }) // Here we are expecting the user to enter the username of the user
  const categoryObject =  await CategoryModel.findOne({name: category }) // and the categroy name of the category
  const newGratitude = { category: categoryObject, user: userObject, content} // The entire user and category object is stored with the gratitude
  const insertedGratitude = await GratitudeModel.create(newGratitude) 
  await insertedGratitude.populate({ path: 'category', select: 'name' });
  await insertedGratitude.populate({ path: 'user', select: 'username' });
  res.status(201).send(insertedGratitude)
})

// @desc Update one gratitude by id
// @route PUT /gratitudes/:id
// @access Private (only accessible by the author of the gratitude)

const updateGratitude = asyncHandler(async (req, res) => { 
  // Throw an error if the id in the URL is not 24 characters long
  if (req.params.id.length !== 24) {
    res.status(400)
    throw new Error(`${req.params.id} is not a valid gratitude id.`)
  }
  
  // Retrieve the original gratitude object based on its id
  const originalGratitude = await GratitudeModel.findById(req.params.id)

  // Throw an error if no gratitude exists with that id
  if (!originalGratitude) {
    res.status(400)
    throw new Error(`No gratitude could be found with id:${req.params.id}.`)
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
  
  const updatedGratitude = { category: categoryObject, user, content}
  
  // Check loggedin user is the author of the gratitude
  if (originalGratitude.user.toString() !== user.id) {
    res.status(401)
    throw new Error('User not authorised')
  }
  // If they were the original author then update the gratitude
  const finalGratitude = await GratitudeModel.findByIdAndUpdate(req.params.id, updatedGratitude, { returnDocument: 'after' }) // this take 3 parameters the first is the id which comes from the restful parameter, second is what you want to update it to and returnDocument after means the document is returned after it has been updated (default behaviour is before). 
  await finalGratitude.populate({ path: 'category', select: 'name' });
  await finalGratitude.populate({ path: 'user', select: 'username' }); 
  res.send(finalGratitude) 
})

// @desc Delete one gratitude based on id
// @route DELETE /gratitudes/:id
// @access Private (only accessible by the author of the gratitude)
const deleteGratitude = asyncHandler(async (req, res) => { 
  // Throw an error if the id in the URL is not 24 characters long
  if (req.params.id.length !== 24){
    res.status(404)
    throw new Error(`${req.params.id} is not a valid user id.`)
  }
  
  // Retrieve the gratitude based on the id provided in the URL
  const gratitude = await GratitudeModel.findById(req.params.id)
  if (!gratitude) {
    res.status(400)
    throw new Error(`No gratitude could be found with id:${req.params.id}.`)
  }

  // Extract the user information from their JWT token
  const user = await UserModel.findById(req.user.id)

  if (!user) {
    res.status(401)
    throw new Error('User information not found')
  }
  // Throw an error if the user is not the original user who posted the gratitude
  if (gratitude.user.toString() !== user.id) {
    res.status(401)
    throw new Error('User not authorised')
  }
  await GratitudeModel.findByIdAndDelete(req.params.id) 
    res.status(200).send({ message: `Gratitude with id: ${req.params.id} has successfully been deleted.`}) 
})


export { getGratitudes, getOneGratitude, getMyGratitudes, addGratitude, updateGratitude, deleteGratitude } 
