let timerInterval;
let running = false;
let totalSeconds = 0;
let taskCount = 0;

// Function to get the current time in Poland (CET/CEST)
function updateTime() {
    const polandTime = new Date().toLocaleString("en-US", { timeZone: "Europe/Warsaw" });
    document.getElementById("currentTime").textContent = polandTime;
}

setInterval(updateTime, 1000);


let chart;
let timeSpectData = [];
function createChart() {
    const ctx = document.getElementById("timeSpentChart").getContext("2d");

    chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Task 1", "Task 2", "Task 3"], // You can dynamically add task names here
            datasets: [{
                label: "Time Spent (seconds)",
                data: timeSpentData,
                backgroundColor: "rgba(0, 123, 255, 0.5)",
                borderColor: "rgba(0, 123, 255, 1)",
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
} 

// Function to update the graph with the new time spent
function updateGraph(taskIndex, timeSpent) {
    timeSpentData[taskIndex] = timeSpent; // Update time for the specific task
    chart.update();
}

// Create the chart when the page loads
window.onload = createChart;

// Get statistics from localStorage or initialize if it doesn't exist
let stats = JSON.parse(localStorage.getItem("taskStats")) || {};

function saveStats() {
    const date = new Date().toLocaleDateString();
    if (!stats[date]) {
        stats[date] = { tasksCompleted: 0, timeSpent: 0 };
    }
    stats[date].tasksCompleted = taskCount;
    stats[date].timeSpent = totalSeconds;

    // Save to localStorage (still do this)
    localStorage.setItem("taskStats", JSON.stringify(stats));

    // Send data to the server to save it to a file
    fetch('/save-stats', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(stats) // Send the stats object to the server
    })
    .then(response => response.json())
    .then(data => {
        console.log('Stats saved to server:', data);
    })
    .catch(error => {
        console.error('Error saving stats to server:', error);
    });
}

// Call saveStats when the task is incremented or when you stop the timer
document.getElementById("startStopBtn").addEventListener("click", saveStats);
document.getElementById("resetBtn").addEventListener("click", saveStats);

function loadDailyStats() {
    const date = new Date().toLocaleDateString();
    const todayStats = stats[date] || { tasksCompleted: 0, timeSpent: 0 };

    document.getElementById("dailyTasksCompleted").textContent = todayStats.tasksCompleted;
    document.getElementById("dailyTimeSpent").textContent = formatTime(todayStats.timeSpent);
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} hours ${minutes} minutes`;
}

// Call loadDailyStats when the page loads
window.onload = loadDailyStats;

// Function to start/stop the timer
function startStopTimer() {
    const button = document.getElementById("startStopBtn");
    if (!running) {
        running = true;
        button.textContent = "Stop Timer";
        timerInterval = setInterval(updateTimer, 1000);
    } else {
        running = false;
        button.textContent = "Start Timer";
        clearInterval(timerInterval);
    }
}

// Function to update the timer every second
function updateTimer() {
    totalSeconds++;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    document.getElementById("time").textContent =
        `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(seconds)}`;
}

// Pad single-digit numbers with a leading zero
function padNumber(number) {
    return number < 10 ? '0' + number : number;
}

// Reset the timer and counter
function resetTimer() {
    clearInterval(timerInterval);
    running = false;
    totalSeconds = 0;
    document.getElementById("time").textContent = "00:00:00";
    document.getElementById("startStopBtn").textContent = "Start Timer";
}

// Increment the task counter
function incrementTask() {
    taskCount++;
    document.getElementById("taskCount").textContent = taskCount;
}
