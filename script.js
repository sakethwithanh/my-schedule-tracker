// =================================================================
// IMPORTANT: Paste the Web App URL you copied from Google Apps Script here!
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyhnDdwOzVrZQVRIIEoj6x64RLS9Rt92NbyVuKeeGXLOXEd_CXulopDAR_CsufAUTzO/exec';
// =================================================================

// Get DOM elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const loader = document.getElementById('loader');

// --- API Functions ---

/**
 * Shows or hides the loader animation.
 * @param {boolean} show - True to show, false to hide.
 */
function showLoader(show) {
    loader.style.display = show ? 'block' : 'none';
}

/**
 * Fetches all tasks from the Google Sheet.
 */
async function fetchTasks() {
    showLoader(true);
    taskList.innerHTML = ''; // Clear the list before fetching
    try {
        const response = await fetch(WEB_APP_URL);
        if (!response.ok) throw new Error('Network response was not ok.');
        
        const json = await response.json();
        if (json.success) {
            renderTasks(json.data);
        } else {
            alert('Failed to fetch tasks.');
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
        alert('An error occurred while fetching tasks.');
    } finally {
        showLoader(false);
    }
}

/**
 * Sends a POST request to the web app to perform an action (add, update, delete).
 * @param {object} body - The data to send in the request body.
 */
async function postData(body) {
    showLoader(true);
    try {
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const json = await response.json();
        if (json.success) {
            fetchTasks(); // Refresh the list on success
        } else {
            alert(`Error: ${json.message}`);
        }
    } catch (error) {
        console.error('Error posting data:', error);
        alert('An error occurred.');
    } finally {
        showLoader(false);
    }
}


// --- Event Handlers ---

/**
 * Handles the form submission to add a new task.
 * @param {Event} e - The form submit event.
 */
function handleAddTask(e) {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    postData({ action: 'addTask', task: taskText });
    taskInput.value = ''; // Clear input field
}

/**
 * Handles updating a task's status.
 * @param {number} row - The row number of the task in the sheet.
 * @param {string} currentStatus - The current status ("Active" or "Done").
 */
function handleUpdateTask(row, currentStatus) {
    const newStatus = currentStatus === 'Active' ? 'Done' : 'Active';
    postData({ action: 'updateTask', row, newStatus });
}

/**
 * Handles deleting a task.
 * @param {number} row - The row number of the task in the sheet.
 */
function handleDeleteTask(row) {
    if (confirm('Are you sure you want to delete this task?')) {
        postData({ action: 'deleteTask', row });
    }
}


// --- Rendering Function ---

/**
 * Renders the list of tasks to the DOM.
 * @param {Array<object>} tasks - An array of task objects.
 */
function renderTasks(tasks) {
    taskList.innerHTML = ''; // Clear existing tasks
    if (tasks.length === 0) {
        taskList.innerHTML = '<li>No tasks yet. Add one above!</li>';
        return;
    }

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = task.status === 'Done' ? 'completed' : '';

        // Task text
        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.task;
        
        // Action buttons container
        const actions = document.createElement('div');
        actions.className = 'actions';

        // Complete/Undo Button
        const completeButton = document.createElement('button');
        completeButton.textContent = task.status === 'Done' ? 'Undo' : 'Complete';
        completeButton.className = 'btn-complete';
        completeButton.addEventListener('click', () => handleUpdateTask(task.row, task.status));
        
        // Delete Button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'btn-delete';
        deleteButton.addEventListener('click', () => handleDeleteTask(task.row));
        
        actions.appendChild(completeButton);
        actions.appendChild(deleteButton);
        
        li.appendChild(taskText);
        li.appendChild(actions);

        taskList.appendChild(li);
    });
}


// --- Initial Load ---

// Add the event listener for the form
taskForm.addEventListener('submit', handleAddTask);

// Fetch tasks when the page loads
document.addEventListener('DOMContentLoaded', fetchTasks);