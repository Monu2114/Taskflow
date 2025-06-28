const usernameDisplay = document.getElementById("usernameDisplay");
const signoutBtn = document.getElementById("signout");
const userAvatar = document.getElementById("userAvatar");

const todos = [];

// Protect app.html
if (!localStorage.getItem("userName") || !localStorage.getItem("userDob")) {
  window.location.href = "index.html";
}

// Show username
usernameDisplay.textContent = localStorage.getItem("userName");

userAvatar.src = `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${usernameDisplay.textContent}`;

// Signout functionality
signoutBtn.onclick = () => {
  localStorage.clear();
  window.location.href = "index.html";
};
getData();
async function getData() {
  const initial_todos = "https://dummyjson.com/todos";
  try {
    const response = await fetch(initial_todos);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
    todos.push(json);
  } catch (error) {
    console.error(error.message);
  }
}
