document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault(); // Prevents the default form submission behavior

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username === "admin" && password === "password") {
    alert("Login successful!");
  } else {
    alert("Invalid username or password. Please try again.");
  }
});
