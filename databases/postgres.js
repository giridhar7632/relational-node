const { Pool } = require('pg')
const express = require('express')
const router = express.Router()

// Create a new client for handling database connections
const connectionString = process.env.CONNECTION_STRING
let client
const pool = new Pool({
	connectionString,
	ssl: true,
})

;(async () => {
	client = await pool.connect()
	console.log('connected to database 🎉')

	// Define function to get all expenses from the database
	// CREATE TABLE expenses (
	// 	id SERIAL PRIMARY KEY,
	// 	name TEXT,
	// 	amount NUMERIC,
	// 	date DATE
	// );
})().catch((err) => console.error(err.stack))

// Define function to get all expenses from the database
async function getExpenses() {
	const query = 'SELECT * FROM expenses'
	const { rows } = await pool.query(query)
	return rows
}

// Define function to add an expense to the database
async function addExpense(expense) {
	const { name, amount, date } = expense
	const query =
		'INSERT INTO expenses (name, amount, date) VALUES ($1, $2, $3) RETURNING *'
	const result = await pool.query(query, [name, amount, date])
	return result.rows[0]
}

// Define function to remove an expense from the database
async function removeExpense(id) {
	const query = 'DELETE FROM expenses WHERE id = $1'
	await pool.query(query, [id])
}

// Define function to update an expense in the database
async function updateExpense(id, updatedExpense) {
	const { name, amount, date } = updatedExpense
	const query =
		'UPDATE expenses SET name = $1, amount = $2, date = $3 WHERE id = $4 RETURNING *'
	const result = await pool.query(query, [name, amount, date, id])
	return result.rows[0]
}

// Define route to get all expenses
router.get('/expenses', async (req, res) => {
	try {
		const expenses = await getExpenses()
		res.json(expenses)
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Internal server error' })
	}
})

// Define route to add a new expense
router.post('/expenses', async (req, res) => {
	try {
		const expense = req.body
		const data = await addExpense(expense)
		res.status(201).json(data)
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Internal server error' })
	}
})

// Define route to remove an expense
router.delete('/expenses/:id', async (req, res) => {
	try {
		const id = req.params.id
		await removeExpense(id)
		res.sendStatus(200)
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Internal server error' })
	}
})

// Define route to update an expense
router.put('/expenses/:id', async (req, res) => {
	try {
		const id = req.params.id
		const updatedExpense = req.body
		const newExpense = await updateExpense(id, updatedExpense)
		res.status(201).json(newExpense)
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Internal server error' })
	}
})

module.exports = router