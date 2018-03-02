var canvas = document.querySelector('canvas');

var width  = 640;
var height = 480;
canvas.width  = width;
canvas.height = height;

var ctx = canvas.getContext('2d'); // ctx === context


// class used for retaining data acquired from the mouse
function MouseClick(x,y) {
   this.x = x;
   this.y = y;
}
var canClick = true; // used to stop interaction of mouse clicks with canvas after bezier curve is drawn
var controlPoints = []; // contains the control points used to compute the bezier curve
var controlPointsValuesY = [] // contains all control points Y values, used to compute the coordinate functions
var controlPointsValuesX = [] // same idea as above
start(); // used to initialize the variables, draw and redraw the starting screen

window.addEventListener('click',
    function(event)
    {
        var mouseClick = new MouseClick(event.x, event.y);

        if(canDraw(mouseClick) && canClick)
        {
            if(controlPoints.length == 0)
            {
                drawControlPoint(mouseClick,'black', 'green');
            }
            else
            {   
                drawLine(controlPoints[controlPoints.length - 1], mouseClick, 'black');
                drawControlPoint(mouseClick, 'black', 'green');
            }
            controlPointsValuesX.push(mouseClick.x);
            controlPointsValuesY.push(mouseClick.y);
            controlPoints.push(mouseClick);     
        } 
    })



window.addEventListener('keydown', 
function(event) {
    var keyCode = event.which || event.keyCode; // used both to avoid cross-browser problems
    if(keyCode == 32) // space bar --- used for calculating and drawing the Bezier curve and the coordinate functions
    {
    drawBezierCurve(controlPoints,'red');
    drawCoordinateFunctionPoints(controlPointsValuesX,controlPointsValuesY,controlPoints.length);
    canClick = !canClick;
    
    }

    if(keyCode == 27) // escape button --- used for reseting / clearing
    {
      start();
    }

    })

//"class" used to draw control points and bezier curve points
function Circle(x, y, radius, strokeStyle, fillStyle)
{
    this.x           = x;
    this.y           = y;
    this.radius      = radius;
    this.strokeStyle = strokeStyle;
    this.fillStyle   = fillStyle;
    
    this.draw = function()
    {
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2);
        ctx.strokeStyle = this.strokeStyle;
        ctx.stroke();
        ctx.fillStyle = this.fillStyle;
        ctx.fill();
    }
}

function drawControlPoint(mouseClick,strokeStyle, fillStyle)
{
   var circle = new Circle(mouseClick.x, mouseClick.y, 4, strokeStyle, fillStyle);
   circle.draw();
}

function drawLine(point1, point2,strokeStyle)
{    
    ctx.beginPath();
    ctx.moveTo(point1.x,point1.y);
    ctx.lineTo(point2.x,point2.y);
    ctx.strokeStyle = strokeStyle;
    ctx.stroke(); 
}
// could've used drawControlPoint but still used for more clarity
function drawBezierPoint(point, colour)
{   
    var circle = new Circle(point.x, point.y, 1, colour, colour);
    circle.draw();
}

//linear interpolation between two points with parameter t, t E [0,1]
function lerp(point1, point2, t)
{
    var npx = point1.x * (1 - t) + point2.x * t; // new point x-coordinate
    var npy = point1.y * (1 - t) + point2.y * t; // new point y-coordinate
    return new MouseClick(npx, npy);
}
// computes the point of the Bezier curve corresponding to the current parameter "t"
function computeCurrentCurvePoint(controlPoints, t)
{   
    if(controlPoints.length == 1) // each call the controlPoints decrease by one
    {   
        return controlPoints[0];
    }
    else if(controlPoints.length > 1)
    {   
        var newCps = [];
        var temporaryPoint;
        for(var index = 1; index < controlPoints.length ; ++index)
        {   
            temporaryPoint = lerp(controlPoints[index - 1], controlPoints[index], t);
            newCps.push(temporaryPoint);
        }
        return computeCurrentCurvePoint(newCps, t);  // on each recursive call the new points for newCps are calculated
    }
}

// draws the Bezier curve with the given control points
function drawBezierCurve(controlPoints, colour)
{   
    var drawingPoint;
    for(var t = 0; t <= 1;t += 0.001)
    {
       drawingPoint = computeCurrentCurvePoint(controlPoints, t);
       drawBezierPoint(drawingPoint, colour);
    }
}

function drawCoordinateFunctionPoints(pointsX, pointsY, pointsCount)
{   
    var drawingPoint;

    var startingX = 300; // start x-value for the coordinate function on the left
    var stepX = 260 / pointsCount; // calculates how close should the control points be next to each other
    var controlPointsLeft = []; // used to draw the Bezier curve

    var startingY = 260; // same idea as above, used for the coordinate function on the bottom right half
    var stepY = 200 / pointsCount;
    var controlPointsDown = [];

    for(var counter = 0 ; counter < pointsCount; ++counter)
    {   
        controlPointsLeft.push(new MouseClick(startingX, pointsY[counter])); 
        drawingPoint = new MouseClick(startingX, pointsY[counter]);
        drawControlPoint(drawingPoint, 'black','darkgrey');
        startingX -= stepX;

        controlPointsDown.push(new MouseClick(pointsX[counter],startingY));
        drawingPoint = new MouseClick(pointsX[counter],startingY);
        drawControlPoint(drawingPoint, 'black', 'darkgrey');
        startingY += stepY; // increases because going down means increasing "y"
    }
    for(var i = 1 ; i < pointsCount; ++i) // draws the polygons
    {
        drawLine(controlPointsLeft[i - 1],controlPointsLeft[i], 'black');
        drawLine(controlPointsDown[i - 1],controlPointsDown[i], 'black');
    }
    drawBezierCurve(controlPointsLeft, 'black');
    console.log(controlPointsLeft.length);
    drawBezierCurve(controlPointsDown, 'black');
}

//used to check if the mouse is in boundaries for drawing meaning -->  I quadrant
function canDraw(point)
{   
    if(point.x >= 320   && 
       point.y <= 240   && 
       point.x <= width &&
       point.y <= height ) return true;

    return false;
}


function drawCoordinateSystem()
{
    ctx.font = '16pt Ariel';
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'black';

    // y-axis
    ctx.beginPath(); 
    ctx.moveTo(320,20);
    ctx.lineTo(320,460);
    ctx.stroke();
    
    // x-axis
    ctx.beginPath();
    ctx.moveTo(20,240);
    ctx.lineTo(620,240);
    ctx.stroke();
    
    // top arrow
    ctx.beginPath();
    ctx.moveTo(315,30);
    ctx.lineTo(325,30);
    ctx.lineTo(320,10);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.fillText("y",330,30);
    
    // bottom arrow
    ctx.beginPath();
    ctx.moveTo(315,455);
    ctx.lineTo(325,455);
    ctx.lineTo(320,470);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.fillText("t",300,460);
    
    // left arrow
    ctx.beginPath();
    ctx.moveTo(30,235);
    ctx.lineTo(30,245);
    ctx.lineTo(10,240);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.fillText("t",20,260);
    
    // right arrow
    ctx.beginPath();
    ctx.moveTo(610,235);
    ctx.lineTo(610,245);
    ctx.lineTo(630,240);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.fillText("x",610,230);    
}

function start()
{
    ctx.clearRect(0,0, canvas.width, canvas.height);
    drawCoordinateSystem();
    controlPoints.length = 0;
    canClick = true;
}