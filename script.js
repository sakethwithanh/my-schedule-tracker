document.addEventListener('DOMContentLoaded', () => {
    // --- IMPORTANT CONFIGURATION ---
    const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/yydrn7866tvuv';
    // --- END CONFIGURATION ---

    // --- DATA ---
    // The schedule now starts empty. It will be loaded from the user's browser storage.
    const defaultSchedule = [];
    
    // Load schedule from local storage or use the empty default
    let schedule = JSON.parse(localStorage.getItem('userSchedule')) || defaultSchedule;
    const saveSchedule = () => localStorage.setItem('userSchedule', JSON.stringify(schedule));

    // --- DOM ELEMENTS ---
    const scheduleListBody = document.getElementById('schedule-list-body');
    const datePickerEl = document.getElementById('date-picker');
    const addTaskForm = document.getElementById('add-task-form');
    const reportMonthEl = document.getElementById('report-month');
    const reportYearEl = document.getElementById('report-year');
    const generateReportBtn = document.getElementById('generate-report-btn');
    const reportChartCanvas = document.getElementById('report-chart').getContext('2d');
    const reportDetailsEl = document.getElementById('report-details');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const noReportDataEl = document.getElementById('no-report-data');
    const chartContainerEl = document.querySelector('.chart-container');
    let reportChart = null;
    
    // --- THEME SWITCHER LOGIC ---
    const applyTheme = (theme) => document.body.classList.toggle('light-theme', theme === 'light');
    themeToggleBtn.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        if (reportChart) generateReport();
    });

    // --- TIME & UTILITY FUNCTIONS ---
    const getDateString = (date) => date.toISOString().split('T')[0];
    const parseTime = (timeStr) => {
        const time = timeStr.split(' or ')[0].trim(); let [hours, minutes] = time.split(' ')[0].split(':').map(Number);
        if (time.includes('PM') && hours !== 12) hours += 12; if (time.includes('AM') && hours === 12) hours = 0;
        return hours * 60 + minutes;
    };
    const getTaskDurationInMinutes = (taskObject) => {
        const start = parseTime(taskObject.start); const end = parseTime(taskObject.end);
        return end < start ? (1440 - start) + end : end - start;
    };

    // --- API-BASED DATA HANDLING ---
    let dailyDataCache = {}; 
    const loadDataForDate = async (dateString) => {
        if (dailyDataCache[dateString]) return dailyDataCache[dateString];
        if (!SHEETDB_API_URL.includes('sheetdb.io')) return {};
        try {
            const response = await fetch(`${SHEETDB_API_URL}/search?date=${dateString}`);
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();
            const formattedData = data.reduce((acc, row) => ({ ...acc, [row.task]: row.status }), {});
            dailyDataCache[dateString] = formattedData; return formattedData;
        } catch (error) { console.error("Error loading data:", error); return {}; }
    };

    // --- CORE DISPLAY & UPDATE LOGIC ---
    const displayTasks = async (dateString) => {
        const dailyData = await loadDataForDate(dateString); // Fetches statuses for the selected day
        scheduleListBody.innerHTML = "";
        document.getElementById('main-heading').textContent = dateString === getDateString(new Date()) ? "My Schedule" : `Schedule for ${dateString}`;
        
        if (schedule.length === 0) {
            scheduleListBody.innerHTML = `<div class="schedule-item-empty">No tasks defined. Add a task below to get started!</div>`;
        } else {
            schedule.forEach(item => {
                const status = dailyData[item.task] || 'pending'; // Status is from daily data, defaults to pending
                const itemDiv = document.createElement('div'); itemDiv.className = 'schedule-item';
                itemDiv.innerHTML = `<span class="task-col">${item.task}</span>
                    <span class="time-col">${item.start}</span>
                    <span class="time-col">${item.end}</span>
                    <span class="status-col">
                        <div class="status-buttons" data-task="${item.task}">
                            <button class="done-btn ${status === 'done' ? 'selected' : ''}" title="Done">✔️</button>
                            <button class="fail-btn ${status === 'fail' ? 'selected' : ''}" title="Not Done">❌</button>
                        </div>
                    </span>
                    <span class="actions-col">
                        <button class="delete-task-btn" data-task="${item.task}" title="Delete Task">🗑️</button>
                    </span>`;
                scheduleListBody.appendChild(itemDiv);
            });
        }
    };

    const handleStatusClick = (button) => {
        const taskName = button.closest('.status-buttons').dataset.task;
        const newStatus = !button.classList.contains('selected') ? (button.classList.contains('done-btn') ? 'done' : 'fail') : 'pending';
        updateTaskStatus(taskName, newStatus);
    };

    const updateTaskStatus = async (taskName, newStatus) => {
        if (!SHEETDB_API_URL.includes('sheetdb.io')) { alert('Error: SheetDB API URL is not configured.'); return; }
        const dateString = datePickerEl.value; const currentData = await loadDataForDate(dateString);
        const recordExists = !!currentData[taskName]; const method = recordExists ? 'PATCH' : 'POST';
        const url = recordExists ? `${SHEETDB_API_URL}/task/${taskName}?date=${dateString}` : SHEETDB_API_URL;
        const body = recordExists ? { status: newStatus } : { data: { date: dateString, task: taskName, status: newStatus } };
        try {
            const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            if (!response.ok) throw new Error('Failed to save data');
            delete dailyDataCache[dateString]; displayTasks(dateString);
        } catch (error) { console.error("Error saving data:", error); }
    };

    // --- REPORTING LOGIC ---
    const populateDateSelectors = () => {
        const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        const year = new Date().getFullYear(); months.forEach((m, i) => reportMonthEl.add(new Option(m, i + 1)));
        reportMonthEl.value = new Date().getMonth() + 1; for (let i = year; i >= year - 5; i--) reportYearEl.add(new Option(i, i));
    };
    
    const generateReport = async () => {
        const month = String(reportMonthEl.value).padStart(2, '0'); const year = reportYearEl.value;
        if (!SHEETDB_API_URL.includes("sheetdb.io")) return;
        try {
            const response = await fetch(`${SHEETDB_API_URL}/search?date=${year}-${month}*`);
            if (!response.ok) throw new Error("Failed to fetch report data");
            const monthData = await response.json(); const perTaskData = {};
            schedule.forEach(item => { perTaskData[item.task] = { done: 0, total: 0 }; });
            monthData.forEach(row => {
                if (perTaskData[row.task] && row.status !== 'pending') {
                    perTaskData[row.task].total++; if (row.status === 'done') perTaskData[row.task].done++;
                }
            });
            const overallTotalTracked = Object.values(perTaskData).reduce((sum, task) => sum + task.total, 0);
            if (schedule.length === 0 || overallTotalTracked === 0) {
                noReportDataEl.style.display = 'block'; chartContainerEl.style.display = 'none';
                reportDetailsEl.style.display = 'none'; if (reportChart) reportChart.destroy();
            } else {
                noReportDataEl.style.display = 'none'; chartContainerEl.style.display = 'block';
                reportDetailsEl.style.display = 'block';
                displayReportChart(perTaskData);
                displayReportDetails(perTaskData);
            }
        } catch (error) { console.error("Error generating report:", error); }
    };
    
    const displayReportDetails = (perTaskData) => {
        let detailsHTML = '<ul>'; schedule.forEach(taskItem => {
            const data = perTaskData[taskItem.task] || { done: 0, total: 0 };
            const totalHours = (getTaskDurationInMinutes(taskItem) * data.done) / 60;
            detailsHTML += `<li><h4>${taskItem.task}</h4><p><strong>Completed:</strong> ${data.done} of ${data.total} days</p><p><strong>Total Hours:</strong> ${totalHours.toFixed(1)} hrs</p></li>`;
        });
        detailsHTML += '</ul>'; reportDetailsEl.innerHTML = detailsHTML;
    };

    const displayReportChart = (perTaskData) => {
        if (reportChart) reportChart.destroy();
        const labels = schedule.map(t => t.task);
        const completionData = labels.map(task => {
            const data = perTaskData[task] || { done: 0, total: 0 };
            return data.total > 0 ? (data.done / data.total) * 100 : 0;
        });
        const computedStyles = getComputedStyle(document.body);
        const accentColor = computedStyles.getPropertyValue('--accent-color').trim();
        const gridColor = computedStyles.getPropertyValue('--border-color').trim();
        const textColor = computedStyles.getPropertyValue('--text-primary').trim();
        const barBgColor = getComputedStyle(document.querySelector('.report-controls button')).backgroundColor;
        reportChart = new Chart(reportChartCanvas, {
            type: 'bar',
            data: { labels: labels, datasets: [{ label: 'Consistency %', data: completionData, backgroundColor: barBgColor, borderColor: accentColor, borderWidth: 1, borderRadius: 4 }] },
            options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y', scales: { y: { grid: { display: false }, ticks: { color: textColor, font: { family: "'Inter', sans-serif" } } }, x: { beginAtZero: true, max: 100, grid: { color: gridColor }, ticks: { color: textColor, font: { family: "'Inter', sans-serif" }, callback: (v) => v + "%" } } }, plugins: { legend: { display: false }, title: { display: true, text: 'Monthly Task Consistency', color: textColor, font: { family: "'Inter', sans-serif", size: 18 } }, tooltip: { callbacks: { label: c => ` Consistency: ${parseFloat(c.raw).toFixed(1)}%` } } } }
        });
    };
    
    // --- EVENT LISTENERS ---
    addTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('new-task-name');
        const startInput = document.getElementById('new-task-start');
        const endInput = document.getElementById('new-task-end');
        const newTask = { task: nameInput.value.trim(), start: startInput.value.trim(), end: endInput.value.trim() };
        if (newTask.task && newTask.start && newTask.end) {
            if (schedule.some(t => t.task.toLowerCase() === newTask.task.toLowerCase())) {
                alert('A task with this name already exists.'); return;
            }
            schedule.push(newTask); saveSchedule();
            displayTasks(datePickerEl.value); generateReport();
            addTaskForm.reset();
        }
    });

    scheduleListBody.addEventListener('click', (e) => {
        const statusButton = e.target.closest('.status-buttons button');
        const deleteButton = e.target.closest('.delete-task-btn');
        if (statusButton) { handleStatusClick(statusButton); } 
        else if (deleteButton) {
            const taskNameToDelete = deleteButton.dataset.task;
            if (confirm(`Are you sure you want to delete the task "${taskNameToDelete}"?`)) {
                schedule = schedule.filter(task => task.task !== taskNameToDelete);
                saveSchedule(); displayTasks(datePickerEl.value); generateReport();
            }
        }
    });

    // --- INITIALIZATION ---
    applyTheme(localStorage.getItem('theme') || 'dark');
    datePickerEl.value = getDateString(new Date());
    displayTasks(datePickerEl.value);
    populateDateSelectors();
    generateReport();
    
    generateReportBtn.addEventListener('click', generateReport);
    reportMonthEl.addEventListener('change', generateReport);
    reportYearEl.addEventListener('change', generateReport);
    datePickerEl.addEventListener('input', (e) => displayTasks(e.target.value));
});
