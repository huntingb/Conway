// Storing references to grid container and buttons
const gridContainer = document.getElementById("grid-container");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");
const speedSlider = document.getElementById("speed-slider");

// Declare a variable that will be used later to store our setInterval function
let update;
// Initialize a variable to keep track of if the game is running or not
let running = false;
// Initialize a variable for the speed of the animation in ms per frame (500 by default)
let speed = speedSlider.value;

// Define a function to display a new table on the DOM
function displayTable(grid) {
    // Clear existing table if there is one
    if (gridContainer.firstChild) {
        gridContainer.removeChild(gridContainer.firstChild);
    }
    // Display new table
    let table = document.createElement("table");

    for (let i = 0; i < grid.length; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < grid[i].length; j++) {
            let cell = document.createElement("td");
            // cell.style.backgroundColor = (grid[i][j]) ? "#333" : "white"; 
            if (grid[i][j]) {
                cell.classList.add("live");
            } else {
                cell.classList.add("dead");
            }
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    gridContainer.appendChild(table);
}

// Define function to create a random grid as a nested array
function createRandomGrid() {
    let grid = [];
    for (let i = 0; i < 80; i++) {
        let row = [];
        for (let j = 0; j < 80; j++) {
        row.push(Math.random() > 0.5);
        }
        grid.push(row);
    }
    return grid;
}

// Define function that takes a grid and coords and returns # live neighbors
function getLiveNeighbors(grid, i, j) {
    let neighborCells = [];
    // Top row neighbors
    if(grid[i-1]) {
        if (grid[i-1][j-1]) {
        neighborCells.push(grid[i-1][j-1]);
        }
        if (grid[i-1][j]) {
        neighborCells.push(grid[i-1][j]);
        }
        if (grid[i-1][j+1]) {
        neighborCells.push(grid[i-1][j+1]);
        }
    }
    // Side neighbors
    if (grid[i][j-1]) {
        neighborCells.push(grid[i][j-1]); 
    }   
    if (grid[i][j+1]) {
      neighborCells.push(grid[i][j+1]);
    }

    // Bottom row neighbors
    if (grid[i+1]) {
        if (grid[i+1][j-1]) {
        neighborCells.push(grid[i+1][j-1]);
        }
        if (grid[i+1][j]) {
        neighborCells.push(grid[i+1][j]);
        }
        if (grid[i+1][j+1]) {
        neighborCells.push(grid[i+1][j+1]);
        }
    }
    
    return neighborCells.filter(x => x == true).length;
  }

// Define function to return a new grid after one turn
function createNextGrid(grid) {
    // This is the new grid that will be returned by our function
    let newGrid = [];
    
    // Nested loop to iterate through each cell
    for (let i = 0; i < grid.length; i++) {
      let row = [];
      for (let j = 0; j < grid[i].length; j++) {
        // Live neighbors count for the curret cell
        let liveNeighbors = getLiveNeighbors(grid, i, j);
        
        // Placing new cells in the grid according to the rules
        if (grid[i][j] == true) {
          // Any live cell with two or three live neighbors lives on 
          if (liveNeighbors == 2 || liveNeighbors == 3) {
            row.push(true);
          // Any live cell with fewer than two or more than three live neighbors dies
          } else {
            row.push(false);
          }
        // Any dead cell with exactly three live neighbors becomes a live cell
        } else {
          if (liveNeighbors == 3) {
            row.push(true);
          } else {
            row.push(false);
          }
        }
      }
      newGrid.push(row);
    }
    return newGrid;
  }

// Define a function to update the grid every 100 ms
function updateGrid() {
    currentGrid = createNextGrid(currentGrid);
    displayTable(currentGrid);
}

// Controls event listeners
startBtn.addEventListener("click", () => {
    update = setInterval(updateGrid, speed);
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
    running = true;
});

pauseBtn.addEventListener("click", () => {
    clearInterval(update);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = false;
    running = false;
});

resetBtn.addEventListener("click", () => {
    clearInterval(update);
    currentGrid = createRandomGrid();
    displayTable(currentGrid);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = true;
    running = false;
});

speedSlider.addEventListener("change", () => {
    speed = speedSlider.value;
    if (running) {
        clearInterval(update);
        update = setInterval(updateGrid, speed);
    }
});

// Testing click to add squares
gridContainer.addEventListener("click", (e) => {
    clearInterval(update);

    let cell = e.target;
    let j = Array.from(cell.parentNode.children).indexOf(cell);
    let row = e.target.parentNode;
    let i = Array.from(row.parentNode.children).indexOf(row);
    // currentGrid[i][j] = (cell.classList.contains("dead")) ? true : false;
    if (cell.classList.contains("dead")) {
        currentGrid[i][j] = true;
        cell.classList.remove("dead");
        cell.classList.add("live");
    }
    updateGrid();

    if(running) {
        update = setInterval(updateGrid, speed);
    }   
});

// Call displayTable once to initialize UI
let currentGrid = createRandomGrid();
displayTable(currentGrid);
