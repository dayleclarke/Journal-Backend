import express from 'express';
import { CategoryModel } from '../db.js'; 
import asyncHandler from "express-async-handler"


// @desc Get all categories
// @route GET /categories
// @access Public
const getCategories = asyncHandler(async (req, res) => 
  res.send(await CategoryModel.find()))

// @desc Get one category by its id
// @route GET /categories/:id
// @access Public

const getOneCategory = asyncHandler(async (req, res) => {  
  // Throw an error if the id in the URL is not 24 characters long
  if (req.params.id.length !== 24) {
    res.status(400)
    throw new Error(`${req.params.id} is not a valid gratitude id.`)
  }

  // Retrieve the original category object based on its id
  const category = await CategoryModel.findById(req.params.id)

  // Throw an error if no category exists with that id
  if (!category) {
    res.status(400)
    throw new Error(`No category could be found with id:${req.params.id}.`)
  }
  res.send(category) 
})

const addCategory = asyncHandler(async (req, res) => {  
    const { name, description} = req.body    
    const newCategory = { name, description } 
    const insertedCategory = await CategoryModel.create(newCategory) 
    res.status(201).send(insertedCategory)
  }
)

export { getCategories, getOneCategory, addCategory } 