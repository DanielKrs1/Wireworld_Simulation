grid = [];

//Cell states
const EMPTY = 0;
const WIRE = 1;
const HEAD = 2;
const TAIL = 3;

//For drawing
var gridWidth = 10;
var gridHeight = 10;

var cellSize = 20;
var stateColors = {
    0 : [0, 0, 0],
    1 : [255, 255, 0],
    2 : [0, 0, 255],
    3 : [255, 0, 0]
};


function setup()
{
    grid = MakeArray(gridWidth, gridHeight);
    createCanvas(gridWidth * cellSize, gridHeight * cellSize);
    DrawGrid();

    widthInput = createInput("5");
    heightInput = createInput("5");
    resizeButton = createButton("Resize");
    resizeButton.mouseClicked(OnResizeGrid);
}

var isRunning = false;

function draw()
{
    if (isRunning)
    {
        UpdateCells();
        DrawGrid();
    }
}

function OnResizeGrid()
{
    var newWidth = parseInt(widthInput.value());
    var newHeight = parseInt(heightInput.value());

    if (isNaN(newWidth) || isNaN(newHeight))
    {
        return;
    }

    resizeCanvas(gridWidth * cellSize, gridHeight * cellSize);
    ResizeGrid(newWidth, newHeight);
    DrawGrid();
}

function ResizeGrid(newWidth, newHeight)
{
    gridWidth = newWidth;
    gridHeight = newHeight;

    /*
    1. Find if you need to add or remove cells
    2. Add/remove until the grid is the desired size
    3. Same for y / height

    Note: resize on x first
    */
}

var selectedCellType = WIRE;

function mousePressed()
{
    if (mouseX < 0 || mouseX >= width || mouseY < 0 || mouseY >= height)
    {
        return;
    }

    grid[round(mouseX / cellSize - 0.5)][round(mouseY / cellSize - 0.5)].state = selectedCellType;
    DrawGrid();
}


function keyPressed()
{
    if (key == "1")
    {
        selectedCellType = EMPTY;
    } else if (key == "2")
    {
        selectedCellType = WIRE;
    } else if (key == "3")
    {
        selectedCellType = HEAD;
    } else if (key == "4")
    {
        selectedCellType = TAIL;
    } else if (key == " ")
    {
        isRunning = !isRunning;
        print("Running: " + isRunning);
    }

    if (key == "x")
    {
        UpdateCells();
        DrawGrid();
    }
}


function DrawGrid()
{
    background(220);
    stroke(255);

    for (var i = 0; i < grid.length; i++)
    {
        var column = grid[i];

        for (var j = 0; j < column.length; j++)
        {
            var cell = column[j];
            var color = stateColors[cell.state];
            fill(color[0], color[1], color[2]);
            rect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
    }
}


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

var directions = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]];

function UpdateCells()
{
    for (var i = 0; i < gridWidth; i++)
    {
        for (var j = 0; j < gridHeight; j++)
        {
            var cell = grid[i][j];

            if (cell.state == EMPTY)
            {
                cell.nextState = EMPTY;
            } else if (cell.state == HEAD)
            {
                cell.nextState = TAIL;
            } else if (cell.state == TAIL)
            {
                cell.nextState = WIRE;
            } else if (cell.state == WIRE)
            {
                var neighboringHeads = 0;
                
                //Count neighboring heads
                for (var v = 0; v < 8; v++)
                {
                    var direction = directions[v];
                    var x = i + direction[0];
                    var y = j + direction[1];

                    if (IsOnBoard(x, y) && grid[x][y].state == HEAD)
                    {
                        neighboringHeads++;
                    }
                }

                print("Neighbors: " + neighboringHeads);
                
                if (neighboringHeads > 0 && neighboringHeads < 3)
                {
                    cell.nextState = HEAD;
                } else
                {
                    cell.nextState = WIRE;
                }
            }
        }
    }

    for (var i = 0; i < gridWidth; i++)
    {
        for (var j = 0; j < gridHeight; j++)
        {
            var cell = grid[i][j];
            cell.state = cell.nextState;
        }
    }
}


function IsOnBoard(x, y)
{
    return x >= 0 && y >= 0 && x < gridWidth && y < gridHeight;
}



/*
Rules:
1. Empty cell stays empty
2. Head always becomes tail
3. Tail always becomes wire
4. Wire becomes head if 1-2 neighbors are heads
*/