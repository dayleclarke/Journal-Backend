import express from 'express';
import { CategoryModel, EntryModel } from '../db.js'; // double dot because it is up one folder from where entry_routes is. 
// We can't import index.js to get access to app because it needs to import entry_routes and that would create a circular reference
// Because we can't use app directly we instead create a stand alone instance of the router. When we created the express app in index.js with express() internally that creates an instance of the router.  app.get then internally delegates that to the router. We don't have to just use the one that is built into app we can create our own instances of that router class. 
const router = express.Router()// A constructor function this creates a new instance of the router. We then attach the routes to this.

// We then remove /entries from the start of each of the routes because we can pass the base URL into app.use when we pass it the entry router. 

//Get all entries
router.get('/', async (req, res) => res.send(await EntryModel.find().populate({ path: 'category', select: ['name', 'description']}))); 

// Get a single entry based on it's id
router.get('/:id', async (req, res) => {  
  try { // We can find and update in one step. Fetch an object with that ID and update the entry
    const entry = await EntryModel.findById(req.params.id).populate('category')
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

// Post (Add) a new entry  
router.post('/', async (req, res) => { // Make it an async function so that I can use await rather than having to use .then() 
  try {
    // Create a new entry object with values passed in from the request
    const { category, content} = req.body  //destrcutre out the fields you are expecting. 
    const categoryObject =  await CategoryModel.findOne({name: category })
    const newEntry = { category: categoryObject._id, content} //don't just use the entire req.body as is open to SQL injections. We need to validate and sanatise the content. A
    //entries.push(newEntry)
    const insertedEntry = await EntryModel.create(newEntry) // create a new document to store this new entry based on the newEntry model and its schema. 
    //3. Send the new entry with 201 status (201 = successfully created an entry)
    res.status(201).send(await insertedEntry.populate({ path: 'category', select:'name' }))
  }
  catch (err) {
    res.status(500).send({ error: err.message });
  }
})

// Update a single entry based on it's id
router.put('/:id', async (req, res) => { // id is a restful parameter prefixed with a colon : 
  const { category, content} = req.body  //destrcutre out the fields you are expecting to get the category and content from the request body.  
  const updatedEntry = { category, content} //create a new variable to store the category and content with the same keys and values.  
  try {
    const entry = await EntryModel.findByIdAndUpdate(req.params.id, updatedEntry, { returnDocument: 'after' }) // this take 3 parameters the first is the id which comes from the restful parameter, second is what you want to update it to and returnDocument after means the document is returned after it has been updated (default behaviour is before). 
    if (entry) { // if the entry is truthy
       res.send(entry) 
    } else {
        res.status(404).send({ error: 'Entry not found'}) // this error is returned if it is a valid id but doesn't match anything in the db
    }
  }
  catch (err) {
    res.status(500).send({ error: err.message }); //If something else goes wrong other than being unable to find the entry such as if we lose network or database connection it will throw an exception. It will catch the error and return a 500 error. 
  }
}) 

// Delete a single entry based on it's id
router.delete('/:id', async (req, res) => {  
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
}) 

export default router // If you only have one export make it the default export. When it is the default export the name is irrelevant. When we import it into index.js we will call it entrRoutes. 