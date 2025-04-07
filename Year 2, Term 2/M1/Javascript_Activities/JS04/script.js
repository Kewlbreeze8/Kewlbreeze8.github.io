document.getElementById('calculateButton').addEventListener('click', function() {
    const startDateValue = document.getElementById('startDate').value;
    const endDateValue = document.getElementById('endDate').value;
    const result = document.getElementById('result');
  
    // Clear previous result
    result.textContent = '';
  
    if (!startDateValue || !endDateValue) {
      // Display message for empty fields
      result.textContent = 'Please select valid dates.';
      result.style.color = 'red';
      return;
    }
  
    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);
  
    if (isNaN(startDate) || isNaN(endDate) || startDate > endDate) {
      // Display message for invalid dates
      result.textContent = 'Please select valid dates.';
      result.style.color = 'red';
    } else {
      // Calculate difference in days
      const differenceInTime = endDate.getTime() - startDate.getTime();
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  
      // Display the result
      result.textContent = `The difference is ${differenceInDays} days.`;
      result.style.color = 'green';
    }
  });
  