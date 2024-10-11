document.addEventListener('DOMContentLoaded', function () {
    // Function to fetch data from the server
    async function fetchData() {
        const response = await fetch('/get_data');
        const data = await response.json();
        document.getElementById('budget-display').innerText = `Your Budget: $${data.budget}`;
        document.getElementById('savings-display').innerText = `Savings Goal: $${data.savings}`;
        
        const expenseDisplay = document.getElementById('expense-display');
        const totalExpenses = data.expenses.reduce((total, expense) => total + expense.amount, 0);
        expenseDisplay.innerText = `Total Expenses: $${totalExpenses}`;
    }

    fetchData(); // Fetch data when the page loads

    // Budget form functionality
    const budgetForm = document.getElementById('budget-form');
    budgetForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const budgetAmount = parseFloat(document.getElementById('budget').value);
        if (!isNaN(budgetAmount) && budgetAmount > 0) {
            const response = await fetch('/set_budget', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: budgetAmount }),
            });
            const data = await response.json();
            document.getElementById('budget-display').innerText = `Your Budget: $${data.amount}`;
        }
    });

    // Expense form functionality
    const expenseForm = document.getElementById('expense-form');
    expenseForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const category = document.getElementById('expense-category').value;
        const expenseAmount = parseFloat(document.getElementById('expense').value);
        if (!isNaN(expenseAmount) && expenseAmount > 0) {
            const response = await fetch('/add_expense', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ category, amount: expenseAmount }),
            });
            const data = await response.json();
            const totalExpenses = parseFloat(document.getElementById('expense-display').innerText.split('$')[1]) + expenseAmount;
            document.getElementById('expense-display').innerText = `Total Expenses: $${totalExpenses}`;
        }
    });

    // Savings form functionality
    const savingsForm = document.getElementById('savings-form');
    savingsForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const savingsGoal = parseFloat(document.getElementById('savings-goal').value);
        if (!isNaN(savingsGoal) && savingsGoal > 0) {
            const response = await fetch('/set_savings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ goal: savingsGoal }),
            });
            const data = await response.json();
            document.getElementById('savings-display').innerText = `Savings Goal: $${data.goal}`;
        }
    });
});
document.addEventListener('DOMContentLoaded', function () {
    // Hide sections initially
    const budgetSection = document.getElementById('budget-section');
    const expenseSection = document.getElementById('expense-section');
    const savingsSection = document.getElementById('savings-section');

    // Links to show sections
    const budgetLink = document.getElementById('budget-link');
    const expensesLink = document.getElementById('expenses-link');
    const savingsLink = document.getElementById('savings-link');

    // Event listeners for dropdown options
    budgetLink.addEventListener('click', function () {
        hideAllSections();
        budgetSection.style.display = 'block';
    });

    expensesLink.addEventListener('click', function () {
        hideAllSections();
        expenseSection.style.display = 'block';
    });

    savingsLink.addEventListener('click', function () {
        hideAllSections();
        savingsSection.style.display = 'block';
    });

    // Function to hide all sections
    function hideAllSections() {
        budgetSection.style.display = 'none';
        expenseSection.style.display = 'none';
        savingsSection.style.display = 'none';
    }

    // Budget form functionality
    const budgetForm = document.getElementById('budget-form');
    const budgetDisplay = document.getElementById('budget-display');
    let budgetAmount = 0;

    budgetForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const budget = parseFloat(document.getElementById('budget').value);
        if (!isNaN(budget) && budget > 0) {
            budgetAmount = budget;
            budgetDisplay.textContent = `Your Budget: $${budgetAmount}`;
        }
    });

    // Savings form functionality
    const savingsForm = document.getElementById('savings-form');
    const savingsDisplay = document.getElementById('savings-display');
    let savingsGoal = 0;

    savingsForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const savings = parseFloat(document.getElementById('savings-goal').value);
        if (!isNaN(savings) && savings > 0) {
            savingsGoal = savings;
            savingsDisplay.textContent = `Savings Goal: $${savingsGoal}`;
        }
    });

    // Monthly Report (Chart)
    const ctx = document.getElementById('expenseChart').getContext('2d');
    const expenseChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Food', 'Rent', 'Entertainment', 'Other'],
            datasets: [{
                label: 'Expenses',
                data: [300, 500, 100, 200], // Example data, replace with actual values
                backgroundColor: ['#3498db', '#1abc9c', '#f39c12', '#e74c3c']
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
