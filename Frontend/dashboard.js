import { auth, db } from './firebase.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

let trafficChart;
const maxDataPoints = 10;
const chartLabels = [];
const downloadData = [];
const uploadData = [];

// Route Protection Guard
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = 'login.html';
    }
});

function initChart() {
    const ctx = document.getElementById('trafficChart').getContext('2d');
    trafficChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartLabels,
            datasets: [
                {
                    label: 'Download (Mbps)',
                    data: downloadData,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Upload (Mbps)',
                    data: uploadData,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

window.analyzeTraffic = async function() {
    // Generate realistic simulated metrics
    const download = parseFloat((Math.random() * 90 + 10).toFixed(2)); 
    const upload = parseFloat((Math.random() * 45 + 5).toFixed(2));
    const latency = Math.floor(Math.random() * 120 + 10);

    let status = "Stable";
    let recommendation = "Current path performance optimal. Maintain routing.";
    
    const statusEl = document.getElementById('status');
    statusEl.className = ""; 

    if (latency > 80 || download < 25) {
        status = "High Congestion";
        recommendation = "Reroute traffic through secondary ISP gateway (Path B).";
        statusEl.classList.add("status-high");
    } else {
        statusEl.classList.add("status-stable");
    }

    document.getElementById('download').innerText = download;
    document.getElementById('upload').innerText = upload;
    document.getElementById('latency').innerText = latency;
    statusEl.innerText = status;
    document.getElementById('recommendation').innerText = recommendation;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    chartLabels.push(currentTime);
    downloadData.push(download);
    uploadData.push(upload);

    if (chartLabels.length > maxDataPoints) {
        chartLabels.shift();
        downloadData.shift();
        uploadData.shift();
    }
    trafficChart.update();

    try {
        await addDoc(collection(db, "trafficLogs"), {
            downloadSpeed: download,
            uploadSpeed: upload,
            latency: latency,
            status: status,
            recommendation: recommendation,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Database log failed: ", error);
    }
};

window.logout = async function() {
    try {
        await signOut(auth);
        window.location.href = 'login.html';
    } catch (error) {
        alert("Logout failed: " + error.message);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    initChart();
    
    document.getElementById('analyzeBtn').addEventListener('click', window.analyzeTraffic);
    document.getElementById('logoutBtn').addEventListener('click', window.logout);

    // Initial analysis on load, then loop every 5 seconds
    window.analyzeTraffic(); 
    setInterval(() => {
        window.analyzeTraffic();
    }, 5000);
});