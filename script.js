let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let searchQuery = '';
let currentFilter = 'all';

// Task add karna
function addTask() {
  const input = document.getElementById('taskInput');
  const priority = document.getElementById('priority').value;
  const deadline = document.getElementById('deadline').value;

  if (input.value.trim() === '') {
    alert('Task likho pehle!');
    return;
  }
  const category = document.getElementById('category').value;
  const task = {
    id: Date.now(),
    text: input.value,
    priority: priority,
    deadline: deadline,
    category: category,
    completed: false,
  };
  

  tasks.push(task);
  saveTasks();
  renderTasks();

  input.value = '';
  document.getElementById('deadline').value = '';
}

// Tasks ko screen pe dikhana
function renderTasks() {
  const list = document.getElementById('taskList');
  list.innerHTML = '';

  let filtered = tasks;
  if (currentFilter === 'pending') filtered = tasks.filter(t => !t.completed);
  if (currentFilter === 'completed') filtered = tasks.filter(t => t.completed);
    // Search filter
  if (searchQuery) {
    filtered = filtered.filter(t => t.text.toLowerCase().includes(searchQuery.toLowerCase()));
  }
  if (filtered.length === 0) {
    list.innerHTML = '<p style="text-align:center;color:#999;">Koi task nahi hai</p>';
    return;
  }

  filtered.forEach(task => {
        const isOverdue = task.deadline && new Date(task.deadline) < new Date() && !task.completed;
    const li = document.createElement('li');
       li.className = task.priority + (task.completed ? ' completed' : '') + (isOverdue ? ' overdue' : '');

    li.innerHTML = `
      <div class="task-info">
        <span>${task.text}</span>
                <small>Priority: ${task.priority} ${task.deadline ? '| Deadline: ' + task.deadline : ''}</small>
        <span class="category-tag category-${task.category || 'general'}">${task.category || 'general'}</span>
      </div>
      <div class="task-actions">
        <button class="complete-btn" onclick="toggleComplete(${task.id})">
          ${task.completed ? '↩️' : '✔️'}
        </button>
        <button class="edit-btn" onclick="editTask(${task.id})">✏️</button>
        <button class="delete-btn" onclick="deleteTask(${task.id})">🗑️</button>
      </div>
    `;
    list.appendChild(li);
  });
    // Task counter update
  document.getElementById('totalCount').textContent = tasks.length;
  document.getElementById('completedCount').textContent = tasks.filter(t => t.completed).length;
  document.getElementById('pendingCount').textContent = tasks.filter(t => !t.completed).length;
}

// Task complete/pending toggle
function toggleComplete(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveTasks();
  renderTasks();
}

// Task delete
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

// Task edit
function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newText = prompt('Task edit karo:', task.text);
  
  if (newText !== null && newText.trim() !== '') {
    task.text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

// Filter
function filterTasks(type) {
  currentFilter = type;
  renderTasks();
}

// LocalStorage mein save
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Page load pe tasks dikhao
// Dark mode toggle
function toggleTheme() {
  document.body.classList.toggle('dark');
  const btn = document.getElementById('themeToggle');
  if (document.body.classList.contains('dark')) {
    btn.textContent = '☀️ Light Mode';
    localStorage.setItem('theme', 'dark');
  } else {
    btn.textContent = '🌙 Dark Mode';
    localStorage.setItem('theme', 'light');
  }
}

// Page load pe theme yaad rakho
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  document.getElementById('themeToggle').textContent = '☀️ Light Mode';
}
// Search function
function searchTasks() {
  searchQuery = document.getElementById('searchInput').value;
  renderTasks();
}
renderTasks();
// Export tasks
function exportTasks() {
  const dataStr = JSON.stringify(tasks, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tasks-backup.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Import tasks
function importTasks(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        tasks = imported;
        saveTasks();
        renderTasks();
        alert('✅ Tasks imported successfully!');
      } else {
        alert('❌ Invalid file format');
      }
    } catch (err) {
      alert('❌ File read nahi ho payi');
    }
  };
  reader.readAsText(file);
}