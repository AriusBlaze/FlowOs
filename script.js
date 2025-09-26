// Timer functionality
let timerInterval;
let totalSeconds = 25 * 60; // 25 minutes
let isRunning = false;
let currentSeconds = totalSeconds;

// Statistics
let dailySessions = 0;
let dailyMinutes = 0;
let treesGrown = 0;

function updateTimerDisplay() {
    const minutes = Math.floor(currentSeconds / 60);
    const seconds = currentSeconds % 60;
    document.getElementById('timerDisplay').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update progress ring
    const progress = ((totalSeconds - currentSeconds) / totalSeconds) * 100;
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (progress / 100) * circumference;
    document.getElementById('progressCircle').style.strokeDashoffset = offset;
    document.getElementById('progressText').textContent = Math.round(progress) + '%';

    // Update tree growth
    if (progress > 50) {
        document.getElementById('treeLeaves').classList.add('growing');
    }
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(() => {
            if (currentSeconds > 0) {
                currentSeconds--;
                updateTimerDisplay();
            } else {
                // Timer completed
                pauseTimer();
                completeFocusSession();
            }
        }, 1000);
    }
}

function pauseTimer() {
    isRunning = false;
    clearInterval(timerInterval);
}

function resetTimer() {
    pauseTimer();
    currentSeconds = totalSeconds;
    updateTimerDisplay();
    document.getElementById('treeLeaves').classList.remove('growing');
}

function setTimer(minutes) {
    totalSeconds = minutes * 60;
    currentSeconds = totalSeconds;
    updateTimerDisplay();
    document.getElementById('treeLeaves').classList.remove('growing');
}

function completeFocusSession() {
    dailySessions++;
    dailyMinutes += Math.floor(totalSeconds / 60);
    treesGrown++;
    
    updateStats();
    
    // Celebration animation
    document.getElementById('treeLeaves').classList.add('growing');
    
    // Show completion message
    alert('🎉 Focus session completed! Your tree has grown! 🌳');
}

function updateStats() {
    document.getElementById('dailySessions').textContent = dailySessions;
    document.getElementById('dailyTime').textContent = 
        `${Math.floor(dailyMinutes / 60)}h ${dailyMinutes % 60}m`;
    document.getElementById('treesGrown').textContent = `${treesGrown} 🌳`;
    
    // Update progress bar
    const dailyGoalMinutes = 120; // 2 hours
    const progress = Math.min((dailyMinutes / dailyGoalMinutes) * 100, 100);
    document.getElementById('dailyProgressBar').style.width = progress + '%';
    
    // Update environmental impact
    const co2Saved = (dailyMinutes * 0.1).toFixed(1); // Rough calculation
    const energySaved = (dailyMinutes * 0.05).toFixed(1);
    document.getElementById('co2Saved').textContent = `${co2Saved} kg`;
    document.getElementById('energySaved').textContent = `${energySaved} kWh`;
    document.getElementById('virtualTrees').textContent = `${treesGrown} trees`;
    
    // Update level
    let level = 'Seedling';
    if (treesGrown >= 50) level = 'Forest Guardian';
    else if (treesGrown >= 20) level = 'Tree Hugger';
    else if (treesGrown >= 10) level = 'Eco Warrior';
    else if (treesGrown >= 5) level = 'Green Thumb';
    document.getElementById('userLevel').textContent = level;
}

// Initialize charts
function initializeCharts() {
    const weeklyCtx = document.getElementById('weeklyChart').getContext('2d');
    new Chart(weeklyCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Focus Time (minutes)',
                data: [45, 60, 30, 75, 90, 45, 60],
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    const categoriesCtx = document.getElementById('categoriesChart').getContext('2d');
    new Chart(categoriesCtx, {
        type: 'doughnut',
        data: {
            labels: ['Study', 'Work', 'Reading', 'Creative', 'Other'],
            datasets: [{
                data: [35, 25, 20, 15, 5],
                backgroundColor: [
                    '#22c55e',
                    '#16a34a',
                    '#15803d',
                    '#14532d',
                    '#052e16'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Motivational quotes
const quotes = [
    "The best time to plant a tree was 20 years ago. The second best time is now. Start your focus journey today!",
    "Just as trees grow slowly but surely, your focus skills develop with consistent practice.",
    "Every focused minute is a seed planted for your future success and our planet's health.",
    "Like photosynthesis transforms sunlight into energy, focus transforms time into achievement.",
    "Your attention is the soil where your dreams take root and grow into reality."
];

function updateMotivation() {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('motivationText').textContent = randomQuote;
}

// Navigation functionality
function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.add('hidden');
    });

    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.remove('hidden');
    }

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    updateTimerDisplay();
    updateStats();
    initializeCharts();
    updateMotivation();
    showSection('home');
    
    // Update motivation every 5 minutes
    setInterval(updateMotivation, 300000);
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        if (isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    }
});