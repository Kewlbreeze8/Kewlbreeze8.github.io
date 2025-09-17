// JavaScript functionality
document.getElementById('passwordForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from refreshing the page
  
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const message = document.getElementById('message');
  
    // Clear previous message
    message.textContent = '';
  
    if (!newPassword || !confirmPassword) {
      // Display message for empty fields
      message.textContent = '! Please fill out this field.';
      message.style.color = 'red';
    } else if (newPassword === confirmPassword) {
      // Display success message if passwords match
      message.textContent = 'Password successfully changed!';
      message.style.color = 'green';
    } else {
      // Display error message if passwords do not match
      message.textContent = 'Passwords do not match. Please try again.';
      message.style.color = 'red';
    }
  });