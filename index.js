import express from 'express' // Add "type": "module", to the package.json for this to work.
import entryRoutes from './routes/entry_routes.js' // The name of default export can be anything and made more relevant to the context it's used in.  In this case we renames router to entryRoutes.
import categoryRoutes from './routes/category_routes.js'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config() //This will read the .env file, parse it and add the variables to the environment so that we can access them but they remain private and encapsulated.  

const app = express() // creates a new instance of an express server with an object to represent it. 
const port = 4001 // sets a port to connect to.

app.use(cors()) 

app.use(express.json()) // middleware that parses JSON into an actual JS object. If something passed in isn't JSON it will ignore it and change nothing.  It does this before it even checks the routes. By the time any routes are processed req.body is accessable. This needs to be placed before any routes. 
app.use('/entries', entryRoutes) // Use this router object and the routes within it whenever it matches the base url of /entries. The middleware will only run if the URL starts with /entries. 
app.use('/categories', categoryRoutes)


app.get('/', (req, res) => res.send({ info: "Journal" })) // request encapulates the data about the request such as the URL, body, headers, http method, ect. The response object can be used to send a response back to the client. In the response object is a method called send, if I don't set a specific status it will send 200.  


app.listen(port, () => console.log(`App running at http://localhost:${port}/`)) // launch the server, connect to the port and listen on the port for incoming connections. It will then execute the optional callback function which provides feedback to the console that the app is running and where. 
