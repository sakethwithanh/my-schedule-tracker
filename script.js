// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- SELECTORS ---
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const getChantBtn = document.getElementById('get-chant-btn');
    const chantDisplay = document.getElementById('chant-display');

    // --- STATE ---
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // --- FUNCTIONS ---

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const renderTasks = () => {
        taskList.innerHTML = '';
        if (tasks.length === 0) {
            taskList.innerHTML = '<p style="text-align: center; color: #7f8c8d;">No tasks yet. Add one above!</p>';
            return;
        }
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = 'task-item';
            if (task.completed) {
                li.classList.add('completed');
            }
            const taskText = document.createElement('span');
            taskText.className = 'task-text';
            taskText.textContent = task.text;
            taskText.addEventListener('click', () => toggleComplete(index));
            const taskActions = document.createElement('div');
            taskActions.className = 'task-actions';
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '🗑️';
            deleteBtn.addEventListener('click', () => deleteTask(index));
            taskActions.appendChild(deleteBtn);
            li.appendChild(taskText);
            li.appendChild(taskActions);
            taskList.appendChild(li);
        });
    };

    const addTask = (text) => {
        tasks.push({ text: text, completed: false });
        saveTasks();
        renderTasks();
    };

    const toggleComplete = (index) => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    };

    const deleteTask = (index) => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    };

    // --- NEW: Gemini Chant Function ---
    const fetchChant = async () => {
        // Show a loading message
        chantDisplay.textContent = 'Generating your daily mantra...';
        getChantBtn.disabled = true;

        // Get only the text of the tasks
        const taskTexts = tasks.map(task => task.text);

        try {
            // Call our own backend server
            const response = await fetch('http://localhost:3000/api/get-chant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tasks: taskTexts }),
            });

            if (!response.ok) {
                throw new Error('Failed to get a response from the server.');
            }

            const data = await response.json();
            chantDisplay.textContent = data.chant;

        } catch (error) {
            console.error('Error fetching chant:', error);
            chantDisplay.textContent = 'Could not generate chant. Please try again.';
        } finally {
            // Re-enable the button
            getChantBtn.disabled = false;
        }
    };


    // --- EVENT LISTENERS ---
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            addTask(taskText);
            taskInput.value = '';
            taskInput.focus();
        }
    });

    // Add event listener for the new button
    getChantBtn.addEventListener('click', fetchChant);

    // --- INITIAL RENDER ---
    renderTasks();
});