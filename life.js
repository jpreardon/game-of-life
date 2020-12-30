var rows = 100
var columns = 100
var cellSize = 10
var currentGrid = []
var numPlays = 0
var startSize = .35
var startDensity = 7

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

function showGrid() {
    var row = ""
    for(let y = 0; y < rows; y++) {
        for(let x = 0; x < columns; x++) {
            if (currentGrid[x][y].status == "alive") {
                row = row +  "X "
            } else {
                row = row + "O "
            }
        }
        console.log(row)
        row = ""
    }
}

function neighbors(x,y) {
    theNeighbors = []

    for (let diffX = -1; diffX < 2; diffX++) {
        for (let diffY = -1; diffY < 2; diffY++) {
                neighborX = x + diffX
                neighborY = y + diffY
                if ( inRange(neighborX, neighborY) && !me([x, y], [neighborX, neighborY]) ) {
                    theNeighbors.push([neighborX, neighborY])
                }
        }
    }
    return theNeighbors
}

function inRange(x,y) {
    if (x < 0 || y < 0) {
        return false
    } else if (x > columns - 1) {
        return false
    } else if (y > rows - 2) {
        return false
    } else {
        return true
    }
}

function me(me, neighbor) {
    if( (me[0] == neighbor[0]) && (me[1] == neighbor[1]) ){
        return true
    } else {
        return false
    }
}

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
function deadOrAlive(x,y) {
    liveNeighbors = numberOfLiveNeighbors(x, y)
    
    if (currentGrid[x][y].status == "dead") {
        // Any dead cell with exactly three live neighbours will come to life. */
        if (liveNeighbors == 3) {
            return "alive"
        } else {
            return "dead"
        }
    } else if (currentGrid[x][y].status == "alive") {
        if (liveNeighbors < 2) {
            // Any live cell with fewer than two live neighbours dies (referred to as underpopulation or exposure[1]).
            return "dead"
        } else if (liveNeighbors > 3) {
            // Any live cell with more than three live neighbours dies (referred to as overpopulation or overcrowding).
            return "dead"
        } else if (liveNeighbors == 2 || liveNeighbors == 3 ) {
            // Any live cell with two or three live neighbours lives, unchanged, to the next generation.
            return "alive"
        }
    }
}

function nextGen() {
    var nextGrid = []
    column = []
    for(let x = 0; x < columns; x++){
        for(let y = 0; y < rows; y++) {
            column.push({
                x: x,
                y: y,
                status: deadOrAlive(x,y)
            })
        }
        nextGrid.push(column)
        column = []
    }
    currentGrid = nextGrid
}

function drawGrid() {
    document.getElementById("the-grid").innerHTML = ""
    currentGrid.forEach(column => {
        column.forEach(cell => {
            var cellContents = document.createElement("div")
            cellContents.setAttribute("class", `cell ${cell.status}`)
            document.getElementById("the-grid").appendChild(cellContents)
        })
    })
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
    console.log(`Play: ${numPlays}`)
    numPlays++
}

function runIt() {
    setUp()
    setInterval(play, 500)
}

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
