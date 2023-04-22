// Import required packages
const mysql = require('mysql')
const express = require('express')
const router = express.Router()

// Create connection pool to MySQL database
const pool = mysql.createPool({
	connectionLimit: 10,
	database: 'tracker',
	user: 'l1rbiq5mzmostlo42ypn',
	host: 'aws.connect.psdb.cloud',
	password: 'pscale_pw_JXuJU8OXPnOgVRfpX9UsaQVKUCt57d5bhMeqVJdn0aV',
	ssl: true,
})

;(async () => {
	await pool.getConnection(async (err, connection) => {
		if (err) throw new Error(err)
		console.log('connected to database 🎉')

		// Use the connection
		try {
			await connection.query('SELECT * FROM expenses', (err, rows) => {
				if (err) throw new Error(err)
				console.log(rows)
			})
		} catch (error) {
			console.error(error)
		}
	})
})().catch((err) => console.error(err.stack))

// Define route to get all expenses
router.get('/expenses', async (req, res) => {
	await pool.query('SELECT * FROM expenses', (error, results) => {
		if (error) {
			res.status(500).json({ error })
		} else {
			console.log(results)
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
		(error, result, rows) => {
			if (error) {
				res.status(500).json({ error })
			} else {
				console.log({ rows })
				console.log({ result })
			}

			res.status(201).json(rows[0])
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
		[name, amount, date, id],
		(error, result) => {
			if (error) {
				res.status(500).json({ error })
			} else if (result.affectedRows === 0) {
				res.status(404).json({ message: 'Expense not found' })
			} else {
				res.status(200).json({ message: 'Expense updated successfully' })
			}
		}
	)
})

router.delete('/expenses/:id', (req, res) => {
	const { id } = req.params
	pool.query('DELETE FROM expenses WHERE id = ?', [id], (error, result) => {
		if (error) {
			res.status(500).json({ error })
		} else if (result.affectedRows === 0) {
			res.status(404).json({ message: 'Expense not found' })
		} else {
			res.status(200).json({ message: 'Expense deleted successfully' })
		}
	})
})

module.exports = router
