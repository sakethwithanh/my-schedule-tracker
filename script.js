document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/yydrn7866tvuv';

    // --- DATA ---
    let schedule = JSON.parse(localStorage.getItem('userSchedule')) || [];
    let templates = JSON.parse(localStorage.getItem('userTemplates')) || {};
    
    // --- DATA MIGRATION ---
    // Simple migration to add 'priority' to old tasks
    schedule.forEach(task => {
        if (!task.priority) task.priority = 'medium';
    });

    const saveSchedule = () => {
        localStorage.setItem('userSchedule', JSON.stringify(schedule));
        displayTasks(datePickerEl.value);
        generateReport();
    };
    const saveTemplates = () => localStorage.setItem('userTemplates', JSON.stringify(templates));

    // --- DOM ELEMENTS ---
    const scheduleListBody = document.getElementById('schedule-list-body'), datePickerEl = document.getElementById('date-picker'), addTaskForm = document.getElementById('add-task-form'), reportMonthEl = document.getElementById('report-month'), reportYearEl = document.getElementById('report-year'), reportChartCanvas = document.getElementById('report-chart').getContext('2d'), reportDetailsEl = document.getElementById('report-details'), themeToggleBtn = document.getElementById('theme-toggle-btn'), noReportDataEl = document.getElementById('no-report-data'), chartContainerEl = document.querySelector('.chart-container'), templatesModalOverlay = document.getElementById('templates-modal-overlay'), manageTemplatesBtn = document.getElementById('manage-templates-btn'), closeModalBtn = document.getElementById('close-modal-btn'), saveTemplateBtn = document.getElementById('save-template-btn'), savedTemplatesList = document.getElementById('saved-templates-list'), reportInsightsEl = document.getElementById('report-insights'), toastContainer = document.getElementById('toast-container');
    let reportChart = null, noteSaveTimer = null;

    // --- UTILITY & HELPERS ---
    const getDateString = (date) => date.toISOString().split('T')[0];
    const showToast = (message, type = 'info') => {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => toast.remove());
        }, 3000);
    };
    const debounce = (func, delay) => {
        return (...args) => {
            clearTimeout(noteSaveTimer);
            noteSaveTimer = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    };
    const parseTime = (timeStr) => { /* ... (same as previous version) ... */ if (!timeStr || typeof timeStr !== 'string') return 0; const time = timeStr.split(' or ')[0].trim(); const parts = time.match(/(\d+):?(\d+)?\s*(AM|PM)/i); if (!parts) return 0; let [ , hours, minutes] = parts; hours = parseInt(hours, 10); minutes = minutes ? parseInt(minutes, 10) : 0; const period = parts[3].toUpperCase(); if (period === 'PM' && hours !== 12) hours += 12; if (period === 'AM' && hours === 12) hours = 0; return hours * 60 + minutes; };
    const getTaskDurationInMinutes = (taskObject) => { /* ... (same as previous version) ... */ const start = parseTime(taskObject.start); const end = parseTime(taskObject.end); return end < start ? (1440 - start) + end : end - start; };

    // --- API & CACHING ---
    let dailyDataCache = {};
    const loadDataForDate = async (dateString) => {
        if (dailyDataCache[dateString]) return dailyDataCache[dateString];
        if (!SHEETDB_API_URL.includes('sheetdb.io')) return {};
        try {
            const response = await fetch(`${SHEETDB_API_URL}/search?date=${dateString}`);
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();
            const formattedData = data.reduce((acc, row) => ({ ...acc, [row.task]: { status: row.status, notes: row.notes || '' } }), {});
            dailyDataCache[dateString] = formattedData; return formattedData;
        } catch (error) { showToast('Error loading data.', 'error'); return {}; }
    };
    
    // --- DISPLAY LOGIC ---
    const displayTasks = async (dateString) => {
        const dailyData = await loadDataForDate(dateString);
        scheduleListBody.innerHTML = "";
        document.getElementById('main-heading').textContent = dateString === getDateString(new Date()) ? "My Schedule" : `Schedule for ${dateString}`;
        if (schedule.length === 0) {
            scheduleListBody.innerHTML = `<div class="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48"><path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 005.16-4.252.84.84 0 00-.01-1.05l-2.12-2.121a.75.75 0 00-1.061 0l-1.17 1.17a.75.75 0 00-1.06 1.06l1.17 1.17-1.414 1.414a1 1 0 01-1.414 0l-1.17-1.17a.75.75 0 00-1.06-1.06l-1.17 1.17a.75.75 0 000 1.061l2.121 2.12a.84.84 0 001.05.01 16.975 16.975 0 005.16-4.252zM1.942 10.952a16.975 16.975 0 015.16-4.252.838.838 0 011.05.01l2.12 2.12a.75.75 0 010 1.06l-1.17 1.17a.75.75 0 01-1.06 0l-1.17-1.17a.75.75 0 01-1.06-1.06l1.17-1.17-1.414-1.414a1 1 0 00-1.414 0L5.318 9.7a.75.75 0 01-1.06 0l-2.121-2.12a.838.838 0 01-.01-1.05z" clip-rule="evenodd" /></svg>
                <h3>Schedule is Empty</h3>
                <p>Add a task below or load a template to get started.</p>
            </div>`;
        } else {
            schedule.forEach((item, index) => {
                const dayData = dailyData[item.task] || { status: 'pending', notes: '' };
                const itemDiv = document.createElement('div');
                itemDiv.className = 'schedule-item';
                itemDiv.dataset.priority = item.priority;
                itemDiv.dataset.taskName = item.task;
                itemDiv.style.animationDelay = `${index * 50}ms`;
                itemDiv.innerHTML = `
                    <div class="task-main-info">
                        <div class="task-col task-name-priority">
                             <div class="priority-selector">
                                <button class="priority-btn ${item.priority === 'high' ? 'active' : ''}" data-priority="high"></button>
                                <button class="priority-btn ${item.priority === 'medium' ? 'active' : ''}" data-priority="medium"></button>
                                <button class="priority-btn ${item.priority === 'low' ? 'active' : ''}" data-priority="low"></button>
                            </div>
                            <span>${item.task}</span>
                        </div>
                        <div class="time-col">${item.start} - ${item.end}</div>
                        <div class="status-col">
                            <div class="status-buttons">
                                <button class="icon-btn status-btn ${dayData.status === 'done' ? 'selected' : ''}" data-status="done" title="Done"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.06-1.06l-3.109 3.108-1.59-1.59a.75.75 0 00-1.06 1.061l2.12 2.12a.75.75 0 001.06 0l3.64-3.64z" clip-rule="evenodd" /></svg></button>
                                <button class="icon-btn status-btn ${dayData.status === 'fail' ? 'selected' : ''}" data-status="fail" title="Not Done"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clip-rule="evenodd" /></svg></button>
                            </div>
                        </div>
                        <div class="actions-col">
                            <button class="icon-btn delete-task-btn" title="Delete Task"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.006a.75.75 0 01-.749.658H3.236a.75.75 0 01-.749-.658L1.482 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.9h1.368c1.603 0 2.816 1.336 2.816 2.9zM6.438 6.246L5.69 18.75h12.62L17.562 6.246H6.438z" clip-rule="evenodd" /></svg></button>
                        </div>
                    </div>
                    <div class="task-notes-area hidden">
                        <textarea class="notes-input" placeholder="Add a note for today...">${dayData.notes}</textarea>
                    </div>
                `;
                scheduleListBody.appendChild(itemDiv);
            });
        }
    };
    
    // --- DATA UPDATE LOGIC ---
    const updateTaskData = debounce(async (taskName, newStatus, newNotes) => {
        const dateString = datePickerEl.value;
        const currentDataForDay = await loadDataForDate(dateString);
        const recordExists = !!currentDataForDay[taskName];
        
        let statusToSave = newStatus !== undefined ? newStatus : (currentDataForDay[taskName]?.status || 'pending');
        let notesToSave = newNotes !== undefined ? newNotes : (currentDataForDay[taskName]?.notes || '');

        const method = recordExists ? 'PATCH' : 'POST';
        const url = recordExists ? `${SHEETDB_API_URL}/task/${encodeURIComponent(taskName)}?date=${dateString}` : SHEETDB_API_URL;
        const body = recordExists 
            ? { status: statusToSave, notes: notesToSave } 
            : { data: { date: dateString, task: taskName, status: statusToSave, notes: notesToSave } };

        try {
            const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            if (!response.ok) throw new Error('Failed to save data');
            delete dailyDataCache[dateString]; // Invalidate cache
            if (newNotes !== undefined) showToast(`Note for "${taskName}" saved!`, 'success');
            if (newStatus !== undefined) displayTasks(dateString); // Full refresh only on status change
        } catch (error) { showToast(`Error saving "${taskName}".`, 'error'); }
    }, 800);

    // --- REPORTING (with Insights) ---
    const generateReport = async () => { /* ... (logic is mostly the same as previous, but points to new display functions) ... */ const month = String(reportMonthEl.value).padStart(2, '0'); const year = reportYearEl.value; if (!SHEETDB_API_URL.includes("sheetdb.io")) return; try { const response = await fetch(`${SHEETDB_API_URL}/search?date=${year}-${month}*`); if (!response.ok) throw new Error("Failed to fetch report data"); const monthData = await response.json(); const perTaskData = {}; schedule.forEach(item => { perTaskData[item.task] = { done: 0, total: 0, consistency: 0 }; }); monthData.forEach(row => { if (perTaskData[row.task] && row.status !== 'pending') { perTaskData[row.task].total++; if (row.status === 'done') perTaskData[row.task].done++; } }); let totalTracked = 0; for(const task in perTaskData){ const { done, total } = perTaskData[task]; perTaskData[task].consistency = total > 0 ? (done / total) * 100 : 0; totalTracked += total; } if (schedule.length === 0 || totalTracked === 0) { noReportDataEl.classList.remove('hidden'); chartContainerEl.style.display = 'none'; reportDetailsEl.style.display = 'none'; reportInsightsEl.classList.add('hidden'); if (reportChart) reportChart.destroy(); } else { noReportDataEl.classList.add('hidden'); chartContainerEl.style.display = 'block'; reportDetailsEl.style.display = 'block'; reportInsightsEl.classList.remove('hidden'); displayReportChart(perTaskData); displayReportDetails(perTaskData); displayReportInsights(perTaskData); } } catch (error) { console.error("Error generating report:", error); showToast('Could not generate report.', 'error'); }};
    const displayReportInsights = (perTaskData) => {
        const tasksWithData = Object.entries(perTaskData).filter(([,data]) => data.total > 0);
        let insightsHTML = '';
        if(tasksWithData.length === 0) {
            insightsHTML = `<div class="insight-card"><span class="insight-title">No data to analyze</span><span class="insight-value">Track tasks to see insights</span></div>`;
        } else {
            const best = tasksWithData.reduce((a, b) => a[1].consistency > b[1].consistency ? a : b);
            const worst = tasksWithData.reduce((a, b) => a[1].consistency < b[1].consistency ? a : b);
            const totalMinutes = schedule.reduce((sum, taskItem) => (sum + (getTaskDurationInMinutes(taskItem) * (perTaskData[taskItem.task]?.done || 0))), 0);
            
            insightsHTML = `
                <div class="insight-card"><span class="insight-title">Total Productive Hours</span><span class="insight-value">${(totalMinutes / 60).toFixed(1)} hrs</span></div>
                <div class="insight-card"><span class="insight-title">Most Consistent Task</span><span class="insight-value">${best[0]} (${best[1].consistency.toFixed(0)}%)</span></div>
                <div class="insight-card"><span class="insight-title">Needs Improvement</span><span class="insight-value">${worst[0]} (${worst[1].consistency.toFixed(0)}%)</span></div>
            `;
        }
        reportInsightsEl.innerHTML = insightsHTML;
    };
    const displayReportDetails = (perTaskData) => { /* ... (same as previous version with progress bar) ... */ let detailsHTML = '<ul>'; schedule.forEach(taskItem => { const data = perTaskData[taskItem.task] || { done: 0, total: 0, consistency: 0 }; detailsHTML += `<li><h4>${taskItem.task}</h4><p><strong>${data.done} / ${data.total} days</strong></p><div class="progress-bar-container"><div class="progress-bar" style="width: ${data.consistency}%;"></div></div></li>`; }); detailsHTML += '</ul>'; reportDetailsEl.innerHTML = detailsHTML; };
    const displayReportChart = (perTaskData) => { /* ... (same as previous version) ... */ if (reportChart) reportChart.destroy(); const labels = schedule.map(t => t.task); const completionData = labels.map(task => perTaskData[task]?.consistency || 0); const computedStyles = getComputedStyle(document.documentElement); const accentColor = computedStyles.getPropertyValue('--accent-color-start').trim(); const gridColor = computedStyles.getPropertyValue('--border-color').trim(); const textColor = computedStyles.getPropertyValue('--text-primary').trim(); reportChart = new Chart(reportChartCanvas, { type: 'bar', data: { labels, datasets: [{ label: 'Consistency %', data: completionData, backgroundColor: 'rgba(100, 255, 218, 0.2)', borderColor: accentColor, borderWidth: 2, borderRadius: 5 }] }, options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y', scales: { y: { grid: { display: false }, ticks: { color: textColor, font: { family: "'Inter', sans-serif" } } }, x: { beginAtZero: true, max: 100, grid: { color: gridColor }, ticks: { color: textColor, font: { family: "'Inter', sans-serif" }, callback: (v) => v + "%" } } }, plugins: { legend: { display: false }, title: { display: true, text: 'Monthly Task Consistency', color: textColor, font: { family: "'Inter', sans-serif", size: 16 } }, tooltip: { callbacks: { label: c => ` Consistency: ${parseFloat(c.raw).toFixed(1)}%` } } } } });};

    // --- EVENT LISTENERS ---
    const initEventListeners = () => {
        themeToggleBtn.addEventListener('click', () => {
            const isLight = document.body.classList.toggle('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            if (reportChart) generateReport();
        });

        addTaskForm.addEventListener('submit', e => {
            e.preventDefault();
            const newTask = { task: e.target.elements['new-task-name'].value.trim(), start: e.target.elements['new-task-start'].value.trim(), end: e.target.elements['new-task-end'].value.trim(), priority: 'medium' };
            if (newTask.task && newTask.start && newTask.end) {
                if (schedule.some(t => t.task.toLowerCase() === newTask.task.toLowerCase())) { showToast('A task with this name already exists.', 'error'); return; }
                schedule.push(newTask);
                saveSchedule();
                e.target.reset();
            }
        });

        scheduleListBody.addEventListener('click', e => {
            const taskItem = e.target.closest('.schedule-item');
            if (!taskItem) return;
            const taskName = taskItem.dataset.taskName;

            // Priority Change
            if (e.target.classList.contains('priority-btn')) {
                const newPriority = e.target.dataset.priority;
                const taskIndex = schedule.findIndex(t => t.task === taskName);
                if (taskIndex > -1) {
                    schedule[taskIndex].priority = newPriority;
                    saveSchedule();
                }
            }
            // Status Change
            else if (e.target.closest('.status-btn')) {
                const button = e.target.closest('.status-btn');
                const currentStatus = button.classList.contains('selected') ? 'pending' : button.dataset.status;
                updateTaskData(taskName, currentStatus, undefined);
            }
            // Delete Task
            else if (e.target.closest('.delete-task-btn')) {
                if (confirm(`Are you sure you want to permanently delete "${taskName}"?`)) {
                    schedule = schedule.filter(task => task.task !== taskName);
                    saveSchedule();
                    showToast(`Task "${taskName}" deleted.`, 'success');
                }
            }
            // Expand/Collapse Notes
            else if (e.target.closest('.task-main-info')) {
                 taskItem.querySelector('.task-notes-area').classList.toggle('hidden');
            }
        });
        
        // Auto-saving notes input
        scheduleListBody.addEventListener('input', e => {
            if (e.target.classList.contains('notes-input')) {
                const taskName = e.target.closest('.schedule-item').dataset.taskName;
                updateTaskData(taskName, undefined, e.target.value);
            }
        });

        // Template Modal Listeners
        manageTemplatesBtn.addEventListener('click', () => { /* ... (same as previous) ... */ displayTemplates(); templatesModalOverlay.classList.remove('hidden');});
        closeModalBtn.addEventListener('click', () => templatesModalOverlay.classList.add('hidden'));
        templatesModalOverlay.addEventListener('click', e => { if (e.target === templatesModalOverlay) templatesModalOverlay.classList.add('hidden'); });
        saveTemplateBtn.addEventListener('click', () => { /* ... (same with toasts) ... */ const nameInput = document.getElementById('new-template-name'); const name = nameInput.value.trim(); if (name && schedule.length > 0) { templates[name] = [...schedule]; saveTemplates(); displayTemplates(); nameInput.value = ''; showToast(`Template "${name}" saved!`, 'success'); } else if (schedule.length === 0) { showToast("Cannot save an empty schedule.", 'error'); } else { showToast("Please provide a template name.", 'error'); } });
        savedTemplatesList.addEventListener('click', e => { /* ... (same with toasts) ... */ const name = e.target.dataset.name; if (e.target.classList.contains('load-template-btn')) { schedule = [...templates[name]]; saveSchedule(); templatesModalOverlay.classList.add('hidden'); showToast(`Template "${name}" loaded.`, 'success'); } if (e.target.classList.contains('delete-template-btn')) { if (confirm(`Delete the "${name}" template?`)) { delete templates[name]; saveTemplates(); displayTemplates(); showToast(`Template "${name}" deleted.`, 'info'); } } });

        const displayTemplates = () => { /* ... (same as previous) ... */ savedTemplatesList.innerHTML = ''; if (Object.keys(templates).length === 0) { savedTemplatesList.innerHTML = `<p class="no-templates">No saved templates.</p>`; return; } for (const name in templates) { const tplDiv = document.createElement('div'); tplDiv.className = 'template-item'; tplDiv.innerHTML = `<span>${name}</span><div><button class="load-template-btn" data-name="${name}">Load</button><button class="delete-template-btn" data-name="${name}">Delete</button></div>`; savedTemplatesList.appendChild(tplDiv); } };

        // Date & Report Listeners
        datePickerEl.addEventListener('input', e => displayTasks(e.target.value));
        const setupReportListeners = () => {
            ['change', 'click'].forEach(evt => {
                reportMonthEl.addEventListener(evt, generateReport);
                reportYearEl.addEventListener(evt, generateReport);
            });
        };
        setupReportListeners();
    };

    // --- INITIALIZATION ---
    const init = () => {
        document.body.classList.toggle('light-theme', localStorage.getItem('theme') === 'light');
        datePickerEl.value = getDateString(new Date());
        const populateDateSelectors = () => { /* ... (same as previous) ... */ const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]; const year = new Date().getFullYear(); months.forEach((m, i) => reportMonthEl.add(new Option(m, i + 1))); reportMonthEl.value = new Date().getMonth() + 1; for (let i = year; i >= year - 5; i--) reportYearEl.add(new Option(i, i)); };
        
        populateDateSelectors();
        initEventListeners();
        displayTasks(datePickerEl.value);
        generateReport();
    };

    init();
});
