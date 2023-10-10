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
  content: { type:  String, required: true }, 
})

const categorySchema = new mongoose.Schema({ // The schema is singular. Entry not entries.
  name: { type:  String, required: true, trim: true, maxlength: 50 }, 
  description: { type:  String, trim: true  }, 
})

// Create a Mongoose model based on the schema
const EntryModel = mongoose.model('Entry', entrySchema)// Two parameters the first is a string which names the model the second is the schema. It is rare but possible to reuse the same schema for two different models. For example if students and teachers had the same data structure (same columns and data validation requirements). but generally it is a one-to-one modelling.

const CategoryModel = mongoose.model('Category', categorySchema)

export { EntryModel, CategoryModel, dbClose } // We don't need to expose the schemas as we don't access them directly. 