grid = [];

//Constants
const EMPTY = 0;
const WIRE = 1;
const HEAD = 2;
const TAIL = 3;
const directions = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]];
const stateColors =
{
    0 : [0, 0, 0],
    1 : [255, 255, 0],
    2 : [0, 0, 255],
    3 : [255, 0, 0]
};

//For drawing + grid
var gridWidth = 10;
var gridHeight = 10;
var cellSize = 20;

var selectedCellType = WIRE;
var isRunning = false;

//Main

function setup()
{
    grid = MakeArray(gridWidth, gridHeight);
    createCanvas(gridWidth * cellSize, gridHeight * cellSize);
    DrawGrid();
    
    widthInput = createInput();
    heightInput = createInput();
    createButton("Resize").mouseClicked(OnResizeGrid);
    createButton("Play/Pause").mouseClicked(OnTogglePlay);
    createButton("Step").mouseClicked(OnStep);
    
    radioButton = createRadio();
    radioButton.option(EMPTY, "Empty");
    radioButton.option(WIRE, "Wire");
    radioButton.option(HEAD, "Head");
    radioButton.option(TAIL, "Tail");
    PrintRules();
}

function draw()
{
    if (isRunning)
    {
        UpdateCells();
        DrawGrid();
    }

    if (radioButton.value() && radioButton.value() != selectedCellType)
    {
        selectedCellType = radioButton.value();
        print(selectedCellType);
    }
}


//User Controls

function mousePressed()
{
    if (mouseX < 0 || mouseX >= width || mouseY < 0 || mouseY >= height)
    {
        return;
    }

    grid[round(mouseX / cellSize - 0.5)][round(mouseY / cellSize - 0.5)].state = selectedCellType;
    DrawGrid();
}

function OnTogglePlay()
{
    isRunning = !isRunning;
}

function OnStep()
{
    UpdateCells();
    DrawGrid();
}



//Grid Functions
//Draws grid
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
// Changes the cells to a new state depending on the variables around it
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
//Called when "Resize" button is clicked
function OnResizeGrid()
{
    isRunning = false;

    var newWidth = parseInt(widthInput.value());
    var newHeight = parseInt(heightInput.value());

    if (isNaN(newWidth) || isNaN(newHeight) || newWidth < 1 || newHeight < 1)
    {
        return;
    }

    ResizeGrid(newWidth, newHeight);
    resizeCanvas(gridWidth * cellSize, gridHeight * cellSize);
    DrawGrid();
}
//Resizes the Grid without making a new one
function ResizeGrid(newWidth, newHeight)
{
    //Resize grid on the x
    if (newWidth > gridWidth)
    {
        while (grid.length < newWidth)
        {
            var newColumn = Make1DCellArray(grid[0].length);
            grid.push(newColumn);
        }
    } else
    {
        grid.length = newWidth;
    }

    //Resize grid on the y (resize each array in same way)
    if (newHeight > gridHeight)
    {
        for (var i = 0; i < grid.length; i++)
        {
            var gridColumn = grid[i];

            while (gridColumn.length < newHeight)
            {
                gridColumn.push(new Cell(EMPTY, EMPTY));
            }
        }
    } else
    {
        for (var i = 0; i < grid.length; i++)
        {
            var gridColumn = grid[i];
            gridColumn.length = newHeight;
        }
    }

    gridWidth = newWidth;
    gridHeight = newHeight;

    print(grid);
}


//Other stuff

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

function Make1DCellArray(arrayLength)
{
    var temp = [];

    for (var i = 0; i < arrayLength; i++)
    {
        temp.push(new Cell(EMPTY, EMPTY));
    }

    return temp;
}

function IsOnBoard(x, y)
{
    return x >= 0 && y >= 0 && x < gridWidth && y < gridHeight;
}

function PrintRules()
{
    createP("---");
    createP("<b><u>Welcome to Wireworld!</u></b>");
    createP("There are 4 types of cells: empty (black), wire (yellow), head (blue), and tail (red)");
    createP("Choose a cell type and click to place a cell.")
    createP("<b>Rules</b>");
    createP("1. Empty cells remain empty.");
    createP("2. Heads always become tails in the next generation.");
    createP("3. Tails always become wires in the next generation");
    createP("4. Wires becomes heads if 1 or 2 neighbors are heads, otherwise they stay a wire.");
}



/*
Rules:
1. Empty cell stays empty
2. Head always becomes tail
3. Tail always becomes wire
4. Wire becomes head if 1-2 neighbors are heads
*/