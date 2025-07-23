let tasks = [];

function addTask() {
  const taskInput = document.getElementById("task");
  const dateInput = document.getElementById("datetime");

  const taskText = taskInput.value.trim();
  const dateTime = dateInput.value;

  if (taskText === "") return alert("Enter a task, Hunter!");

  tasks.push({
    text: taskText,
    datetime: dateTime,
    completed: false,
  });

  taskInput.value = "";
  dateInput.value = "";

  renderTasks();
}

function renderTasks() {
  const list = document.getElementById("task-list");
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `task${task.completed ? " completed" : ""}`;

    const taskSpan = document.createElement("span");
    taskSpan.innerHTML = `<strong>${task.text}</strong><br><small>${task.datetime ? new Date(task.datetime).toLocaleString() : 'No Date'}</small>`;

    const btns = document.createElement("div");
    btns.className = "task-buttons";
    btns.innerHTML = `
      <button title="Done" onclick="toggleComplete(${index})">✅</button>
      <button title="Edit" onclick="editTask(${index})">✏️</button>
      <button title="Delete" onclick="deleteTask(${index})">🗑️</button>
    `;

    li.appendChild(taskSpan);
    li.appendChild(btns);
    list.appendChild(li);
  });
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function editTask(index) {
  const current = tasks[index];
  const newText = prompt("Edit task:", current.text);
  const newDate = prompt("Edit date/time (YYYY-MM-DDTHH:MM):", current.datetime);
  if (newText !== null) tasks[index].text = newText.trim() || current.text;
  if (newDate !== null) tasks[index].datetime = newDate;
  renderTasks();
}
