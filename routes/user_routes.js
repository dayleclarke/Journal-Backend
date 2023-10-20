import express from 'express';
import { UserModel } from '../db.js';

const router = express.Router();

//Get all users
router.get('/', async (req, res) => res.status(200).send(await UserModel.find()))

router.post('/', async (req, res) => { 
  try {
    const { username, email, password} = req.body    
    const newUser = { username, email,password } 
    const insertedUser = await UserModel.create(newUser) 
    res.status(201).send(insertedUser)
  }
  catch (err) {
    res.status(500).send({ error: err.message });
  }
})

export default router 