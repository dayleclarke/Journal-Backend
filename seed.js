import { CategoryModel, EntryModel, dbClose } from './db.js'

// Delete the existing entries in our database. 
await EntryModel.deleteMany() 
console.log('Deleted all entries in the Journal database')

await CategoryModel.deleteMany()
console.log('Deleted all categories in the Journal database')

// A list of objects containing the data for each category. 
const categories = [
    { name: 'Food', description: "A description of my favourite meals and recipes" },
    { name: 'Coding', description: "Notes, ideas and insights relating to coding" },
    { name: 'Work', description: "Notes, ideas and insights relating to work and career" },
    { name: 'Other', description: "A catch all used to store journal entries that don't fit in any other category." },
    { name: 'Climbing', description: "A physically and mentally demanding sport where individuals ascend natural rock formations"},
    { name: 'Affirmations',   description: "Affirmations are positive statements or phrases that are often used to challenge and replace negative or unhelpful thoughts and beliefs." }
] 

// Once the categories are created we need to provide the ID of the category instead of a hard-coded string when listing an entry. 
const cats = await CategoryModel.insertMany(categories) // Cats is short for category. 
console.log('Inserted Categories')

//Again we store the data for each entry in an array of objects. Now instead of a hard-coded string for the category we use square brackets to specify which object in the cats array to use. cats[0] refers to the first category in the cats array. 
const entries = [
    { category: cats[0], content: 'Pizza is delicious and a great way to use up left over vegetables'}, // Here we are passing the whole category object for food directly as a category. 
    { category: cats[1], content: 'Express is agnostic.'},
    { category: cats[1], content: "Coding is like a rollercoaster amazing when it works anger provoking when it doesn't"},
    { category: cats[4], content: 'My goal for the end of 2023 is to finish a 25 clean on lead outdoors' },
    { category: cats[5], content: "I am enough, I'm doing enough and I have enough" },
    { category: cats[0], content: "My favourite guilty pleasure food is hot chips and ice-cream." },
]

await EntryModel.insertMany(entries)
console.log('Inserted Entries')

dbClose() // This is used to close the open MongoDB connection explicitly. If you have an open moongose database connection it wont allow the app to terminate once it has been used to seed the database.
