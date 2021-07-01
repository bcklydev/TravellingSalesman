//TODOS
// --- REFACTOR NODES INTO AN OBJECT WITH METHODS

//SET CANVAS
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
//SET CANVAS SIZE
var W = window.innerWidth, H = window.innerHeight;
ctx.canvas.width = W;
ctx.canvas.height = H;
//INIT VARIABLES USED BY GAMELOOP
var FPS = 60, now, then = Date.now(), interval = 1000/FPS, delta;

//STORES NAMES TO MAP TO NODES
var names = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O"];

//STORES ALL NODES
var nodes = [];
var numberOfNodes = nodes.length;

//STORE RECORD VALUE, POINTS AND NAMES
var record = Infinity;
var bestNames = [];
var bestPoints = [];

//GET DOM AND STORE AS VARIABLES
const DOCUMENT_RECORD = document.getElementById("record");
const ADD_BUTTON = document.getElementById("addNode");
const CLEAR_BUTTON = document.getElementById("clearNodes");
const SHUFFLE_BUTTON = document.getElementById("shuffleSolve");
const FACTORIAL_BUTTON = document.getElementById("factorialSolve");
const HEURISTIC_BUTTON = document.getElementById("heuristicSolve");

//TRACK STATES
var solving = false;
var solveType = "";

//ARRAY TO STORE ALL POSSIBLE PERMUTATIONS, VARS TO KEEP TRACK OF PROGRESS
var factorialNodes = [];
var factorialCounter = 0;
var totalPermutations = 0;

//NODE CLASS FOR EACH POINT
class node {
    constructor() {
        this.x = 100 + Math.floor(Math.random() * (W-200));
        this.y = 100 + Math.floor(Math.random() * (H-200));
        this.name = names[nodes.length];
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getName() {
        return this.name;
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = '#FFFFFF';
        ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.font = "12px Arial";
        ctx.fillText(this.name, this.x + 10, this.y + 10);
    }
}

function addNode() {
    console.log("Adding node...");
    if (nodes.length < 15) { //MAX LENGTH TO AVOID MEMORY ERRORS
        nodes.push(new node());
    }
    else {
        console.log("Cannot add more nodes.")
    }
    numberOfNodes = nodes.length;
}

function clearNodes() {
    nodes = [];
}

function shuffleSolve() {
    solving = true;
    solveType = "shuffle";
    numberOfNodes = nodes.length - 1;
    calculateCurrentPath();
}

function factorialSolve() {
    solving = true;
    solveType = "factorial";
    numberOfNodes = nodes.length - 1;
    calculateCurrentPath();
    factorialNodes = permute(nodes);
    totalPermutations = factorialNodes.length - 1;
}

function heuristicSolve() {
    solving = true;
    solveType = "heuristic";
    numberOfNodes = nodes.length - 1;
    calculateCurrentPath();
}

function nearestNeighbour(startingNode) {
    currentBestDistance = Infinity;
    currentBestName = "";
    currentBestIndex = 0;

    visitedNodes = [];
    unvisitedNodes = nodes.slice();

    visitedNodes.push(unvisitedNodes[startingNode]);
    unvisitedNodes.splice(startingNode,1);

    /**for(var j = 0; j < nodes.length-1; j++) {
        console.log(visitedNodes); 
        n = unvisitedNodes.length - 1;
        for(let i = 0; i < n; i++) {
            d = distanceBetweenPoints(visitedNodes[j].getX(), visitedNodes[j].getY(), unvisitedNodes[i].getX(), unvisitedNodes[i].getY());
            if(d < currentBestDistance) {
                currentBestDistance = d;
                currentBestName = unvisitedNodes[i].getName();
                currentBestIndex = i;
            }
        }

        visitedNodes.push(unvisitedNodes[currentBestIndex]);
        unvisitedNodes.splice(currentBestIndex, 1);

        //console.log(currentBestDistance,currentBestName,currentBestIndex);
    }**/
    console.log(visitedNodes);   
    console.log(unvisitedNodes);
}

function calculateCurrentPath() {
    sum = 0;
    for(var i = 0; i < numberOfNodes; i++) {
        sum = sum + distanceBetweenPoints(nodes[i].getX(), nodes[i].getY(), nodes[i+1].getX(), nodes[i+1].getY());
    }
    sum = sum + distanceBetweenPoints(nodes[numberOfNodes].getX(), nodes[numberOfNodes].getY(), nodes[0].getX(), nodes[0].getY());
    if(sum < record) {
        record = sum;
        bestPoints = nodes.slice();
        bestNames = []
        for(var i = 0; i < numberOfNodes + 1; i ++) {
            bestNames.push(nodes[i].getName());
        }
    }
}

//Draw the background
function drawBackground() {
    ctx.fillStyle = '#2F2F2F';
    ctx.fillRect(0,0,W,H);
}

//Set up game
function initGame() {
    //console.log("INIT!")
    drawGame();
}

function drawNodes() {
    n = nodes.length;
    for(var i = 0; i < n; i++) {
        nodes[i].draw();
    }
}

function drawWhiteLines() {
    if(solving) {
        for(var i = 0; i < numberOfNodes; i++) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].getX(),nodes[i].getY());
            ctx.lineTo(nodes[i+1].getX(),nodes[i+1].getY());
            ctx.strokeStyle = '#FFFFFF';
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.moveTo(nodes[numberOfNodes].getX(), nodes[numberOfNodes].getY());
        ctx.lineTo(nodes[0].getX(), nodes[0].getY());
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();
    }
}

function drawRedLines() {
    if(solving) {
        for(var i = 0; i < numberOfNodes; i++) {
            ctx.beginPath();
            ctx.moveTo(bestPoints[i].getX(),bestPoints[i].getY());
            ctx.lineTo(bestPoints[i+1].getX(),bestPoints[i+1].getY());
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#FF0000';
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.moveTo(bestPoints[numberOfNodes].getX(), bestPoints[numberOfNodes].getY());
        ctx.lineTo(bestPoints[0].getX(), bestPoints[0].getY());
        ctx.strokeStyle = '#FF0000';
        ctx.stroke();
    }
}

function drawGreenLines() {
    if(solving) {
        for(var i = 0; i < numberOfNodes; i++) {
            ctx.beginPath();
            ctx.moveTo(bestPoints[i].getX(),bestPoints[i].getY());
            ctx.lineTo(bestPoints[i+1].getX(),bestPoints[i+1].getY());
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#00FF00';
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.moveTo(bestPoints[numberOfNodes].getX(), bestPoints[numberOfNodes].getY());
        ctx.lineTo(bestPoints[0].getX(), bestPoints[0].getY());
        ctx.strokeStyle = '#00FF00';
        ctx.stroke();
    }
}

function updateButtons() {
    if(nodes < 2) {
        CLEAR_BUTTON.disabled = true;
        SHUFFLE_BUTTON.disabled = true;
    }
    if(nodes.length > 1) {
        CLEAR_BUTTON.disabled = false;
        SHUFFLE_BUTTON.disabled = false;
        FACTORIAL_BUTTON.disabled = false;
        HEURISTIC_BUTTON.disabled = false;
    }
    if(solving) {
        ADD_BUTTON.disabled = true;
        CLEAR_BUTTON.disabled = true;
        SHUFFLE_BUTTON.disabled = true;
        FACTORIAL_BUTTON.disabled = true;
        HEURISTIC_BUTTON.disabled = true;
    }
}

function updateRecord() {
    if(solving) {
        DOCUMENT_RECORD.innerHTML = record.toFixed(2) + " : " + bestNames;
    }
}

function drawPercentage() {
    ctx.font = "12px Arial";
    ctx.fillText((((factorialCounter + 1) / factorialNodes.length) * 100).toFixed(0), 10, 20);
}
  
  //Draw the game
function drawGame() {
    requestAnimationFrame(drawGame);
    now = Date.now();
    delta = now - then;
    if (delta > interval) {
        drawBackground();
        //DRAW THINGS
        drawNodes();
        drawWhiteLines();
        drawRedLines();
        if(solveType === "factorial") {
            drawPercentage();
        }
        updateGame();
        then = now - (delta % interval);
    }
}
  
//Update the game
function updateGame() {
    //UPDATE THINGS
    updateRecord();
    updateButtons();
    if(solving) {
        if(solveType === "shuffle") {
            nodes = shuffleArray(nodes);
        }
        else if(solveType === "factorial") {
            nodes = factorialNodes[factorialCounter];
            calculateCurrentPath();
            if(factorialCounter < totalPermutations) {
                factorialCounter++;
            }
            else {
                console.log(factorialCounter);
            }
        }
        else if(solveType === "heuristic") {
            nearestNeighbour(0);
        }
    }
}
  
//Start the game
window.onload = initGame();