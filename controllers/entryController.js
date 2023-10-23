
import { CategoryModel, EntryModel } from '../db.js';
import { UserModel } from '../models/userModel.js';

import asyncHandler from "express-async-handler"

// @desc Get entries
// @route Get /entries
// @access Private
const getEntries = asyncHandler(async (req, res) => 
  res.send(await EntryModel.find().populate({ path: 'category', select: ['name', 'description']}).populate({ path: 'user', select: ['username', 'email']})))

// @desc Get entries
// @route Get /entries
// @access Private
const getMyEntries = asyncHandler(async (req, res) => {
  const myEntries = await EntryModel.find({user: req.user.id}).populate({ path: 'category', select: ['name', 'description']})
  res.status(200).json(myEntries);
})

// @desc Get one entry by id
// @route Get /entries/:id
// @access Private
const getOneEntry = asyncHandler(async (req, res) => {  
  try { // We can find and update in one step. Fetch an object with that ID and update the entry
    const entry = await EntryModel.findById(req.params.id).populate('category').populate('user');
    if (entry) { 
       res.send(entry) 
    } else {
        res.status(404).send({ error: 'Entry not found'})  
    }
  }
  catch (err) {
    res.status(500).send({ error: err.message }); 
  }
})

// Add a new entry 
// @desc POST one entry
// @route POST /entries/
// @access Private 
const addEntry = asyncHandler(async (req, res) => { 
    // Create a new entry object with values passed in from the request
    if (!req.body.category) {
      res.status(400)
      throw new Error('Please enter a category field')
    };
    const { category, content, user} = req.body  //destrcutre out the fields you are expecting. 
    const userObject =  await UserModel.findOne({username: user })
    const categoryObject =  await CategoryModel.findOne({name: category })
    const newEntry = { category: categoryObject, user: userObject, content} 
    const insertedEntry = await EntryModel.create(newEntry) 
    await insertedEntry.populate({ path: 'category', select: 'name' });
    await insertedEntry.populate({ path: 'user', select: 'username' });
    res.status(201).send(insertedEntry)
})

// @desc Update one entry by id
// @route PUT /entries/:id
// @access Private

const updateEntry = asyncHandler(async (req, res) => { 
  if (req.params.id.length !== 24) {
    res.status(400)
    throw new Error(`${req.params.id} is not a valid entry id.`)
  }
  
  const originalEntry = await EntryModel.findById(req.params.id)
  if (!originalEntry) {
    res.status(400)
    throw new Error(`No entry could be found with id:${req.params.id}.`)
  }
  const { category, content } = req.body  
  const categoryObject =  await CategoryModel.findOne({name: category })
  const user = await UserModel.findById(req.user.id)

  if (!user) {
    res.status(401)
    throw new Error('User information not found')
  }
  const updatedEntry = { category: categoryObject, user, content}
  // Check loggedin user is the author of the entry
  if (originalEntry.user.toString() !== user.id) {
    res.status(401)
    throw new Error('User not authorised')
  }
  
  const finalEntry = await EntryModel.findByIdAndUpdate(req.params.id, updatedEntry, { returnDocument: 'after' }) // this take 3 parameters the first is the id which comes from the restful parameter, second is what you want to update it to and returnDocument after means the document is returned after it has been updated (default behaviour is before). 
  await finalEntry.populate({ path: 'category', select: 'name' });
  await finalEntry.populate({ path: 'user', select: 'username' }); 
  res.send(finalEntry) 
})
// const updateEntry = asyncHandler(async (req, res) => { 
//   const { category, content, user} = req.body  
//   const categoryObject =  await CategoryModel.findOne({name: category })
//   const userObject =  await UserModel.findOne({username: user })
//   const updatedEntry = { category: categoryObject, user: userObject, content}
//   try {
//     const entry = await EntryModel.findByIdAndUpdate(req.params.id, updatedEntry, { returnDocument: 'after' }) // this take 3 parameters the first is the id which comes from the restful parameter, second is what you want to update it to and returnDocument after means the document is returned after it has been updated (default behaviour is before). 
//     if (entry) { // if the entry is truthy
//       await entry.populate({ path: 'category', select: 'name' });
//       await entry.populate({ path: 'user', select: 'username' }); 
//       res.send(entry) 
//     } else {
//       res.status(400)
//       throw new Error('Entry not found with that id')  
//       //res.status(404).send({ error: 'Entry not found'}) // this error is returned if it is a valid id but doesn't match anything in the db
//     }
//   }
//   catch (err) {
//     res.status(500).send({ error: err.message }); //If something else goes wrong other than being unable to find the entry such as if we lose network or database connection it will throw an exception. It will catch the error and return a 500 error. 
//   }
// })

// @desc Delete one entry based on id
// @route DELETE /entries/:id
// @access Private
const deleteEntry = asyncHandler(async (req, res) => { 
  if (req.params.id.length !== 24){
    res.status(404)
    throw new Error(`${req.params.id} is not a valid user id.`)
  }

  const entry = await EntryModel.findByIdAndDelete(req.params.id) 
    if (entry) { // if the entry is truthy
      res.status(200).send({ message: `Entry with id: ${req.params.id} has successfully been deleted.`}) 
    } else {
        res.status(404).send({ error: `Entry with id: ${req.params.id} not found`}) // this error is returned if it is a valid id but doesn't match anything in the db
    }
  })


export { getEntries, getOneEntry, getMyEntries, addEntry, updateEntry, deleteEntry } 
