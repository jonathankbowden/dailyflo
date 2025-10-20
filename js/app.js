// Habit Tracker App JavaScript

class HabitTracker {
    constructor() {
        this.habits = this.loadHabits();
        this.currentDate = new Date();
        this.init();
    }

    init() {
        this.updateCurrentDate();
        this.bindEvents();
        this.renderHabits();
        this.updateStats();
        this.renderProgressChart();
    }

    // Date Management
    updateCurrentDate() {
        const dateElement = document.getElementById('currentDate');
        if (dateElement) {
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            dateElement.textContent = this.currentDate.toLocaleDateString('en-US', options);
        }
    }

    // Event Binding
    bindEvents() {
        // Add habit button
        const addHabitBtn = document.getElementById('addHabitBtn');
        if (addHabitBtn) {
            addHabitBtn.addEventListener('click', () => this.showAddHabitForm());
        }

        // Cancel button
        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.hideAddHabitForm());
        }

        // Save habit button
        const saveHabitBtn = document.getElementById('saveHabitBtn');
        if (saveHabitBtn) {
            saveHabitBtn.addEventListener('click', () => this.saveHabit());
        }

        // Enter key in habit name input
        const habitNameInput = document.getElementById('habitName');
        if (habitNameInput) {
            habitNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.saveHabit();
                }
            });
        }
    }

    // Form Management
    showAddHabitForm() {
        const form = document.getElementById('addHabitForm');
        const btn = document.getElementById('addHabitBtn');
        if (form && btn) {
            form.style.display = 'block';
            btn.style.display = 'none';
            document.getElementById('habitName').focus();
        }
    }

    hideAddHabitForm() {
        const form = document.getElementById('addHabitForm');
        const btn = document.getElementById('addHabitBtn');
        if (form && btn) {
            form.style.display = 'none';
            btn.style.display = 'inline-flex';
            this.clearForm();
        }
    }

    clearForm() {
        document.getElementById('habitName').value = '';
        document.getElementById('habitCategory').value = 'health';
    }

    // Habit Management
    saveHabit() {
        const nameInput = document.getElementById('habitName');
        const categorySelect = document.getElementById('habitCategory');

        if (!nameInput || !categorySelect) return;

        const name = nameInput.value.trim();
        const category = categorySelect.value;

        if (!name) {
            nameInput.focus();
            return;
        }

        const newHabit = {
            id: this.generateId(),
            name: name,
            category: category,
            createdAt: new Date().toISOString(),
            completions: {},
            streak: 0,
            longestStreak: 0
        };

        this.habits.push(newHabit);
        this.saveHabits();
        this.renderHabits();
        this.updateStats();
        this.hideAddHabitForm();
    }

    deleteHabit(habitId) {
        if (confirm('Are you sure you want to delete this habit?')) {
            this.habits = this.habits.filter(habit => habit.id !== habitId);
            this.saveHabits();
            this.renderHabits();
            this.updateStats();
        }
    }

    toggleHabitCompletion(habitId) {
        const habit = this.habits.find(h => h.id === habitId);
        if (!habit) return;

        const today = this.getDateString(this.currentDate);
        const isCompleted = habit.completions[today];

        if (isCompleted) {
            delete habit.completions[today];
        } else {
            habit.completions[today] = true;
        }

        this.updateStreak(habit);
        this.saveHabits();
        this.renderHabits();
        this.updateStats();
    }

    updateStreak(habit) {
        const today = new Date(this.currentDate);
        let currentStreak = 0;
        let checkDate = new Date(today);

        // Count consecutive days backwards from today
        while (true) {
            const dateString = this.getDateString(checkDate);
            if (habit.completions[dateString]) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }

        habit.streak = currentStreak;
        habit.longestStreak = Math.max(habit.longestStreak, currentStreak);
    }

    // Rendering
    renderHabits() {
        const habitsGrid = document.getElementById('habitsGrid');
        const emptyState = document.getElementById('emptyState');

        if (!habitsGrid || !emptyState) return;

        if (this.habits.length === 0) {
            habitsGrid.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        habitsGrid.style.display = 'grid';
        emptyState.style.display = 'none';

        habitsGrid.innerHTML = this.habits.map(habit => this.createHabitCard(habit)).join('');

        // Bind event listeners for habit cards
        this.habits.forEach(habit => {
            const checkBtn = document.getElementById(`check-${habit.id}`);
            const deleteBtn = document.getElementById(`delete-${habit.id}`);

            if (checkBtn) {
                checkBtn.addEventListener('click', () => this.toggleHabitCompletion(habit.id));
            }

            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => this.deleteHabit(habit.id));
            }
        });
    }

    createHabitCard(habit) {
        const today = this.getDateString(this.currentDate);
        const isCompleted = habit.completions[today];
        const completionRate = this.getCompletionRate(habit);
        const categoryEmoji = this.getCategoryEmoji(habit.category);

        return `
            <div class="habit-card ${isCompleted ? 'completed' : ''}">
                <div class="habit-header">
                    <div>
                        <div class="habit-title">${categoryEmoji} ${habit.name}</div>
                        <div class="habit-category">${habit.category}</div>
                    </div>
                    <div class="habit-actions">
                        <button class="btn-icon" id="delete-${habit.id}" title="Delete habit">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3,6 5,6 21,6"></polyline>
                                <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="habit-progress">
                    <div class="progress-info">
                        <span class="streak-info">
                            <span class="streak-count">${habit.streak}</span> day streak
                        </span>
                        <span class="completion-rate">${completionRate}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${completionRate}%"></div>
                    </div>
                </div>

                <div class="habit-footer">
                    <button
                        class="check-button ${isCompleted ? 'completed' : ''}"
                        id="check-${habit.id}"
                    >
                        ${isCompleted ? 'Completed' : 'Mark Done'}
                    </button>
                    <span class="longest-streak">Best: ${habit.longestStreak} days</span>
                </div>
            </div>
        `;
    }

    // Statistics
    updateStats() {
        const today = this.getDateString(this.currentDate);

        const totalHabits = this.habits.length;
        const completedToday = this.habits.filter(habit => habit.completions[today]).length;
        const longestStreak = Math.max(...this.habits.map(h => h.longestStreak), 0);
        const weeklyRate = this.getWeeklyCompletionRate();

        this.updateStatElement('totalHabits', totalHabits);
        this.updateStatElement('completedToday', completedToday);
        this.updateStatElement('longestStreak', longestStreak);
        this.updateStatElement('completionRate', `${weeklyRate}%`);
    }

    updateStatElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    getWeeklyCompletionRate() {
        if (this.habits.length === 0) return 0;

        const weekStart = new Date(this.currentDate);
        weekStart.setDate(weekStart.getDate() - 6); // Last 7 days

        let totalPossible = 0;
        let totalCompleted = 0;

        for (let i = 0; i < 7; i++) {
            const checkDate = new Date(weekStart);
            checkDate.setDate(weekStart.getDate() + i);
            const dateString = this.getDateString(checkDate);

            this.habits.forEach(habit => {
                totalPossible++;
                if (habit.completions[dateString]) {
                    totalCompleted++;
                }
            });
        }

        return totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
    }

    getCompletionRate(habit) {
        const last30Days = this.getLast30Days();
        let completed = 0;
        let total = last30Days.length;

        last30Days.forEach(date => {
            if (habit.completions[this.getDateString(date)]) {
                completed++;
            }
        });

        return total > 0 ? Math.round((completed / total) * 100) : 0;
    }

    getLast30Days() {
        const dates = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date(this.currentDate);
            date.setDate(date.getDate() - i);
            dates.push(date);
        }
        return dates;
    }

    // Progress Chart
    renderProgressChart() {
        const canvas = document.getElementById('progressChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Get last 7 days data
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(this.currentDate);
            date.setDate(date.getDate() - i);
            last7Days.push(date);
        }

        const data = last7Days.map(date => {
            const dateString = this.getDateString(date);
            const completed = this.habits.filter(habit => habit.completions[dateString]).length;
            const total = this.habits.length;
            return total > 0 ? (completed / total) * 100 : 0;
        });

        // Chart dimensions
        const padding = 40;
        const chartWidth = width - (padding * 2);
        const chartHeight = height - (padding * 2);

        // Draw axes
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;

        // Y-axis
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.stroke();

        // X-axis
        ctx.beginPath();
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();

        // Draw bars
        const barWidth = chartWidth / data.length * 0.8;
        const barSpacing = chartWidth / data.length * 0.2;

        data.forEach((value, index) => {
            const barHeight = (value / 100) * chartHeight;
            const x = padding + (index * (barWidth + barSpacing)) + barSpacing / 2;
            const y = height - padding - barHeight;

            // Gradient
            const gradient = ctx.createLinearGradient(0, y, 0, height - padding);
            gradient.addColorStop(0, '#3b82f6');
            gradient.addColorStop(1, '#1d4ed8');

            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth, barHeight);

            // Day labels
            ctx.fillStyle = '#64748b';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            const dayName = last7Days[index].toLocaleDateString('en-US', { weekday: 'short' });
            ctx.fillText(dayName, x + barWidth / 2, height - padding + 20);
        });

        // Y-axis labels
        ctx.fillStyle = '#64748b';
        ctx.font = '10px Arial';
        ctx.textAlign = 'right';
        for (let i = 0; i <= 4; i++) {
            const value = (i / 4) * 100;
            const y = height - padding - (i / 4) * chartHeight;
            ctx.fillText(`${Math.round(value)}%`, padding - 10, y + 3);
        }
    }

    // Utility Functions
    getCategoryEmoji(category) {
        const emojis = {
            health: '💊',
            fitness: '🏃‍♂️',
            productivity: '📈',
            mindfulness: '🧘',
            learning: '📚',
            other: '⭐'
        };
        return emojis[category] || '⭐';
    }

    getDateString(date) {
        return date.toISOString().split('T')[0];
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Local Storage
    loadHabits() {
        try {
            const saved = localStorage.getItem('habittracker_habits');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading habits:', error);
            return [];
        }
    }

    saveHabits() {
        try {
            localStorage.setItem('habittracker_habits', JSON.stringify(this.habits));
        } catch (error) {
            console.error('Error saving habits:', error);
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HabitTracker();
});