// Select DOM elements
const form = document.getElementById("expense-form");
const list = document.getElementById("expense-list");
const chartCanvas = document.getElementById("expenseChart");

// Get existing expenses from LocalStorage or start fresh
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// Form submit event
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const desc = document.getElementById("desc").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;

  if (!desc || !amount || !category) return; // basic validation

  const expense = {
    desc,
    amount,
    category,
    date: new Date().toLocaleDateString()
  };

  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));

  form.reset();
  renderExpenses();
});

// Render expense list and update chart
function renderExpenses() {
  list.innerHTML = "";

  if (expenses.length === 0) {
    list.innerHTML = "<li>No expenses added yet.</li>";
  } else {
    expenses.forEach((exp, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${exp.desc} - ₹${exp.amount} (${exp.category})
        <button onclick="deleteExpense(${index})">❌</button>
      `;
      list.appendChild(li);
    });
  }

  updateChart();
}

// Delete an expense
function deleteExpense(index) {
  expenses.splice(index, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderExpenses();
}

// Update the pie chart
function updateChart() {
  const categoryTotals = {};

  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const ctx = chartCanvas.getContext("2d");

  // Destroy previous chart instance if it exists
  if (window.expenseChart) window.expenseChart.destroy();

  // Create new chart
  window.expenseChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(categoryTotals),
      datasets: [{
        data: Object.values(categoryTotals),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#6f42c1', '#ff7f50', '#8a2be2']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
        title: { display: true, text: "Expenses by Category" }
      }
    }
  });
}

// Initial render on page load
renderExpenses();
