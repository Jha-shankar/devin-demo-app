const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const filterButtons = document.querySelectorAll('.filter-btn');

let tasks = [];
let currentFilter = 'all';

function createTask(title) {
  return {
    id: Date.now() + Math.random(),
    title,
    done: false,
  };
}

function addTask(event) {
  event.preventDefault();

  const title = taskInput.value.trim();

  if (!title) {
    return;
  }

  const newTask = createTask(title);
  tasks.push(newTask);
  taskInput.value = '';

  renderTasks();
}

function toggleTask(taskId) {
  tasks = tasks.map((task) => {
    if (task.id === taskId) {
      return { ...task, done: !task.done };
    }
    return task;
  });

  renderTasks();
}

function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  renderTasks();
}

function getFilteredTasks() {
  if (currentFilter === 'active') {
    return tasks.filter((task) => !task.done);
  }

  if (currentFilter === 'done') {
    return tasks.filter((task) => task.done);
  }

  return tasks;
}

function updateTaskCount() {
  const total = tasks.length;
  const remaining = tasks.filter((task) => !task.done).length;
  taskCount.textContent = `${remaining} left / ${total} total`;
}

function renderTasks() {
  const filteredTasks = getFilteredTasks();

  taskList.innerHTML = '';

  if (filteredTasks.length === 0) {
    const emptyMessage = document.createElement('li');
    emptyMessage.textContent = 'No tasks to show.';
    taskList.appendChild(emptyMessage);
    updateTaskCount();
    return;
  }

  filteredTasks.forEach((task) => {
    const item = document.createElement('li');
    item.className = `task-item ${task.done ? 'done' : ''}`;

    const title = document.createElement('span');
    title.className = 'task-title';
    title.textContent = task.title;

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const toggleButton = document.createElement('button');
    toggleButton.className = 'toggle-btn';
    toggleButton.textContent = task.done ? 'Undo' : 'Done';
    toggleButton.addEventListener('click', () => toggleTask(task.id));

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteTask(task.id));

    actions.append(toggleButton, deleteButton);
    item.append(title, actions);
    taskList.appendChild(item);
  });

  updateTaskCount();
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    renderTasks();
  });
});

taskForm.addEventListener('submit', addTask);
renderTasks();
