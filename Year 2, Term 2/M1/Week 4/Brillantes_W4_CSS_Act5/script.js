const board = document.getElementById('board');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
let currentPlayer = 'X';
let scores = { X: 0, O: 0 };
let gameState = Array(9).fill(null);

// Winning combinations
const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Handle box click
function handleBoxClick(e) {
  const index = e.target.getAttribute('data-index');
  if (gameState[index] !== null) return;

  // Mark the box
  gameState[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  e.target.classList.add('taken');

  // Check for a winner
  if (checkWinner(currentPlayer)) {
    alert(`Player ${currentPlayer} wins!`);
    scores[currentPlayer]++;
    updateScoreboard();
    resetGame();
  } else if (gameState.every(cell => cell !== null)) {
    alert('It\'s a draw!');
    resetGame();
  } else {
    // Switch players
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  }
}

// Check for a winner
function checkWinner(player) {
  return winningCombinations.some(combination =>
    combination.every(index => gameState[index] === player)
  );
}

// Update scoreboard
function updateScoreboard() {
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
}

// Reset game
function resetGame() {
  gameState.fill(null);
  Array.from(board.children).forEach(box => {
    box.textContent = '';
    box.classList.remove('taken');
  });
  currentPlayer = 'X';
}

// Add event listeners to all boxes
Array.from(board.children).forEach(box => {
  box.addEventListener('click', handleBoxClick);
});
