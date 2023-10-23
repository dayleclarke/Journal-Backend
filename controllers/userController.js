import { CategoryModel, AffirmationModel } from '../db.js';
import { UserModel } from '../models/userModel.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import asyncHandler from "express-async-handler"


// @desc Register a new user 
// @route POST /users/
// @access Public 
const registerUser = asyncHandler(async (req, res) => { 
  const { username, email, password} = req.body
  
  if(!username || !email || !password) {
    res.status(400)
    throw new Error('Please add all fields')
  }
  // Check if the user is already registered
  const userExists = await UserModel.findOne({ email })
  if(userExists) {
    res.status(400)
    throw new Error('User already registered with that email')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  const newUser = { username, email, password: hashedPassword } 
  const insertedUser = await UserModel.create(newUser) 
  if (insertedUser) {
    res.status(201).json({
      _id: insertedUser.id,
      username: insertedUser.username,
      email: insertedUser.email,
      token: generateToken(insertedUser._id)
    }
    )
  } else {
    res.status(400)
    throw new Error('Invalid user data received')
  }
})


// @desc Authernicate an existing user 
// @route POST /users/login
// @access Public 
const loginUser = asyncHandler(async (req, res) => { 
  const { email, password } = req.body; 
  
  // Check for user email
  const user = await UserModel.findOne({email})

  if (user && (await bcrypt.compare(password, user.password))) {
  res.json({
    _id: user.id,
    username: user.username,
    email: user.email,
    token: generateToken(user._id)
  })
  } else {
    res.status(400)
    throw new Error('Invalid email and/or password')
  }

})

// @desc Get own user data 
// @route POST /users/me
// @access Private
const getMe = asyncHandler(async (req, res) => { 
  const {_id, username, email} = await UserModel.findById(req.user.id);
  res.status(200).json({
    id: _id,
    username,
    email,
  })
})

// @desc GET all users 
// @route GET /users
// @access Private 
const getUsers = asyncHandler(async (req, res) => { 
  res.status(200).send(await UserModel.find())
})

// Geneerate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn:'30d'},)
}

export { registerUser, loginUser, getMe, getUsers  } 