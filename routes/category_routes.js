import express from 'express';
import { CategoryModel } from '../db.js'; 

const router = express.Router()

router.get('/', async (req, res) => res.status(200).send(await CategoryModel.find())) // If the url is http://localhost:4001/categories it will send through the JSON categories with the status code 200. 

// Get a single category based on it's id
router.get('/:id', async (req, res) => {  
  try { 
    const category = await CategoryModel.findById(req.params.id)
    if (category) { 
       res.send(category) 
    } else {
        res.status(404).send({ error: 'Category not found'})  
    }
  }
  catch (err) {
    res.status(500).send({ error: err.message }); 
  }
}) 

router.post('/', async (req, res) => { 
  try {
    const { name, description} = req.body    
    const newCategory = { name, description } 
    const insertedCategory = await CategoryModel.create(newCategory) 
    res.status(201).send(insertedCategory)
  }
  catch (err) {
    res.status(500).send({ error: err.message });
  }
})

export default router 