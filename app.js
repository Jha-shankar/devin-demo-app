const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const filterButtons = document.querySelectorAll('.filter-btn');
const clearDoneButton = document.getElementById('clear-done-btn');

const STORAGE_KEY = 'task-tracker-tasks';

let tasks = loadTasks();
let currentFilter = 'all';

function loadTasks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to load tasks from localStorage:', e);
  }
  return [];
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.warn('Failed to save tasks to localStorage:', e);
  }
}

function createTask(title) {
  return {
    id: Date.now() + Math.random(),
    title,
    done: false,
    createdAt: new Date().toISOString(),
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

  saveTasks();
  renderTasks();
}

function toggleTask(taskId) {
  tasks = tasks.map((task) => {
    if (task.id === taskId) {
      return { ...task, done: !task.done };
    }
    return task;
  });

  saveTasks();
  renderTasks();
}

function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks();
  renderTasks();
}

function editTask(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  const listItem = document.querySelector(`[data-task-id="${taskId}"]`);
  if (!listItem) return;

  listItem.classList.add('editing');

  const titleSpan = listItem.querySelector('.task-title');
  const actionsDiv = listItem.querySelector('.task-actions');

  titleSpan.style.display = 'none';
  actionsDiv.style.display = 'none';

  const editContainer = document.createElement('div');
  editContainer.className = 'edit-container';

  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.className = 'edit-input';
  editInput.value = task.title;

  const saveButton = document.createElement('button');
  saveButton.className = 'save-btn';
  saveButton.textContent = 'Save';
  saveButton.type = 'button';

  const cancelButton = document.createElement('button');
  cancelButton.className = 'cancel-btn';
  cancelButton.textContent = 'Cancel';
  cancelButton.type = 'button';

  function saveEdit() {
    const newTitle = editInput.value.trim();
    if (newTitle && newTitle !== task.title) {
      tasks = tasks.map((t) => {
        if (t.id === taskId) {
          return { ...t, title: newTitle };
        }
        return t;
      });
      saveTasks();
    }
    renderTasks();
  }

  function cancelEdit() {
    renderTasks();
  }

  saveButton.addEventListener('click', saveEdit);
  cancelButton.addEventListener('click', cancelEdit);

  editInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  });

  editContainer.append(editInput, saveButton, cancelButton);
  listItem.insertBefore(editContainer, actionsDiv);

  editInput.focus();
  editInput.select();
}

function clearDoneTasks() {
  tasks = tasks.filter((task) => !task.done);
  saveTasks();
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
  const done = total - remaining;

  taskCount.textContent = `${remaining} active \u00b7 ${done} done \u00b7 ${total} total`;

  if (clearDoneButton) {
    clearDoneButton.style.display = done > 0 ? 'inline-block' : 'none';
  }
}

function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function renderTasks() {
  const filteredTasks = getFilteredTasks();

  taskList.innerHTML = '';

  if (filteredTasks.length === 0) {
    const emptyMessage = document.createElement('li');
    emptyMessage.className = 'empty-state';

    const icon = document.createElement('span');
    icon.className = 'empty-icon';
    icon.textContent = currentFilter === 'done' ? '\u2714' : '\u270F';

    const text = document.createElement('span');
    if (currentFilter === 'all') {
      text.textContent = 'No tasks yet. Add one above to get started!';
    } else if (currentFilter === 'active') {
      text.textContent = 'All tasks are done. Great job!';
    } else {
      text.textContent = 'No completed tasks yet.';
    }

    emptyMessage.append(icon, text);
    taskList.appendChild(emptyMessage);
    updateTaskCount();
    return;
  }

  filteredTasks.forEach((task) => {
    const item = document.createElement('li');
    item.className = `task-item ${task.done ? 'done' : ''}`;
    item.setAttribute('data-task-id', task.id);

    const checkbox = document.createElement('button');
    checkbox.className = `task-checkbox ${task.done ? 'checked' : ''}`;
    checkbox.type = 'button';
    checkbox.setAttribute('aria-label', task.done ? 'Mark as active' : 'Mark as done');
    checkbox.addEventListener('click', () => toggleTask(task.id));

    const contentDiv = document.createElement('div');
    contentDiv.className = 'task-content';

    const title = document.createElement('span');
    title.className = 'task-title';
    title.textContent = task.title;

    const meta = document.createElement('span');
    meta.className = 'task-meta';
    meta.textContent = formatDate(task.createdAt);

    contentDiv.append(title, meta);

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const editButton = document.createElement('button');
    editButton.className = 'edit-btn';
    editButton.type = 'button';
    editButton.setAttribute('aria-label', 'Edit task');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => editTask(task.id));

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.type = 'button';
    deleteButton.setAttribute('aria-label', 'Delete task');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteTask(task.id));

    actions.append(editButton, deleteButton);
    item.append(checkbox, contentDiv, actions);
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

if (clearDoneButton) {
  clearDoneButton.addEventListener('click', clearDoneTasks);
}

taskForm.addEventListener('submit', addTask);
renderTasks();
