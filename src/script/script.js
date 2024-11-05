// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAS74xlvS9mOiX3DnQ8XhFv6WYdgRy5bDs",
//   authDomain: "expense-tracker-f4ede.firebaseapp.com",
//   databaseURL: "https://expense-tracker-f4ede-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "expense-tracker-f4ede",
//   storageBucket: "expense-tracker-f4ede.firebasestorage.app",
//   messagingSenderId: "782372323186",
//   appId: "1:782372323186:web:de043f6b6a7f959aa767eb",
//   measurementId: "G-VKY9LG3XPT"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

let dashboardBtn = document.querySelector(".tab-button-dashboard");
let reportsBtn = document.querySelector(".tab-button-report");
let mainSectionWrapper = document.querySelector(".main-section-wrapper");
reportsBtn.addEventListener("click", showReports);
dashboardBtn.addEventListener("click",showTransaction)
let reportsContainer = document.querySelector(".reports-section");
let dashboardContainer = document.querySelector(".new-transaction-section");
function showReports() {
  reportsContainer.style.display = "block";
  dashboardContainer.style.display = "none";
}
function showTransaction() {
  dashboardContainer.style.display = "block";
  reportsContainer.style.display = "none";
}
const ctx = document.querySelector(".report");
console.log(ctx);
new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Income", "Expense"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19],
        borderWidth: 1,
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
      legend: {
        display: false, // Set to false to remove the graph labels
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
