
import { UserModel, CategoryModel, EntryModel } from '../db.js'; 

// @desc Get entries
// @route Get /entries
// @access Private
const getEntries = async (req, res) => res.send(await EntryModel.find().populate({ path: 'category', select: ['name', 'description']}).populate({ path: 'user', select: ['username', 'email']}))

// @desc Get one entry by id
// @route Get /entries/:id
// @access Private
const getOneEntry = async (req, res) => {  
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
}

// Add a new entry 
// @desc POST one entry
// @route POST /entries/
// @access Private 
const addEntry = async (req, res) => { 
  try {
    // Create a new entry object with values passed in from the request
    const { category, content, user} = req.body  //destrcutre out the fields you are expecting. 
    const userObject =  await UserModel.findOne({username: user })
    const categoryObject =  await CategoryModel.findOne({name: category })
    const newEntry = { category: categoryObject._id, user: userObject._id, content} 
    const insertedEntry = await EntryModel.create(newEntry) 
    await insertedEntry.populate({ path: 'category', select: 'name' });
    await insertedEntry.populate({ path: 'user', select: 'username' });
    res.status(201).send(insertedEntry)
  }
  catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// @desc Update one entry by id
// @route PUT /entries/:id
// @access Private
const updateEntry = async (req, res) => { 
  const { category, content, user} = req.body  
  const categoryObject =  await CategoryModel.findOne({name: category })
  const userObject =  await UserModel.findOne({username: user })
  const updatedEntry = { category: categoryObject._id, user: userObject._id, content}
  try {
    const entry = await EntryModel.findByIdAndUpdate(req.params.id, updatedEntry, { returnDocument: 'after' }) // this take 3 parameters the first is the id which comes from the restful parameter, second is what you want to update it to and returnDocument after means the document is returned after it has been updated (default behaviour is before). 
    if (entry) { // if the entry is truthy
      await entry.populate({ path: 'category', select: 'name' });
      await entry.populate({ path: 'user', select: 'username' }); 
      res.send(entry) 
    } else {
        res.status(404).send({ error: 'Entry not found'}) // this error is returned if it is a valid id but doesn't match anything in the db
    }
  }
  catch (err) {
    res.status(500).send({ error: err.message }); //If something else goes wrong other than being unable to find the entry such as if we lose network or database connection it will throw an exception. It will catch the error and return a 500 error. 
  }
}

// @desc Delete one entry based on id
// @route DELETE /entries/:id
// @access Private
const deleteEntry = async (req, res) => { 
  try {
    const entry = await EntryModel.findByIdAndDelete(req.params.id) 
    if (entry) { // if the entry is truthy
      res.sendStatus(204) 
    } else {
        res.status(404).send({ error: 'Entry not found'}) // this error is returned if it is a valid id but doesn't match anything in the db
    }
  }
  catch (err) {
    res.status(500).send({ error: err.message }); //If something else goes wrong other than being unable to find the entry such as if we lose network or database connection it will throw an exception. It will catch the error and return a 500 error. 
  }
}


export { getEntries, getOneEntry, addEntry, updateEntry, deleteEntry } 
