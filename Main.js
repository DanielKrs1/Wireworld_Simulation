grid = [];

//Cell states
const EMPTY = 0;
const WIRE = 1;
const HEAD = 2;
const TAIL = 3;

//For drawing
var gridWidth = 20;
var gridHeight = 20;

var cellSize = 10;
var stateColors =
[
    [EMPTY, [0, 0, 0]],
    [WIRE, [255, 255, 0]],
    [HEAD, [0, 0, 255]],
    [TAIL, [255, 0, 0]]
];


function setup()
{
    grid = MakeArray(gridWidth, gridHeight);
    createCanvas(gridWidth * cellSize, gridHeight * cellSize);
}


function draw()
{
    DrawGrid();
}


function DrawGrid()
{
    background(220);

    //Draw grid
    for (var i = 0; i < grid.length; i++)
    {
        var column = grid[i];

        for (var j = 0; j < column.length; j++)
        {
            var cell = column[j];

            //Get correct color to draw cell
            var stateColorPair = stateColors.find(pair => pair[0] == cell.state);
            fill(stateColorPair[1]);

            //Draw square
            rect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
    }
}


//Makes a grid of cells
function MakeArray(w, h)
{
    var newGrid = [];

    for (var i = 0; i < w; i++)
    {
        var tempGrid = [];

        for (var j = 0; j < h; j++)
        {
            tempGrid.push(new Cell(EMPTY, EMPTY));
        }

        newGrid.push(tempGrid);
    }

    return newGrid;
}


class Cell
{
    constructor(state, nextState)
    {
        this.state = state;
        this.nextState = nextState;
        
    }
}