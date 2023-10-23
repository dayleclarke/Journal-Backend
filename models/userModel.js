import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({ 
  username: { 
    type: String,
    required: [true, "Please add a username."],
    trim: true,
    minlength: 3,
    maxlength: 50 
  }, 
  email: {
    type: String,
    trim: true,
    required: [true, "Please add an email addrress."],
    unique: true,
    minlength: 8
  },
  password: { 
    type:  String, 
    trim: true,  
    required: [true, "Please add a password."],
  }, 
  isAdmin: {
    type: Boolean,
    default: false,
  },
},
  {
    timestamps: true
  }
)

const UserModel = mongoose.model('User', userSchema)

export { UserModel } // We don't need to expose the schemas as we don't access them directly. 