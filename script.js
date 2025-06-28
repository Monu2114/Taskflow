if (localStorage.getItem("userName") && localStorage.getItem("userDob")) {
  window.location.href = "app.html";
}
const nameInput = document.getElementById("name");
const dateInput = document.getElementById("date");
const form = document.getElementById("verifyForm");

// calculating age and validating
const calculateAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--; // Haven't had birthday this year yet
  }

  return age;
};

form.onsubmit = (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const dob = dateInput.value;

  // Basic Validation
  if (name === "" || dob === "") {
    showToast("Please fill in all fields.");
    return;
  }
  const nameRegex = /^[A-Za-z\s]+$/;

  if (!nameRegex.test(name)) {
    showToast("Name can only contain letters and spaces.");
    return;
  }
  const age = calculateAge(dob);
  const birthDate = new Date(dob);
  const today = new Date();

  if (birthDate > today) {
    showToast("Date of Birth cannot be in the future.");
    return;
  }

  if (age <= 10) {
    showToast("You must be older than 10 to continue.");
    return;
  }

  // If valid, store data
  localStorage.setItem("userName", name);
  localStorage.setItem("userDob", dob);
  console.log(localStorage.getItem("userName")); // Should show the name

  window.location.href = "app.html";
  // Redirect
};
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.add("hidden");
    toast.classList.remove("show");
  }, 2000);
}
