const nameInput = document.getElementById("name");
const dateInput = document.getElementById("date");
const form = document.getElementById("verifyForm");

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
    alert("Please fill in all fields.");
    return;
  }

  // Name Validation (letters and spaces only)
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(name)) {
    alert("Name can only contain letters and spaces.");
    return;
  }

  const age = calculateAge(dob);
  console.log("Age:", age);

  if (age <= 10) {
    alert("You must be older than 10 to continue.");
    return;
  }

  // If valid, store data
  localStorage.setItem("userName", name);
  localStorage.setItem("userDob", dob);
  console.log(localStorage.getItem("userName")); // Should show the name

  window.location.href = "app.html";
  // Redirect
};
