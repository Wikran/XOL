// loadMasterHead.js

fetch('MasterHead.html')
  .then(response => response.text())
  .then(data => {
    // Create a temporary div to hold the loaded HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = data;

    // Move all elements from the temporary div to the head
    while (tempDiv.firstChild) {
      document.head.appendChild(tempDiv.firstChild);
    }
  })
  .catch(error => console.error('Error loading MasterHead.html:', error));
