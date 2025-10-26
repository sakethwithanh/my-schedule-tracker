document.addEventListener('DOMContentLoaded', () => {
    // --- ⬇️ IMPORTANT CONFIGURATION ⬇️ ---
    // PASTE YOUR SHEETDB API URL BETWEEN THE QUOTES
    const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/yydrn7866tvuv'; 
    // --- ⬆️ IMPORTANT CONFIGURATION ⬆️ ---

    // --- DATA ---
    const schedule = [
        { task: "Wakeup", start: "6:00 AM", end: "6:30 AM" },
        { task: "GYM", start: "6:30 AM", end: "8:00 AM" },
        { task: "Bath and Travel", start: "8:00 AM", end: "9:30 AM" },
        { task: "Office", start: "9:30 AM", end: "6:30 PM or 7:00 PM" },
        { task: "ML", start: "8:00 PM", end: "9:00 PM or 9:30 PM" },
        { task: "Rest", start: "9:30 PM", end: "10:00 PM" },
        { task: "DSA", start: "10:00 PM", end: "11:30 PM" },
        { task: "Sleep", start: "11:30 PM", end: "6:00 AM" }
    ];

    // --- DOM ELEMENTS ---
    const scheduleListBody = document.getElementById('schedule-list-body');
    const datePickerEl = document.getElementById('date-picker');
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
        const time = timeStr.split(' or ')[0].trim();
        const [hm, modifier] = time.split(' ');
        let [hours, minutes] = hm.split(':').map(Number);
        if (hours === 12) hours = modifier === 'AM' ? 0 : 12;
        else if (modifier === 'PM') hours += 12;
        return hours * 60 + minutes;
    };
    const getTaskDurationInMinutes = (taskObject) => {
        const startMinutes = parseTime(taskObject.start);
        const endMinutes = parseTime(taskObject.end);
        return endMinutes < startMinutes ? (1440 - startMinutes) + endMinutes : endMinutes - startMinutes;
    };

    // --- API-BASED DATA HANDLING ---
    let dailyDataCache = {}; 
    const loadDataForDate = async (dateString) => {
        if (dailyDataCache[dateString]) return dailyDataCache[dateString];
        if (!SHEETDB_API_URL.includes('sheetdb.io')) return {}; // Don't fetch if URL is not set
        try {
            const response = await fetch(`${SHEETDB_API_URL}/search?date=${dateString}`);
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();
            const formattedData = data.reduce((acc, row) => ({ ...acc, [row.task]: row.status }), {});
            dailyDataCache[dateString] = formattedData;
            return formattedData;
        } catch (error) { console.error("Error loading data:", error); return {}; }
    };

    // --- CORE DISPLAY & UPDATE LOGIC ---
    const displayTasks = async (dateString) => {
        const dailyData = await loadDataForDate(dateString);
        scheduleListBody.innerHTML = "";
        document.getElementById('main-heading').textContent = dateString === getDateString(new Date()) ? "My Schedule" : `Schedule for ${dateString}`;
        schedule.forEach(item => {
            const status = dailyData[item.task] || 'pending';
            const itemDiv = document.createElement('div');
            itemDiv.className = 'schedule-item';
            itemDiv.innerHTML = `
                <span class="task-col">${item.task}</span>
                <span class="time-col">${item.start}</span>
                <span class="time-col">${item.end}</span>
                <span class="status-col">
                    <div class="status-buttons" data-task="${item.task}">
                        <button class="done-btn ${status === 'done' ? 'selected' : ''}" title="Done">✔️</button>
                        <button class="fail-btn ${status === 'fail' ? 'selected' : ''}" title="Not Done">❌</button>
                    </div>
                </span>`;
            scheduleListBody.appendChild(itemDiv);
        });
        addEventListenersToButtons();
    };
    
    const handleStatusClick = (e) => {
        const button = e.target.closest('button');
        const taskName = button.closest('.status-buttons').dataset.task;
        const newStatus = !button.classList.contains('selected') ? (button.classList.contains('done-btn') ? 'done' : 'fail') : 'pending';
        updateTaskStatus(taskName, newStatus);
    };
    const addEventListenersToButtons = () => document.querySelectorAll('.status-buttons button').forEach(b => b.addEventListener('click', handleStatusClick));

    const updateTaskStatus = async (taskName, newStatus) => {
        if (!SHEETDB_API_URL.includes('sheetdb.io')) {
            alert('Error: SheetDB API URL is not configured in script.js');
            return;
        }
        const dateString = datePickerEl.value;
        const currentData = await loadDataForDate(dateString);
        const recordExists = !!currentData[taskName];
        const method = recordExists ? 'PATCH' : 'POST';
        const url = recordExists ? `${SHEETDB_API_URL}/task/${taskName}?date=${dateString}` : SHEETDB_API_URL;
        const body = recordExists ? { status: newStatus } : { data: { date: dateString, task: taskName, status: newStatus } };

        try {
            const response = await fetch(url, {
                method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
            });
            if (!response.ok) throw new Error('Failed to save data');
            delete dailyDataCache[dateString]; // Invalidate cache
            displayTasks(dateString);
        } catch (error) { console.error("Error saving data:", error); }
    };

    // --- REPORTING LOGIC ---
    const populateDateSelectors = () => { /* ... unchanged ... */ };
    const generateReport = async () => { /* ... unchanged ... */ };
    const displayReportDetails = (perTaskData) => { /* ... unchanged ... */ };
    const displayReportChart = (totalDone, totalTracked) => { /* ... unchanged ... */ };
    (populateDateSelectors=()=>{const e=["January","February","March","April","May","June","July","August","September","October","November","December"],t=(new Date).getFullYear();e.forEach(((e,t)=>{reportMonthEl.add(new Option(e,t+1))})),reportMonthEl.value=(new Date).getMonth()+1;for(let e=t;e>=t-5;e--)reportYearEl.add(new Option(e,e))})();
    (generateReport=async()=>{const e=String(reportMonthEl.value).padStart(2,"0"),t=reportYearEl.value;if(!SHEETDB_API_URL.includes("sheetdb.io"))return;try{const s=await fetch(`${SHEETDB_API_URL}/search?date=${t}-${e}*`);if(!s.ok)throw new Error("Failed to fetch report data");const a=await s.json(),o={};schedule.forEach((e=>{o[e.task]={done:0,total:0}})),a.forEach((e=>{o[e.task]&&"pending"!==e.status&&(o[e.task].total++, "done"===e.status&&o[e.task].done++)}));const r=Object.values(o).reduce(((e,t)=>e+t.total),0),n=Object.values(o).reduce(((e,t)=>e+t.done),0);0===r?(noReportDataEl.style.display="block",chartContainerEl.style.display="none",reportDetailsEl.style.display="none",reportChart&&reportChart.destroy()):(noReportDataEl.style.display="none",chartContainerEl.style.display="block",reportDetailsEl.style.display="block",displayReportChart(n,r),displayReportDetails(o))}catch(e){console.error("Error generating report:",e)}})();
    (displayReportDetails=e=>{let t="<ul>";schedule.forEach((s=>{const a=e[s.task],o=getTaskDurationInMinutes(s)*a.done/60;t+=`<li><h4>${s.task}</h4><p><strong>Completed:</strong> ${a.done} of ${a.total} days</p><p><strong>Total Hours:</strong> ${o.toFixed(1)} hrs</p></li>`})),t+="</ul>",reportDetailsEl.innerHTML=t})();
    (displayReportChart=(e,t)=>{reportChart&&reportChart.destroy();const s=t-e,a=t>0?e/t*100:0,o=getComputedStyle(document.body),r=o.getPropertyValue("--text-primary").trim(),n=o.getPropertyValue("--pie-border-color").trim();reportChart=new Chart(reportChartCanvas,{type:"pie",data:{labels:["Completed","Missed"],datasets:[{data:[e,s],backgroundColor:["#4CAF50","#F44336"],borderColor:n,borderWidth:3,hoverOffset:10}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"top",labels:{color:r,font:{family:"'Poppins', sans-serif",size:14}}},title:{display:!0,text:`Monthly Completion: ${a.toFixed(1)}%`,color:r,font:{family:"'Poppins', sans-serif",size:18}},tooltip:{titleFont:{family:"'Poppins', sans-serif"},bodyFont:{family:"'Poppins', sans-serif"},callbacks:{label:e=>` ${e.label}: ${e.raw} tasks`}}}}})})();
    
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