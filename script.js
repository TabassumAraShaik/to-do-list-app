// Get elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// Filter buttons
const allBtn = document.getElementById("allBtn");
const pendingBtn = document.getElementById("pendingBtn");
const completedBtn = document.getElementById("completedBtn");

// Load tasks on page load
window.addEventListener("load", loadTasks);

// Add Task
addTaskBtn.addEventListener("click", addTask);

function addTask() {
  const taskText = taskInput.value.trim();
  if (!taskText) { alert("Please enter a task!"); return; }

  const li = createTaskElement(taskText);
  taskList.appendChild(li);
  saveTask(taskText);

  taskInput.value = "";
}

// Create task element
function createTaskElement(taskText, completed=false) {
  const li = document.createElement("li");
  li.textContent = taskText;
  if (completed) li.classList.add("completed");

  li.addEventListener("click", () => {
    li.classList.toggle("completed");
    updateTaskStatus(taskText);
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("deleteBtn");

  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    li.remove();
    deleteTask(taskText);
  });

  li.appendChild(deleteBtn);
  return li;
}

// --- LocalStorage Functions ---
function saveTask(taskText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text: taskText, completed: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => {
    const li = createTaskElement(task.text, task.completed);
    taskList.appendChild(li);
  });
}

function updateTaskStatus(taskText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map(task =>
    task.text === taskText ? { ...task, completed: !task.completed } : task
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTask(taskText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(task => task.text !== taskText);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// --- Filter Logic ---
allBtn.addEventListener("click", () => filterTasks("all"));
pendingBtn.addEventListener("click", () => filterTasks("pending"));
completedBtn.addEventListener("click", () => filterTasks("completed"));

function filterTasks(type) {
  const tasks = document.querySelectorAll("#taskList li");
  tasks.forEach(task => {
    switch(type) {
      case "all": task.style.display = "flex"; break;
      case "pending": task.classList.contains("completed") ? task.style.display = "none" : task.style.display = "flex"; break;
      case "completed": task.classList.contains("completed") ? task.style.display = "flex" : task.style.display = "none"; break;
    }
  });
}
