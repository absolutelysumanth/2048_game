const gridContainer = document.getElementById('grid');
const scoreDisplay = document.querySelector('#score span');
let score = 0;
let grid = Array(16).fill(0);

// Generate a random tile in an empty cell
function generateTile() {
  let emptyCells = grid.map((val, idx) => (val === 0 ? idx : null)).filter(idx => idx !== null);
  if (emptyCells.length > 0) {
    let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    grid[randomCell] = Math.random() < 0.9 ? 2 : 4;
  }
}

// Update the grid display
function updateGrid() {
  gridContainer.innerHTML = '';
  grid.forEach(value => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.value = value;
    cell.textContent = value > 0 ? value : '';
    gridContainer.appendChild(cell);
  });
  scoreDisplay.textContent = score;
}

// Move functions
function slide(row) {
  let arr = row.filter(val => val);
  let missing = 4 - arr.length;
  return arr.concat(Array(missing).fill(0));
}

function combine(row) {
  for (let i = 0; i < 3; i++) {
    if (row[i] === row[i + 1] && row[i] !== 0) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    }
  }
  return row;
}

function moveLeft() {
  let moved = false;
  for (let i = 0; i < 4; i++) {
    let row = grid.slice(i * 4, i * 4 + 4);
    let newRow = slide(combine(slide(row)));
    for (let j = 0; j < 4; j++) {
      if (grid[i * 4 + j] !== newRow[j]) moved = true;
      grid[i * 4 + j] = newRow[j];
    }
  }
  return moved;
}

function moveRight() {
  let moved = false;
  for (let i = 0; i < 4; i++) {
    let row = grid.slice(i * 4, i * 4 + 4).reverse();
    let newRow = slide(combine(slide(row))).reverse();
    for (let j = 0; j < 4; j++) {
      if (grid[i * 4 + j] !== newRow[j]) moved = true;
      grid[i * 4 + j] = newRow[j];
    }
  }
  return moved;
}

function moveUp() {
  let moved = false;
  for (let i = 0; i < 4; i++) {
    let row = [grid[i], grid[i + 4], grid[i + 8], grid[i + 12]];
    let newRow = slide(combine(slide(row)));
    for (let j = 0; j < 4; j++) {
      if (grid[i + j * 4] !== newRow[j]) moved = true;
      grid[i + j * 4] = newRow[j];
    }
  }
  return moved;
}

function moveDown() {
  let moved = false;
  for (let i = 0; i < 4; i++) {
    let row = [grid[i], grid[i + 4], grid[i + 8], grid[i + 12]].reverse();
    let newRow = slide(combine(slide(row))).reverse();
    for (let j = 0; j < 4; j++) {
      if (grid[i + j * 4] !== newRow[j]) moved = true;
      grid[i + j * 4] = newRow[j];
    }
  }
  return moved;
}

// Handle keyboard input for moving tiles
function handleInput(e) {
  let moved = false;
  switch (e.key) {
    case 'ArrowLeft':
      moved = moveLeft();
      break;
    case 'ArrowRight':
      moved = moveRight();
      break;
    case 'ArrowUp':
      moved = moveUp();
      break;
    case 'ArrowDown':
      moved = moveDown();
      break;
  }
  if (moved) {
    generateTile();
    updateGrid();
    checkGameOver();
  }
}

function checkGameOver() {
  if (!grid.includes(0)) {
    let moves = [moveLeft, moveRight, moveUp, moveDown];
    let copy = [...grid];
    if (moves.every(fn => !fn())) {
      alert("Game Over!");
    }
    grid = copy;  // Restore grid state after check
    updateGrid();
  }
}

// Initialize the game
document.addEventListener('keydown', handleInput);
generateTile();
generateTile();
updateGrid();
