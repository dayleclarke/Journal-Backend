
import { CategoryModel, AffirmationModel } from '../db.js';
import { UserModel } from '../models/userModel.js';

import asyncHandler from "express-async-handler"

// @desc Get affirmations
// @route Get /affirmations
// @access Private
const getAffirmations = asyncHandler(async (req, res) => 
  res.send(await AffirmationModel.find().populate({ path: 'category', select: ['name', 'description']}).populate({ path: 'user', select: ['username', 'email']})))

// @desc Get affirmations
// @route Get /affirmations
// @access Private
const getMyAffirmations = asyncHandler(async (req, res) => {
  const myAffirmations = await AffirmationModel.find({user: req.user.id}).populate({ path: 'category', select: ['name', 'description']})
  res.status(200).json(myAffirmations);
})

// @desc Get one affirmation by id
// @route Get /affirmations/:id
// @access Private
const getOneAffirmation = asyncHandler(async (req, res) => {  
  try { // We can find and update in one step. Fetch an object with that ID and update the affirmation
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
// @route POST /affirmations/
// @access Private 
const addAffirmation = asyncHandler(async (req, res) => { 
    // Create a new affirmation object with values passed in from the request
    if (!req.body.category) {
      res.status(400)
      throw new Error('Please enter a category field')
    };
    const { category, content, user} = req.body  //destrcutre out the fields you are expecting. 
    const userObject =  await UserModel.findOne({username: user })
    const categoryObject =  await CategoryModel.findOne({name: category })
    const newAffirmation = { category: categoryObject, user: userObject, content} 
    const insertedAffirmation = await AffirmationModel.create(newAffirmation) 
    await insertedAffirmation.populate({ path: 'category', select: 'name' });
    await insertedAffirmation.populate({ path: 'user', select: 'username' });
    res.status(201).send(insertedAffirmation)
})

// @desc Update one affirmation by id
// @route PUT /affirmations/:id
// @access Private

const updateAffirmation = asyncHandler(async (req, res) => { 
  if (req.params.id.length !== 24) {
    res.status(400)
    throw new Error(`${req.params.id} is not a valid affirmation id.`)
  }
  
  const originalAffirmation = await AffirmationModel.findById(req.params.id)
  if (!originalAffirmation) {
    res.status(400)
    throw new Error(`No affirmation could be found with id:${req.params.id}.`)
  }
  const { category, content } = req.body  
  const categoryObject =  await CategoryModel.findOne({name: category })
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
  
  const finalAffirmation = await AffirmationModel.findByIdAndUpdate(req.params.id, updatedAffirmation, { returnDocument: 'after' }) // this take 3 parameters the first is the id which comes from the restful parameter, second is what you want to update it to and returnDocument after means the document is returned after it has been updated (default behaviour is before). 
  await finalAffirmation.populate({ path: 'category', select: 'name' });
  await finalAffirmation.populate({ path: 'user', select: 'username' }); 
  res.send(finalAffirmation) 
})
// const updateAffirmation = asyncHandler(async (req, res) => { 
//   const { category, content, user} = req.body  
//   const categoryObject =  await CategoryModel.findOne({name: category })
//   const userObject =  await UserModel.findOne({username: user })
//   const updatedAffirmation = { category: categoryObject, user: userObject, content}
//   try {
//     const affirmation = await AffirmationModel.findByIdAndUpdate(req.params.id, updatedAffirmation, { returnDocument: 'after' }) // this take 3 parameters the first is the id which comes from the restful parameter, second is what you want to update it to and returnDocument after means the document is returned after it has been updated (default behaviour is before). 
//     if (affirmation) { // if the affirmation is truthy
//       await affirmation.populate({ path: 'category', select: 'name' });
//       await affirmation.populate({ path: 'user', select: 'username' }); 
//       res.send(affirmation) 
//     } else {
//       res.status(400)
//       throw new Error('Affirmation not found with that id')  
//       //res.status(404).send({ error: 'Affirmation not found'}) // this error is returned if it is a valid id but doesn't match anything in the db
//     }
//   }
//   catch (err) {
//     res.status(500).send({ error: err.message }); //If something else goes wrong other than being unable to find the affirmation such as if we lose network or database connection it will throw an exception. It will catch the error and return a 500 error. 
//   }
// })

// @desc Delete one affirmation based on id
// @route DELETE /affirmations/:id
// @access Private
const deleteAffirmation = asyncHandler(async (req, res) => { 
  if (req.params.id.length !== 24){
    res.status(404)
    throw new Error(`${req.params.id} is not a valid user id.`)
  }
  
  const affirmation = await AffirmationModel.findById(req.params.id)
  if (!affirmation) {
    res.status(400)
    throw new Error(`No affirmation could be found with id:${req.params.id}.`)
  }

  const user = await UserModel.findById(req.user.id)

  if (!user) {
    res.status(401)
    throw new Error('User information not found')
  }

  if (affirmation.user.toString() !== user.id) {
    res.status(401)
    throw new Error('User not authorised')
  }
  await AffirmationModel.findByIdAndDelete(req.params.id) 
    res.status(200).send({ message: `Affirmation with id: ${req.params.id} has successfully been deleted.`}) 
})


export { getAffirmations, getOneAffirmation, getMyAffirmations, addAffirmation, updateAffirmation, deleteAffirmation } 
