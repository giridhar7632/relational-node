require('dotenv').config({
	path: `.env.local`,
})
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

// Create an instance of the express app
const app = express()
// Use body-parser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Use static middleware for frontend
app.use(express.static(path.join(__dirname, 'public')))

// Start the server
const PORT = process.env.PORT || 3000
app.listen(PORT, async () => {
	console.log(`Server listening on port ${PORT}`)
})
