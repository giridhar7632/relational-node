const { Sequelize, DataTypes } = require('sequelize')
const express = require('express')
const router = express.Router()

// Create an instance of Sequelize and connect to the database
const sequelize = new Sequelize(
	'tracker',
	'l9ii8wzorch0ei3l6c4u',
	'pscale_pw_mrkKUdTxBEQ9LRvuckcgwJD2boAUdOMarCEoSpLWoKG',
	{
		host: 'aws.connect.psdb.cloud',
		dialect: 'mysql',
		dialectOptions: {
			ssl: {
				require: true,
				rejectUnauthorized: false, // to allow self-signed certificates or invalid certificates
			},
		},
	}
)

// Define the Expense model
const Expense = sequelize.define(
	'expense',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		amount: {
			type: DataTypes.NUMERIC,
			allowNull: false,
		},
		date: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},
	{
		timestamps: false,
	}
)

// Synchronize the model with the database
sequelize.sync({ forced: true })

// Define routes for getting all expenses, getting a single expense by ID, adding a new expense, updating an expense, and deleting an expense
router.get('/expenses', async (req, res) => {
	const expenses = await Expense.findAll()
	res.json(expenses)
})

router.get('/expenses/:id', async (req, res) => {
	const expense = await Expense.findByPk(req.params.id)
	if (expense) {
		res.json(expense)
	} else {
		res.status(404).json({ message: 'Expense not found' })
	}
})

router.post('/expenses', async (req, res) => {
	const { name, amount, date } = req.body
	const expense = await Expense.create({ name, amount, date })
	res.json(expense)
})

router.put('/expenses/:id', async (req, res) => {
	const expense = await Expense.findByPk(req.params.id)
	if (expense) {
		const { name, amount, date } = req.body
		expense.name = name
		expense.amount = amount
		expense.date = date
		await expense.save()
		res.json(expense)
	} else {
		res.status(404).json({ message: 'Expense not found' })
	}
})

router.delete('/expenses/:id', async (req, res) => {
	const expense = await Expense.findByPk(req.params.id)
	if (expense) {
		await expense.destroy()
		res.json({ message: 'Expense deleted' })
	} else {
		res.status(404).json({ message: 'Expense not found' })
	}
})

module.exports = router