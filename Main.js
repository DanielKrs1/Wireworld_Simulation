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
    
    createButton("Save").mouseClicked(CreateSaveCode);
    saveCodeText = createP();
    
    radioButton = createRadio();
    radioButton.option(EMPTY, "Empty");
    radioButton.option(WIRE, "Wire");
    radioButton.option(HEAD, "Head");
    radioButton.option(TAIL, "Tail");
    
    createP("Load Grid: ");
    loadInput = createInput();
    createButton("Load").mouseClicked(LoadGridFromCode);
    
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
// Changes the cells t  o a new state depending on the variables around it
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

//Saving and loading

function CreateSaveCode()
{
    var saveCode = "";

    //Encode width and height
    saveCode += gridWidth + ".";
    saveCode += gridHeight + ".";

    //Encode all cells
    var consecutiveCells = 0;
    var currentCellState = grid[0][0].state;

    for (let i = 0; i < gridWidth; i++)
    {
        for (let j = 0; j < gridHeight; j++)
        {
            var cell = grid[i][j];

            if (cell.state == currentCellState)
            {
                consecutiveCells++;
            } else
            {
                saveCode += GetCellsCode(currentCellState, consecutiveCells);

                currentCellState = cell.state;
                consecutiveCells = 1;
            }
        }
    }

    saveCode += GetCellsCode(currentCellState, consecutiveCells);
    saveCodeText.html("Save Code: " + saveCode);
}

function GetCellsCode(currentCellState, consecutiveCells)
{
    return currentCellState.toString() + consecutiveCells.toString() + ".";
}

function LoadGridFromCode()
{
    var saveCode = new String(loadInput.value());
    print(saveCode);

    //Make correctly sized grid
    var newWidth = new String("");
    RemoveBeforePeriodAndSet(saveCode, newWidth);
    gridWidth = parseInt(newWidth.value);
    var newHeight = new String("");
    RemoveBeforePeriodAndSet(saveCode, newHeight);
    gridHeight = parseInt(newHeight.value);
    grid = MakeArray(gridWidth, gridHeight);
    
    //Set cells to correct states
    var cellData = new String();
    RemoveBeforePeriodAndSet(saveCode, cellData);
    var currentType = parseInt(cellData.value[0]);
    var cellsLeft = parseInt(cellData.value.slice(1, cellData.value.length));

    for (let i = 0; i < gridWidth; i++)
    {
        for (let j = 0; j < gridHeight; j++)
        {
            var cell = grid[i][j];
            cell.state = currentType;
            cellsLeft--;

            if (cellsLeft == 0)
            {
                if (saveCode.length == 0)
                {
                    print("NO");
                    end;
                }

                cellData.value = "";
                RemoveBeforePeriodAndSet(saveCode, cellData);
                var currentType = parseInt(cellData.value[0]);
                var cellsLeft = parseInt(cellData.value.slice(1, cellData.value.length));
            }
        }
    }

    end:
    resizeCanvas(gridWidth * cellSize, gridHeight * cellSize);
    DrawGrid();
}

function RemoveBeforePeriodAndSet(removeString, addString)
{
    var periodIndex = removeString.value.indexOf(".");
    addString.value = removeString.value.slice(0, periodIndex);
    removeString.value = removeString.value.substring(periodIndex + 1, removeString.value.length);
}

//Class for passing strings by reference
class String
{
    constructor(val)
    {
        this.value = val;
    }
}