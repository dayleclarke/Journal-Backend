import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

async function dbClose() {
  await mongoose.connection.close();
  console.log("Database disconnected");
}
// Connect to MongoDB via Mongoose
try {
  const mongooseConnection = await mongoose.connect(process.env.ATLAS_DB_URL)
  console.log(mongooseConnection.connection.readyState === 1 ? 'Mongoose connected' : 'Mongoose failed to connect')
}
  catch (err) {
    console.log(err);
  }

// Create a Mongoose schema to define the strucutre of a model
const entrySchema = new mongoose.Schema({ 
  category: { type:  mongoose.ObjectId, ref: 'Category' }, 
  content: { type:  String, required: [true, "Please add content to the entry."] }, 
  user: { type: mongoose.ObjectId, ref: 'User'}
})

const gratitudeSchema = new mongoose.Schema({ 
  category: { type:  mongoose.ObjectId, ref: 'Category' }, 
  content: { type:  String, required: [true, "Please add content to the gratitude."] }, 
  user: { type: mongoose.Schema.Types.ObjectID, ref: 'User'}
})

const categorySchema = new mongoose.Schema({ 
  name: { type:  String, required: true, trim: true, maxlength: 50 }, 
  description: { type:  String, trim: true  }, 
})

const userSchema = new mongoose.Schema({ 
  username: { 
    type: String,
    required: [true, "Please add a username."],
    trim: true,
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

// Create a Mongoose model based on the schema
const EntryModel = mongoose.model('Entry', entrySchema)// Two parameters the first is a string which names the model the second is the schema. 
const GratitudeModel = mongoose.model('Gratitude', gratitudeSchema)


const CategoryModel = mongoose.model('Category', categorySchema)

const UserModel = mongoose.model('User', userSchema)

export { EntryModel, CategoryModel, UserModel, GratitudeModel, dbClose } // We don't need to expose the schemas as we don't access them directly. 