
const taskInput = document.getElementById("taskInput");
const priority = document.getElementById("priority");
const dueDate = document.getElementById("dueDate");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const addBtn = document.getElementById("addBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let editId = null;

// Save Tasks

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add / Update Task

function addTask() {

    const title = taskInput.value.trim();

    if (title === "") {
        alert("Please enter a task!");
        return;
    }

    if (editId !== null) {

        tasks = tasks.map(task => {
            if (task.id === editId) {
                return {
                    ...task,
                    title: title,
                    priority: priority.value,
                    date: dueDate.value
                };
            }
            return task;
        });

        editId = null;
        addBtn.innerText = "+ Add Task";

    } else {

        const task = {
            id: Date.now(),
            title: title,
            priority: priority.value,
            date: dueDate.value,
            completed: false
        };

        tasks.push(task);
    }

    taskInput.value = "";
    dueDate.value = "";

    saveTasks();
    renderTasks();
}

addBtn.addEventListener("click", addTask);

// Enter Key

taskInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        addTask();
    }
});

// Render Tasks

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {

        const matchesSearch = task.title
            .toLowerCase()
            .includes(searchInput.value.toLowerCase());

        const matchesFilter =
            currentFilter === "all" ||
            (currentFilter === "active" && !task.completed) ||
            (currentFilter === "completed" && task.completed);

        return matchesSearch && matchesFilter;
    });

    document.getElementById("emptyState").style.display =
        filteredTasks.length === 0 ? "block" : "none";

    document.getElementById("taskCount").innerText =
        filteredTasks.length + " Tasks";

    filteredTasks.forEach(task => {

        const li = document.createElement("div");
        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-check";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            toggleTask(task.id);
        });

        const info = document.createElement("div");
        info.className = "task-info";

        const title = document.createElement("h3");
        title.textContent = task.title;

        const details = document.createElement("p");
        details.textContent =
            task.date ? "Due: " + task.date : "No due date";

        info.appendChild(title);
        info.appendChild(details);

        const badge = document.createElement("span");
        badge.className = "priority " + task.priority;
        badge.textContent = task.priority;

        const actions = document.createElement("div");
        actions.className = "actions";

        const editBtn = document.createElement("button");
        editBtn.textContent = "✏️";
        editBtn.title = "Edit Task";
        editBtn.addEventListener("click", () => editTask(task.id));

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑️";
        deleteBtn.className = "delete";
        deleteBtn.title = "Delete Task";
        deleteBtn.addEventListener("click", () => deleteTask(task.id));

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(checkbox);
        li.appendChild(info);
        li.appendChild(badge);
        li.appendChild(actions);

        taskList.appendChild(li);
    });

    updateStats();
}

// Complete Task

function toggleTask(id) {

    tasks = tasks.map(task => {
        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }
        return task;
    });

    saveTasks();
    renderTasks();
}

// Delete Task

function deleteTask(id) {

    if (!confirm("Are you sure you want to delete this task?")) {
        return;
    }

    tasks = tasks.filter(task => task.id !== id);

    if (editId === id) {
        resetForm();
    }

    saveTasks();
    renderTasks();
}

// Edit Task

function editTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    taskInput.value = task.title;
    priority.value = task.priority;
    dueDate.value = task.date;

    editId = id;

    addBtn.innerText = "Update Task";

    taskInput.focus();
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Reset Form

function resetForm() {
    editId = null;
    taskInput.value = "";
    dueDate.value = "";
    addBtn.innerText = "+ Add Task";
}

// Search

searchInput.addEventListener("input", renderTasks);

// Filter

document.querySelectorAll(".filter-btn").forEach(btn => {

    btn.addEventListener("click", () => {

        document.querySelector(".filter-btn.active")
            .classList.remove("active");

        btn.classList.add("active");

        currentFilter = btn.dataset.filter;

        renderTasks();
    });
});

// Statistics

function updateStats() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = total - completed;

    document.getElementById("totalTasks").innerText = total;

    document.getElementById("completedTasks").innerText =
        completed;

    document.getElementById("pendingTasks").innerText =
        pending;
}

// Dark Mode

const themeBtn = document.getElementById("themeBtn");

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "☀️";
}

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");

    themeBtn.textContent = isDark ? "☀️" : "🌙";

    localStorage.setItem(
        "theme",
        isDark ? "dark" : "light"
    );
});

// Initial Load

renderTasks();



