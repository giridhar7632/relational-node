const API_ENDPOINT = `https://relational-node.onrender.com/expenses`
// Define variables for the DOM elements
const form = document.querySelector('form')
const expenseNameInput = document.querySelector('#expense-name')
const expenseAmountInput = document.querySelector('#expense-amount')
const expenseDateInput = document.querySelector('#expense-date')
const expensesTableBody = document.querySelector('#expenses-table-body')
const totalExpensesContainer = document.querySelector('#total-expense')

// Define variables for the state
let expenses = [
	{ name: 'test1', amount: 100, date: new Date() },
	{ name: 'test2', amount: 200, date: new Date() },
]
let totalExpenses = 0

// Define function to get all expenses
async function getExpenses() {
	try {
		const response = await fetch(API_ENDPOINT)
		const expenses = await response.json()
		return expenses
	} catch (error) {
		console.error(error)
		return []
	}
}

// Define function to add an expense to the expenses array
async function addExpense(expense) {
	try {
		const response = await fetch(API_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(expense),
		})
		if (!response.ok) {
			throw new Error('Failed to add expense')
		}
		const data = await response.json()
		data && expenses.push(data)
	} catch (error) {
		console.error(error)
	}
}

// Define function to remove an expense from the expenses array
async function removeExpense(index) {
	try {
		const expense = expenses[index]
		const response = await fetch(`${API_ENDPOINT}/${expense.id}`, {
			method: 'DELETE',
		})
		if (!response.ok) {
			throw new Error('Failed to remove expense')
		}
		expenses.splice(index, 1)
	} catch (error) {
		console.error(error)
	}
}

// Define function to update an expense in the expenses array
async function updateExpense(index, updatedExpense) {
	try {
		const expense = expenses[index]
		const response = await fetch(`${API_ENDPOINT}/${expense.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatedExpense),
		})
		if (!response.ok) {
			throw new Error('Failed to update expense')
		}
		const data = await response.json()
		expense.name = data.name
		expense.amount = data.amount
		expense.date = data.date
	} catch (error) {
		console.error(error)
	}
}

// Define function to render the table row for an expense
function renderExpenseRow({ name, amount, date }, index) {
	const row = document.createElement('tr')
	row.innerHTML = `
    <td>${name}</td>
    <td>$${parseFloat(amount).toFixed(2)}</td>
    <td>${new Date(date).toLocaleDateString()}</td>
    <td>
      <button class="btn-update" data-index="${index}"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-pencil" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
			<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
			<path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4" />
			<line x1="13.5" y1="6.5" x2="17.5" y2="10.5" />
		</svg></button>
      <button class="btn-delete" data-index="${index}"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
			<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
			<line x1="4" y1="7" x2="20" y2="7" />
			<line x1="10" y1="11" x2="10" y2="17" />
			<line x1="14" y1="11" x2="14" y2="17" />
			<path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
			<path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
		</svg></button>
    </td>
  `
	return row
}

// Define function to render the expenses table and total expenses container
async function renderExpensesTableAndTotal() {
	// Clear the expenses table body
	expensesTableBody.innerHTML = ''
	// Render the expenses table rows
	expenses.forEach((expense, index) => {
		const row = renderExpenseRow(expense, index)
		expensesTableBody.appendChild(row)
	})

	// Update the total expenses container
	totalExpenses = expenses.reduce(
		(acc, expense) => acc + parseFloat(expense.amount),
		0
	)
	totalExpensesContainer.textContent = `$${totalExpenses.toFixed(2)}`
}

// Define event listener for form submit
form.addEventListener('submit', async (event) => {
	event.preventDefault()

	// Get the form data
	const name = expenseNameInput.value
	const amount = parseFloat(expenseAmountInput.value)
	const date = expenseDateInput.value || new Date()

	// Create a new expense object
	const expense = { name, amount, date }

	// Add the new expense to the expenses array
	await addExpense(expense)

	// Clear the form inputs
	form.reset()

	// Render the updated expenses table and total expenses container
	renderExpensesTableAndTotal()
})

// Define event listener for update and delete button clicks
expensesTableBody.addEventListener('click', async (event) => {
	const button = event.target
	const index = parseInt(button.dataset.index)

	if (button.classList.contains('btn-delete')) {
		// Remove the expense from the expenses array
		await removeExpense(index)

		// Render the updated expenses table and total expenses container
		renderExpensesTableAndTotal()
	} else if (button.classList.contains('btn-update')) {
		// Get the updated form data for the expense
		const name =
			prompt('Enter the updated expense name:', expenses[index].name) ||
			expenses[index].name
		const amount =
			parseFloat(
				prompt('Enter the updated expense amount:', expenses[index].amount)
			) || expenses[index].amount
		const date =
			prompt(
				'Enter the updated expense date (YYYY-MM-DD):',
				expenses[index].date
			) || expenses[index].date

		// Create a new updated expense object
		const updatedExpense = { name, amount, date }

		// Update the expense in the expenses array
		await updateExpense(index, updatedExpense)

		// Render the updated expenses table and total expenses container
		renderExpensesTableAndTotal()
	}
})

window.addEventListener('DOMContentLoaded', async () => {
	expenses = await getExpenses()
	renderExpensesTableAndTotal()
})
