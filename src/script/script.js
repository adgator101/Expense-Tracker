document.addEventListener("DOMContentLoaded", () => {
  updateAmountInfo();
  if (getTransactionData()) {
    updateChartData();
  }
});
let mainSectionWrapper = document.querySelector(".main-section-wrapper");
let dashboardBtn = document.querySelector(".tab-button-dashboard");
let reportsBtn = document.querySelector(".tab-button-report");
let reportsContainer = document.querySelector(".reports-section");
let dashboardContainer = document.querySelector(".new-transaction-section");
let errorDialogTimeoutId; // Timeout id for error card dialog

// Event Listeners
reportsBtn.addEventListener("click", showReports);
dashboardBtn.addEventListener("click", showTransaction);

// Functions
function showReports() {
  setActiveTab(reportsBtn);
  reportsContainer.style.display = "block";
  dashboardContainer.style.display = "none";
  populateTable(); // Shows the table also updates if new data is added
}
function showTransaction() {
  setActiveTab(dashboardBtn);
  dashboardContainer.style.display = "block";
  reportsContainer.style.display = "none";
}
function setActiveTab(activeButton) {
  // Remove active class from all buttons
  document
    .querySelectorAll(".tab-button-dashboard, .tab-button-report")
    .forEach((button) => {
      button.classList.remove("active");
    });
  // Add active class to the clicked button
  activeButton.classList.add("active");
}
const ctx = document.querySelector(".report");
const chart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: [" Income", " Expense"],
    datasets: [
      {
        label: " % of Amount Spent",
        data: [0, 0], // Initial data
        backgroundColor: ["rgb(134, 239, 172)", "rgb(253, 186, 116)"], // Colors for Income and Expense
        borderWidth: 2,
      },
    ],
    hoverOffset: 4,
  },
  options: {
    layout: {
      padding: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20,
      },
    },
    plugins: {
      tooltip: {
        enabled: true,
        position: "nearest",
        callbacks: {
          label: function (context) {
            // Shows label on this pattern " Income: 50%"
            return context.label + ": " + context.raw + " % ";
          },
        },
      },
    },
  },
});

let submitBtn = document.querySelector(".submit-transaction");
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addNewTransaction();
  updateAmountInfo();
});
function formatLargeNumber(number) {
  const formatter = Intl.NumberFormat("en", { notation: "compact" });
  return formatter.format(number);
}
function addNewTransaction() {
  let amountInputField = document.querySelector(".input-amount");
  let descriptionInputField = document.querySelector(".input-description");
  let amountTypeInputField = document.querySelector(".amount-type");
  if (amountInputField.value == "") {
    showErrorCard("Enter a valid amount");
    return;
  } else if (descriptionInputField.value == "") {
    showErrorCard("Enter description of the amount");
    return;
  }
  let transaction = {
    amount: amountInputField.value,
    description: descriptionInputField.value,
    amountType: amountTypeInputField.value,
    time: new Date().toLocaleDateString(),
  };
  saveTransaction(transaction);
  clearInputField(amountInputField, descriptionInputField);
}
function saveTransaction(transaction) {
  let transactions = getTransactionData() || {};
  const transactionId = new Date().getTime().toString().slice(8);
  transactions[transactionId] = transaction;
  localStorage.setItem("transactions", JSON.stringify(transactions));
}
function getTransactionData() {
  return JSON.parse(localStorage.getItem("transactions")) || {};
}
function populateTable() {
  const transactions = getTransactionData();
  const incomeClassName = "bg-green-300";
  const expenseClassName = "bg-orange-300 text-gray-200";
  const transactionsTbody = document.querySelector(
    ".manage-transactions-tbody",
  );
  transactionsTbody.innerHTML = "";
  Object.entries(transactions).map(([id, data]) => {
    let amountTypeClassName;
    // Assings className of type label accordingly
    amountTypeClassName =
      data.amountType == "Income" ? incomeClassName : expenseClassName;
    const newRow = `
      <tr class = "p-4 text-center hover:bg-gray-300 transition ">
        <td class="border-b border-gray-200 px-3 py-4" data-label = "Id">${id}</td>
        <td class="border-b border-gray-200 px-3 py-4" data-label = "Description">${data.description}</td>
        <td class="border-b border-gray-200 px-3 py-4" data-label = "Amount">${formatLargeNumber(data.amount)}</td>
        <td class="border-b border-gray-200 px-3 py-4" data-label = "Type">
          <span class="rounded-lg px-3 py-1 ${amountTypeClassName}">
            ${data.amountType}
          </span>
        </td>
        <td class="border-b border-gray-200 px-3 py-4" data-label = "Time">${data.time}</td>
        </td>
      </tr>
    `;
    transactionsTbody.insertAdjacentHTML("beforeend", newRow);
  });
}

function updateAmountInfo() {
  let incomeAmountDisplay = document.querySelector(".income-amount");
  let expenseAmountDisplay = document.querySelector(".expense-amount");
  const transactionsTotal = getTransactionData();
  let totalIncome = 0;
  let totalExpense = 0;
  Object.entries(transactionsTotal).map(([id, data]) => {
    if (data.amountType == "Expense") {
      totalExpense += Number(data.amount);
    } else {
      totalIncome += Number(data.amount);
    }
  });
  incomeAmountDisplay.innerHTML = formatLargeNumber(totalIncome) + " $";
  expenseAmountDisplay.innerHTML = formatLargeNumber(totalExpense) + " $";
  updateChartData(); // Updates chart data after new source is added
}

function updateChartData() {
  const transactionsTotal = getTransactionData();
  let totalIncome = 0;
  let totalExpense = 0;
  Object.entries(transactionsTotal).forEach(([id, data]) => {
    if (data.amountType === "Income") {
      totalIncome += Number(data.amount);
    } else if (data.amountType === "Expense") {
      totalExpense += Number(data.amount);
    }
  });
  let total = totalIncome + totalExpense;
  // If no data is present in localstorage then sends 1 to the chart object to make it visible
  let incomePer = total ? ((totalIncome / total) * 100).toFixed(1) : 1;
  let expensePer = total ? ((totalExpense / total) * 100).toFixed(1) : 1;
  chart.data.datasets[0].data = [incomePer, expensePer];
  chart.update();
}
function clearInputField(amount, description) {
  amount.value = "";
  description.value = "";
}
// Error dialog section
function showErrorCard(message) {
  let errorCardContainer = document.querySelector(".error-card-container");
  let errorMessageContainer = document.querySelector(".error-message");
  errorMessageContainer.textContent = message;
  errorCardContainer.style.display = "flex";
  errorCardContainer.classList.remove("card-hide");
  errorCardContainer.classList.add("card-visible");
  // Automatically hides the error card after 3 seconds
  setTimeout(() => {
    hideErrorCard(errorCardContainer);
  }, 3000);
}
function hideErrorCard(errorCard) {
  clearTimeout(errorDialogTimeoutId);
  errorCard.classList.add("card-hide");
  errorCard.classList.remove("card-visible");
  errorDialogTimeoutId = setTimeout(() => {
    errorCard.style.display = "none";
  }, 1190);
}
