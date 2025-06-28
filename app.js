const usernameDisplay = document.getElementById("usernameDisplay");
const signoutBtn = document.getElementById("signout");
const userAvatar = document.getElementById("userAvatar");
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const content = document.getElementById("content");
const todo = document.getElementById("todo");
const completed = document.getElementById("completed");
const archived = document.getElementById("archived");
const submitTask = document.getElementById("submitTask");
const addTask = document.getElementById("addTask");
const searchInput = document.getElementById("searchInput");
const priorityFilter = document.getElementById("priorityFilter");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");
const tabs = [todo, completed, archived];
let currentTab = "todo";

// Protect app.html
if (!localStorage.getItem("userName") || !localStorage.getItem("userDob")) {
  window.location.href = "index.html";
}

usernameDisplay.textContent = localStorage.getItem("userName");
userAvatar.src = `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${usernameDisplay.textContent}`;

signoutBtn.onclick = () => {
  localStorage.clear();
  window.location.href = "index.html";
};

if (tasks.length === 0) {
  getData();
}

async function getData() {
  const apiUrl = "https://dummyjson.com/todos";
  try {
    const response = await fetch(apiUrl);
    const json = await response.json();
    json.todos.forEach((task) => {
      tasks.push({
        title: task.todo,
        time: Date.now(),
        status: "todo",
        priority: "medium",
      });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (error) {
    console.error(error);
  }
}

function highlightActiveTab(activeTab) {
  tabs.forEach((tab) => tab.classList.remove("active-tab"));
  activeTab.classList.add("active-tab");
}

function renderTasks(stage) {
  content.innerHTML = "";
  currentTab = stage;

  const search = searchInput.value.toLowerCase();
  const priority = priorityFilter.value;

  const filtered = tasks
    .filter((task) => task.status === stage)
    .filter((task) => task.title.toLowerCase().includes(search))
    .filter((task) => (priority ? task.priority === priority : true))
    .sort((a, b) => b.time - a.time);

  filtered.forEach((task) => {
    const card = document.createElement("div");
    card.className =
      "p-4 mb-4 rounded-lg bg-gray-800 text-white flex justify-between items-start shadow animate-fade-in";

    let buttons = "";
    if (stage === "todo") {
      buttons = `<button class="mark-completed bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm">Mark Completed</button>
                 <button class="archive bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded text-sm">Archive</button>`;
    } else if (stage === "completed") {
      buttons = `
                 <button class="archive bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded text-sm">Archive</button>`;
    } else if (stage === "archived") {
      buttons = `<button class="todo bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">Move to Todo</button>
                 <button class="mark-completed bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm">Move to Completed</button>`;
    }

    card.innerHTML = `
      <div>
        <p class="font-semibold mb-1">${task.title}</p>
        <p class="text-sm mb-2">Priority: ${task.priority}</p>
        <div class="flex gap-2">${buttons}</div>
      </div>
      <p class="text-sm text-gray-400">Last modified:<br>${new Date(
        task.time
      ).toLocaleString()}</p>
    `;

    card.querySelectorAll("button").forEach((btn) => {
      btn.onclick = () => {
        if (btn.classList.contains("mark-completed")) {
          task.status = "completed";
          showToast("Task moved to Completed");
        }
        if (btn.classList.contains("archive")) {
          task.status = "archived";
          showToast("Task moved to Archived");
        }
        if (btn.classList.contains("todo")) {
          task.status = "todo";
          showToast("Task moved to Todo");
        }

        task.time = Date.now();
        localStorage.setItem("tasks", JSON.stringify(tasks));

        const nextTab = btn.classList.contains("mark-completed")
          ? completed
          : btn.classList.contains("archive")
          ? archived
          : btn.classList.contains("todo")
          ? todo
          : tabs.find((t) => t.id === stage);

        highlightActiveTab(nextTab);
        renderTasks(nextTab.id);
      };
    });

    content.appendChild(card);
  });
}

// Tab Clicks
todo.onclick = () => {
  highlightActiveTab(todo);
  renderTasks("todo");
};
completed.onclick = () => {
  highlightActiveTab(completed);
  renderTasks("completed");
};
archived.onclick = () => {
  highlightActiveTab(archived);
  renderTasks("archived");
};

// Search & Filter
searchInput.oninput = () => renderTasks(currentTab);
priorityFilter.onchange = () => renderTasks(currentTab);

// Add Task
submitTask.onclick = () => {
  if (addTask.value.trim() === "") return alert("Enter valid task");

  const priority = prompt("Enter priority: high, medium, low").toLowerCase();
  if (!["high", "medium", "low"].includes(priority))
    return alert("Invalid priority");

  tasks.push({
    title: addTask.value.trim(),
    status: "todo",
    time: Date.now(),
    priority,
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
  addTask.value = "";
  showToast("Task added successfully");
  highlightActiveTab(todo);
  renderTasks("todo");
};

// Export
exportBtn.onclick = () => {
  const blob = new Blob([JSON.stringify(tasks)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "tasks.json";
  link.click();
  URL.revokeObjectURL(url);
  showToast("Tasks exported successfully");
};

// Import
importBtn.onclick = () => importFile.click();
importFile.onchange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const importedTasks = JSON.parse(reader.result);
      if (!Array.isArray(importedTasks)) throw new Error();
      tasks.length = 0;
      tasks.push(...importedTasks);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      showToast("Tasks imported successfully");
      renderTasks(currentTab);
    } catch {
      alert("Invalid file format");
    }
  };
  reader.readAsText(file);
};

// Keyboard Shortcuts
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "1") {
    highlightActiveTab(todo);
    renderTasks("todo");
  }
  if (e.ctrlKey && e.key === "2") {
    highlightActiveTab(completed);
    renderTasks("completed");
  }
  if (e.ctrlKey && e.key === "3") {
    highlightActiveTab(archived);
    renderTasks("archived");
  }
  if (e.key === "Enter" && document.activeElement === addTask)
    submitTask.click();
});

// Initial Render
highlightActiveTab(todo);
renderTasks("todo");

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hidden");
  }, 2000);
}
