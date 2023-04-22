// Import required packages
const mysql = require('mysql')
const express = require('express')
const router = express.Router()

// Create connection pool to MySQL database
const pool = mysql.createPool({
	connectionLimit: 10,
	database: 'tracker',
	user: 'r2yc537ojbffiatg971a',
	host: 'aws.connect.psdb.cloud',
	password: 'pscale_pw_KezXO8dK68npa8bVXMqmK1Eu2VBVEwqkfKg6i62lovP',
	ssl: true,
})

// Define route to get all expenses
router.get('/expenses', async (req, res) => {
	await pool.query('SELECT * FROM expenses', (error, results) => {
		if (error) {
			res.status(500).json({ error })
		} else {
			res.status(201).json(results)
		}
	})
})

router.post('/expenses', (req, res) => {
	const { name, amount, date } = req.body
	pool.query(
		'INSERT INTO expenses SET ?',
		{
			name,
			amount,
			date: new Date(date).toISOString().slice(0, 19).replace('T', ' '),
		},
		(error, results) => {
			if (error) {
				res.status(500).json({ error })
			} else {
				res.status(201).json({ id: results.insertId, name, amount, date })
			}
		}
	)
})

router.get('/expenses/:id', (req, res) => {
	const { id } = req.params
	pool.query('SELECT * FROM expenses WHERE id = ?', [id], (error, results) => {
		if (error) {
			res.status(500).json({ error })
		} else if (results.length === 0) {
			res.status(404).json({ message: 'Expense not found' })
		} else {
			res.status(200).json({ expense: results[0] })
		}
	})
})

router.put('/expenses/:id', (req, res) => {
	const { id } = req.params
	const { name, amount, date } = req.body
	pool.query(
		'UPDATE expenses SET name = ?, amount = ?, date = ? WHERE id = ?',
		[
			name,
			amount,
			new Date(date).toISOString().slice(0, 19).replace('T', ' '),
			id,
		],
		(error) => {
			if (error) {
				res.status(500).json({ error })
			} else {
				res.status(200).json({ id, name, amount, date })
			}
		}
	)
})

router.delete('/expenses/:id', (req, res) => {
	const { id } = req.params
	pool.query('DELETE FROM expenses WHERE id = ?', [id], (error) => {
		if (error) {
			res.status(500).json({ error })
		} else {
			res.status(200).json({ message: 'Expense deleted successfully' })
		}
	})
})

module.exports = router
