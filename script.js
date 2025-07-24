let tasks = [];
let currentFilter = 'all';
const taskInput = document.getElementById('task');
const dateInput = document.getElementById('date');
const timeInput = document.getElementById('time');
const addTaskBtn = document.getElementById('addTask');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed');
const taskCount = document.getElementById('task-count');
const notification = document.getElementById('notification');
const themeToggle = document.querySelector('.theme-toggle');

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

// Theme toggle
themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  showNotification(`Theme switched to ${newTheme} mode`);
});

// Load tasks from localStorage
function loadTasks() {
  const savedTasks = localStorage.getItem('shadow-tasks');
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    renderTasks();
  }
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('shadow-tasks', JSON.stringify(tasks));
}

// Show notification
function showNotification(message) {
  notification.textContent = message;
  notification.classList.add('show');
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Add new task
function addTask() {
  const text = taskInput.value.trim();
  const date = dateInput.value;
  const time = timeInput.value;
  
  if (!text) {
    showNotification('Enter a quest, Hunter!');
    taskInput.focus();
    return;
  }

  let datetime = '';
  if (date && time) {
    datetime = `${date}T${time}`;
  } else if (date) {
    datetime = `${date}T00:00`;
  }

  tasks.push({
    id: Date.now(),
    text,
    datetime,
    completed: false,
    createdAt: new Date().toISOString()
  });

  taskInput.value = '';
  dateInput.value = '';
  timeInput.value = '';
  
  saveTasks();
  renderTasks();
  showNotification('Quest added to your realm!');
}

// Render tasks based on current filter
function renderTasks() {
  taskList.innerHTML = '';
  
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  if (filteredTasks.length === 0) {
    const emptyState = document.createElement('li');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
      <i class="fas fa-ghost"></i>
      <p>No quests found in this realm</p>
    `;
    taskList.appendChild(emptyState);
    return;
  }

  filteredTasks.forEach(task => {
    const taskItem = document.createElement('li');
    taskItem.className = `task-item${task.completed ? ' completed' : ''}`;
    taskItem.dataset.id = task.id;

    const dateObj = task.datetime ? new Date(task.datetime) : null;
    const formattedDate = dateObj ? dateObj.toLocaleDateString() : 'No deadline';
    const formattedTime = dateObj ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

    taskItem.innerHTML = `
      <div class="task-content">
        <div class="task-text">${task.text}</div>
        <div class="task-meta">
          <span class="task-date">
            <i class="far fa-calendar-alt"></i>
            ${formattedDate}
            ${formattedTime ? `<i class="far fa-clock"></i> ${formattedTime}` : ''}
          </span>
        </div>
      </div>
      <div class="task-actions">
        <button class="task-btn complete-btn" title="${task.completed ? 'Uncomplete' : 'Complete'}">
          <i class="fas fa-${task.completed ? 'undo' : 'check'}"></i>
        </button>
        <button class="task-btn edit-btn" title="Edit">
          <i class="far fa-edit"></i>
        </button>
        <button class="task-btn delete-btn" title="Delete">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `;

    taskList.appendChild(taskItem);
  });

  updateTaskCount();
}

// Update task counter
function updateTaskCount() {
  const activeTasks = tasks.filter(task => !task.completed).length;
  taskCount.textContent = `${activeTasks} ${activeTasks === 1 ? 'quest' : 'quests'} remaining`;
}

// Toggle task completion
function toggleComplete(taskId) {
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    saveTasks();
    renderTasks();
    showNotification(`Quest ${tasks[taskIndex].completed ? 'completed' : 'reactivated'}!`);
  }
}

// Delete task
function deleteTask(taskId) {
  tasks = tasks.filter(task => task.id !== taskId);
  saveTasks();
  renderTasks();
  showNotification('Quest vanished into the shadows!');
}

// Edit task
function editTask(taskId) {
  const task = tasks.find(task => task.id === taskId);
  if (!task) return;

  const newText = prompt('Edit your quest:', task.text);
  if (newText === null) return;

  const newDate = prompt('Edit deadline (YYYY-MM-DD):', task.datetime ? task.datetime.split('T')[0] : '');
  const newTime = prompt('Edit time (HH:MM):', task.datetime ? task.datetime.split('T')[1] : '');

  task.text = newText.trim();
  task.datetime = newDate ? `${newDate}${newTime ? `T${newTime}` : ''}` : '';
  
  saveTasks();
  renderTasks();
  showNotification('Quest modified!');
}

// Clear completed tasks
function clearCompleted() {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
  showNotification('Purged completed quests!');
}

// Set filter
function setFilter(filter) {
  currentFilter = filter;
  filterButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  renderTasks();
}

// Event listeners
addTaskBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

filterButtons.forEach(button => {
  button.addEventListener('click', () => setFilter(button.dataset.filter));
});

clearCompletedBtn.addEventListener('click', clearCompleted);

taskList.addEventListener('click', (e) => {
  const taskItem = e.target.closest('.task-item');
  if (!taskItem) return;

  const taskId = parseInt(taskItem.dataset.id);
  
  if (e.target.closest('.complete-btn')) {
    toggleComplete(taskId);
  } else if (e.target.closest('.edit-btn')) {
    editTask(taskId);
  } else if (e.target.closest('.delete-btn')) {
    if (confirm('Banish this quest to the shadow realm?')) {
      deleteTask(taskId);
    }
  }
});

// Initialize
loadTasks();