const usernameDisplay = document.getElementById("usernameDisplay");
const signoutBtn = document.getElementById("signout");
const userAvatar = document.getElementById("userAvatar");
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const content = document.getElementById("content");
const todo = document.getElementById("todo");
const completed = document.getElementById("completed");
const archived = document.getElementById("archived");
const tabs = [todo, completed, archived];

// Protect app.html
if (!localStorage.getItem("userName") || !localStorage.getItem("userDob")) {
  window.location.href = "index.html";
}

// Show username and avatar
usernameDisplay.textContent = localStorage.getItem("userName");
userAvatar.src = `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${usernameDisplay.textContent}`;

// Signout functionality
signoutBtn.onclick = () => {
  localStorage.clear();
  window.location.href = "index.html";
};

// If no tasks, fetch from API
if (tasks.length === 0) {
  getData();
}

async function getData() {
  const apiUrl = "https://dummyjson.com/todos";
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    const fetchedTodos = json.todos;

    fetchedTodos.forEach((task) => {
      tasks.push({
        title: task.todo,
        time: Date.now(),
        status: "todo",
      });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
    console.log("Fetched & saved todos:", tasks);
  } catch (error) {
    console.error(error.message);
  }
}

function highlightActiveTab(activeTab) {
  tabs.forEach((tab) => tab.classList.remove("active-tab"));
  activeTab.classList.add("active-tab");
}

function renderTasks(stage) {
  content.innerHTML = "";
  const filtered = tasks
    .filter((task) => task.status === stage)
    .sort((a, b) => b.time - a.time);

  filtered.forEach((task) => {
    const card = document.createElement("div");
    card.className =
      "p-4 mb-4 rounded-lg bg-gray-800 text-white flex justify-between items-start shadow";

    let buttons = "";
    if (stage === "todo") {
      buttons = `
        <button class="mark-completed bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm">Mark as completed</button>
        <button class="archive bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded text-sm">Archive</button>
      `;
    } else if (stage === "completed") {
      buttons = `
        <button class="todo bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">Move to Todo</button>
        <button class="archive bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded text-sm">Archive</button>
      `;
    } else if (stage === "archived") {
      buttons = `
        <button class="todo bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">Move to Todo</button>
        <button class="mark-completed bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm">Move to Completed</button>
      `;
    }

    card.innerHTML = `
      <div>
        <p class="font-semibold mb-2">${task.title}</p>
        <div class="flex gap-2">${buttons}</div>
      </div>
      <p class="text-sm text-gray-400">Last modified at:<br>${new Date(
        task.time
      ).toLocaleString()}</p>
    `;

    card.querySelectorAll("button").forEach((btn) => {
      btn.onclick = () => {
        if (btn.classList.contains("mark-completed")) {
          task.status = "completed";
          task.time = Date.now();
          localStorage.setItem("tasks", JSON.stringify(tasks));
          highlightActiveTab(completed);
          renderTasks("completed");
          return;
        }
        if (btn.classList.contains("archive")) {
          task.status = "archived";
          task.time = Date.now();
          localStorage.setItem("tasks", JSON.stringify(tasks));
          highlightActiveTab(archived);
          renderTasks("archived");
          return;
        }
        if (btn.classList.contains("todo")) {
          task.status = "todo";
          task.time = Date.now();
          localStorage.setItem("tasks", JSON.stringify(tasks));
          highlightActiveTab(todo);
          renderTasks("todo");
          return;
        }

        task.time = Date.now();
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks(stage);
      };
    });

    content.appendChild(card);
  });
}

// Initial render
highlightActiveTab(todo);
renderTasks("todo");

// Tab click events
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
