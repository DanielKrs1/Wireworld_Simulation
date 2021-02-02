grid = []

function setup()
{
    createCanvas(500, 500);
    grid = MakeArray(10, 10);
}

function draw()
{
    background(220);

    
}

function MakeArray(w, h)
{
    var newGrid = [];

    for (var i = 0; i < w; i++)
    {
        var tempGrid = [];

        for (var j = 0; j < h; j++)
        {
            tempGrid.push([]);
        }

        newGrid.push(tempGrid);
    }

    return newGrid;
}