import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
import colors from 'colors'


async function dbClose() {
  await mongoose.connection.close();
  console.log("Database disconnected");
}

// Connect to MongoDB via Mongoose
try {
  const mongooseConnection = await mongoose.connect(process.env.ATLAS_DB_URL)
  console.log(mongooseConnection.connection.readyState === 1 ? `Mongoose Connected: ${mongooseConnection.connection.host}`.cyan.underline : 'Mongoose failed to connect')
}
  catch (err) {
    console.log(err);
    process.exit(1);
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



// Create a Mongoose model based on the schema
const EntryModel = mongoose.model('Entry', entrySchema)// Two parameters the first is a string which names the model the second is the schema. 
const GratitudeModel = mongoose.model('Gratitude', gratitudeSchema)


const CategoryModel = mongoose.model('Category', categorySchema)



export { EntryModel, CategoryModel, GratitudeModel, dbClose } // We don't need to expose the schemas as we don't access them directly. 