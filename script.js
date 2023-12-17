// script.js
document.addEventListener('DOMContentLoaded', loadExpensesFromStorage);
document.getElementById('expenseForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const description = document.getElementById('description').value;
    const amount = document.getElementById('amount').value;

    if (document.getElementById('expenseForm').dataset.isEditing) {
        updateExpenseInStorage(description, amount);
    } else {
        addExpense(description, amount);
        saveExpenseToStorage(description, amount);
    }

    resetForm();
});

document.getElementById('deleteAll').addEventListener('click', function() {
    localStorage.clear();
    document.getElementById('expensesList').innerHTML = '';
});

function addExpense(description, amount) {
    const expensesList = document.getElementById('expensesList');
    const div = document.createElement('div');
    div.className = 'expense';
    div.innerHTML = `
        <p>Descripción: ${description}</p>
        <p>Cantidad: $${amount}</p>
        <button onclick="editExpense(this, '${description}', '${amount}')">Editar</button>
        <button onclick="deleteExpense(this)">Eliminar</button>
    `;
    expensesList.appendChild(div);
}

function saveExpenseToStorage(description, amount) {
    const expense = { description, amount };
    let expenses = getExpensesFromStorage();
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function getExpensesFromStorage() {
    let expenses = localStorage.getItem('expenses');
    return expenses ? JSON.parse(expenses) : [];
}

function loadExpensesFromStorage() {
    let expenses = getExpensesFromStorage();
    expenses.forEach(expense => addExpense(expense.description, expense.amount));
}

function deleteExpense(button) {
    const expenseDiv = button.parentElement;
    expenseDiv.remove();
    updateStorageAfterDelete();
}

function editExpense(button, description, amount) {
    document.getElementById('description').value = description;
    document.getElementById('amount').value = amount;
    document.getElementById('expenseForm').dataset.isEditing = true;
    updateStorageAfterDelete();
    button.parentElement.remove();
}

function updateExpenseInStorage(newDescription, newAmount) {
    let expenses = getExpensesFromStorage();
    expenses = expenses.map(expense => {
        if (expense.description === document.getElementById('description').dataset.originalDescription) {
            return { description: newDescription, amount: newAmount };
        }
        return expense;
    });
    localStorage.setItem('expenses', JSON.stringify(expenses));
    addExpense(newDescription, newAmount);
}

function updateStorageAfterDelete() {
    let expenses = [];
    document.querySelectorAll('.expense').forEach(expenseDiv => {
        let description = expenseDiv.childNodes[1].textContent.replace('Descripción: ', '');
        let amount = expenseDiv.childNodes[3].textContent.replace('Cantidad: $', '');
        expenses.push({ description, amount });
    });
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function resetForm() {
    document.getElementById('expenseForm').reset();
    delete document.getElementById('expenseForm').dataset.isEditing;
}

