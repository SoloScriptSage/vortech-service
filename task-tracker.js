let timerInterval;
let running = false;
let totalSeconds = 0;
let taskCount = 0;
let timeSpentData = [0, 0, 0];  // Initialize the time spent data array

// Function to get the current time in Poland (CET/CEST)
function updateTime() {
    const polandTime = new Date().toLocaleString("en-US", { timeZone: "Europe/Warsaw" });
    document.getElementById("currentTime").textContent = polandTime;
}

setInterval(updateTime, 1000);

// Chart creation
let chart;

function createChart() {
    const ctx = document.getElementById("timeSpentChart").getContext("2d");

    if (ctx) {
        chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Task 1", "Task 2", "Task 3"],
                datasets: [{
                    label: "Time Spent (seconds)",
                    data: timeSpentData,  // Use the initialized array
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
    } else {
        console.error("Canvas element not found!");
    }
}

function updateGraph(taskIndex, timeSpent) {
    timeSpentData[taskIndex] = timeSpent;
    chart.update();  // Updates the chart with new data
}

// Start/Stop Timer
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

// Update the timer every second
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

// Reset the timer
function resetTimer() {
    clearInterval(timerInterval);
    running = false;
    totalSeconds = 0;
    document.getElementById("time").textContent = "00:00:00";
    document.getElementById("startStopBtn").textContent = "Start Timer";
}

// Increment task counter
function incrementTask() {
    taskCount++;
    document.getElementById("taskCount").textContent = taskCount;
}

// Initialize everything when the page loads
window.onload = function() {
    console.log("Page loaded");
    createChart();
};
