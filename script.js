const form = document.getElementById("expense-form");
const list = document.getElementById("expense-list");
const chartCanvas = document.getElementById("expenseChart");
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const desc = document.getElementById("desc").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;

  const expense = { desc, amount, category, date: new Date().toLocaleDateString() };
  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));

  form.reset();
  renderExpenses();
});

function renderExpenses() {
  list.innerHTML = "";
  expenses.forEach((exp, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${exp.desc} - ₹${exp.amount} (${exp.category})
      <button onclick="deleteExpense(${index})">❌</button>`;
    list.appendChild(li);
  });
  updateChart();
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderExpenses();
}

function updateChart() {
  const categoryTotals = {};
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const ctx = chartCanvas.getContext('2d');
  if (window.expenseChart) window.expenseChart.destroy();
  window.expenseChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(categoryTotals),
      datasets: [{
        data: Object.values(categoryTotals),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#6f42c1']
      }]
    }
  });
}

renderExpenses();
