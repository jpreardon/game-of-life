var rows = 150    
var columns = 150
var cellSize = 5
var currentGrid = []
var startSize = .50
var startDensity = 7

// The Rules of Life
// Any dead cell with exactly three live neighbours will come to life. 
var birth = 3 // default 3
// Any live cell with fewer than two live neighbours dies (referred to as underpopulation or exposure[1]).
// Any live cell with more than three live neighbours dies (referred to as overpopulation or overcrowding).
// Any live cell with two or three live neighbours lives, unchanged, to the next generation.
var overPopulation = 3 // default 3
var underPopulation = 2 // default 2


// Setup/Play Functions

// Gets called by the onLoad event and gets things going
function runIt() {
    setUp()
    setInterval(play, 500)
}

function setUp() {
    document.getElementById("the-grid").setAttribute("style", `width: ${columns * cellSize}px`)
    populateGrid()
    seedGrid()
    drawGrid()
}

function play() {
    nextGen()
    drawGrid()
}

// Grid Functions

// Initial grid creation, only called once on load
function populateGrid() {
    column = []
    for(let x = 0; x < columns; x++){
        for(let y = 0; y < rows; y++) {
            column.push({
                x: x,
                y: y,
                status: "dead"
            })
        }
        currentGrid.push(column)
        column = []
    }
}

// Populates the grid with the next generation
function nextGen() {
    var nextGrid = []
    column = []
    for(let x = 0; x < columns; x++){
        for(let y = 0; y < rows; y++) {
            column.push({
                x: x,
                y: y,
                status: deadOrAlive(x, y)
            })
        }
        nextGrid.push(column)
        column = []
    }
    currentGrid = nextGrid
}

// Adds some "live" cells to the grid to get things started
function seedGrid() {
    currentGrid.forEach(column => {
        column.forEach(cell => {
            if ( inBounds(cell.x, cell.y) ) {
                if (Math.floor((Math.random() * 10) + 1) > startDensity) {
                    cell.status = "alive"
                }
            }
        })
    })
}

// Utility Functions

// Returns an array of 8 neighbors given for a given address
function neighbors(x, y) {
    theNeighbors = []

    for (let diffX = -1; diffX < 2; diffX++) {
        for (let diffY = -1; diffY < 2; diffY++) {
                neighborX = x + diffX
                neighborY = y + diffY
                if ( (diffX != 0) || (diffY != 0) ) {
                    theNeighbors.push(translateGridEdge(neighborX, neighborY))
                }
        }
    }
    return theNeighbors
}

// Returns coordinates from opposite edge if address is off grid, if on grid, it returns same address
function translateGridEdge(x, y) {
    var newX = x
    var newY = y
    
    if ( x == (columns) ) {
        newX = 0
    }

    if ( y == (rows) ) {
        newY = 0
    }

    if ( x == -1 ) {
        newX = columns - 1
    }

    if ( y == -1 ) { 
        newY = rows - 1
    }

    return [newX, newY]

}

// Returns the number of live neighbors
function numberOfLiveNeighbors(x, y) {
    myNeighbors = neighbors(x, y)
    liveCount = 0
    myNeighbors.forEach(cell => {
        if (currentGrid[cell[0]][cell[1]].status == "alive") {
            liveCount++
        }
    });
    return liveCount
}

// Returns whether a given cell should be "dead" or "alive" in the next generation based on the rules (see in-line comments for rules)
function deadOrAlive(x, y) {
    liveNeighbors = numberOfLiveNeighbors(x, y)
    
    if (currentGrid[x][y].status == "dead") {
        // Any dead cell with exactly three live neighbours will come to life. */
        if (liveNeighbors == birth) {
            return "alive"
        } else {
            return "dead"
        }
    } else if (currentGrid[x][y].status == "alive") {
        if (liveNeighbors >= underPopulation && liveNeighbors <= overPopulation) {
            return "alive"
        } else {
            return "dead"
        }
    }
}

// Draws the current grid on the screen
function drawGrid() {
    document.getElementById("the-grid").innerHTML = ""
    currentGrid.forEach(column => {
        column.forEach(cell => {
            var cellContents = document.createElement("div")
            cellContents.setAttribute("class", `cell ${cell.status}`)
            cellContents.setAttribute("style", `width: ${cellSize}px; height: ${cellSize}px`)
            document.getElementById("the-grid").appendChild(cellContents)
        })
    })
}

// Returns true if a given address is within the initial boundry (for seeding)
function inBounds(x, y) {
    var left = (columns / 2) - ((startSize * columns) / 2)
    var right = (columns / 2) + ((startSize * columns) / 2)
    var top = (rows / 2 ) - ((startSize * rows) / 2)
    var bottom = (rows / 2) + ((startSize * rows) /2 )

    if (x > left && x < right && y > top && y < bottom) {
        return true
    } else {
        return false
    }
}
