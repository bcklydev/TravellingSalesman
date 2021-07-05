//TODOS
// --- CREATE CHILD OBJECTS FOR EACH SOLVE TYPE
//     --- SHUFFLE
//     --- LEXICOGRAPHICAL
//     --- NEARESTNEIGHBOUR
// --- CREATE SOLVING ALGORITHMS FOR EACH CHILD OBJECT

//SET CANVAS
var ctx = document.getElementById("game").getContext("2d");
//SET CANVAS SIZE
var W = window.innerWidth, H = window.innerHeight;
ctx.canvas.width = W;
ctx.canvas.height = H;

//PATH CLASS FOR EACH POINT
class path {
    constructor(_colour = "#FFFFFF") {
        this.nodes = [];
        this.length = this.nodes.length - 1;
        this.colour = _colour;
        this.bestNodes = [];
        this.bestDistance = Infinity;
        this.bestNames = [];
        this.solved = false;
    }
    init(_nodes) {
        this.nodes = _nodes;
        this.length = this.nodes.length - 1;
        this.calculateSum();
    }
    calculateSum() {
        let sum = 0;
        for(var i = 0; i < this.length; i++) {
            sum = sum + distanceBetweenPoints(this.nodes[i].getX(), this.nodes[i].getY(), this.nodes[i+1].getX(), this.nodes[i+1].getY());
        }
        sum = sum + distanceBetweenPoints(this.nodes[this.length].getX(), this.nodes[this.length].getY(), this.nodes[0].getX(), this.nodes[0].getY());
        if(sum < this.bestDistance) {
            this.bestDistance = sum;
            this.bestNodes = this.nodes.slice();
            this.bestNames = [];
            for(var i = 0; i < this.length + 1; i ++) {
                this.bestNames.push(this.nodes[i].getName());
            }
        }
    }
    drawCurrent() {
        if(!this.solved) {
            for(var i = 0; i < this.length; i++) {
                ctx.beginPath();
                ctx.moveTo(this.nodes[i].getX(), this.nodes[i].getY());
                ctx.lineTo(this.nodes[i+1].getX(), this.nodes[i+1].getY());
                ctx.strokeStyle = "#FFFFFF";
                ctx.stroke();
            }
            ctx.beginPath();
            ctx.moveTo(this.nodes[this.length].getX(), this.nodes[this.length].getY());
            ctx.lineTo(this.nodes[0].getX(), this.nodes[0].getY());
            ctx.strokeStyle = "#FFFFFF";
            ctx.stroke();
        }
    }
    drawBest() {
        for(var i = 0; i < this.length; i++) {
            ctx.beginPath();
            ctx.moveTo(this.bestNodes[i].getX(), this.bestNodes[i].getY());
            ctx.lineTo(this.bestNodes[i+1].getX(), this.bestNodes[i+1].getY());
            ctx.strokeStyle = this.colour;
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.moveTo(this.bestNodes[this.length].getX(), this.bestNodes[this.length].getY());
        ctx.lineTo(this.bestNodes[0].getX(), this.bestNodes[0].getY());
        ctx.strokeStyle = this.colour;
        ctx.stroke();
    }
    draw() {
        this.drawCurrent();
        this.drawBest();
    }
}

class shuffle extends path {
    constructor(_colour = "#FFFFFF") {
        super(_colour);
        this.count = 0;
    }
    changePath() {
        if(this.count < 1000) {
            this.nodes = shuffleArray(this.nodes);
            this.calculateSum();
            this.count = this.count + 1;
        }
        else {
            this.solved = true;
        }
    }
}

class lexicographic extends path {
    constructor(_colour = "#FFFFFF") {
        super(_colour);
        this.total = 0;
        this.count = 0;
    }
    init(_nodes) {
        this.nodes = _nodes.slice();
        this.length = this.nodes.length - 1;
        this.calculateSum();
        this.total = factorial(this.nodes.length);
    }
    changePath() {
        if(!this.solved) {
            let largestI = -1;
            let largestJ = 0;
            for(var i = 0; i < this.nodes.length - 1; i++) {
                if(this.nodes[i]["name"] < this.nodes[i+1]["name"]) {
                    largestI = i;
                }
            }
            if(largestI === -1) {
                this.solved = true;
            }
            else {
                for(var j = 0; j < this.nodes.length; j++) {
                    if(this.nodes[largestI]["name"] < this.nodes[j]["name"]) {
                        largestJ = j;
                    }
                }
                arraySwap(this.nodes, largestI, largestJ);
                var tempArray = this.nodes.splice(largestI + 1);
                tempArray.reverse();
                this.nodes.push.apply(this.nodes, tempArray);
                this.calculateSum();
            }
            this.count = this.count + 1;
        }
    }
}

class greedy extends path {
    constructor(_colour = "#FFFFFF") {
        super(_colour);
        this.count = 0;
    }
    init(_nodes) {
        this.nodes = nodes.slice();
        this.length = this.nodes.length - 1;
        this.count = 0;
        this.bestNodes = this.nodes.slice();
    }
    changePath() {
        if(this.count > this.length) {
            this.solved = true;
        }
        else {
            var unvisited = this.nodes.slice()
            var l = unvisited.length;
            var visited = unvisited.splice(this.count, this.count + 1)
            for(let i = 0; i < this.nodes.length - 1; i++) {
                let d = 0;
                let record = Infinity;
                let nextNode = "";
                for(let j = 0; j < unvisited.length; j++) {
                    d = distanceBetweenPoints(visited[i].getX(), visited[i].getY(), unvisited[j].getX(), unvisited[j].getY());
                    if(d < record) {
                        record = d;
                        nextNode = j;
                    }
                }
                visited.push.apply(visited, unvisited.splice(nextNode, 1));
            }
            let tempDistance = 0;
            let tempNames = [];
            for(let i = 0; i < l - 1; i++) {
                tempDistance = tempDistance + distanceBetweenPoints(visited[i].getX(), visited[i].getX(), visited[i+1].getX(), visited[i+1].getX());
                tempNames.push(visited[i].getName());
            }
            tempDistance = tempDistance + distanceBetweenPoints(visited[l-1].getX(), visited[l-1].getX(), visited[0].getX(), visited[0].getX());
            tempNames.push(visited[l - 1].getName());

            if(tempDistance < this.bestDistance) {
                this.bestNodes = visited.slice();
                this.bestNames = tempNames.slice();
                this.bestDistance = tempDistance;
            }

            this.count = this.count + 1;
        }
    }
}

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

//INIT VARIABLES USED BY GAMELOOP
var FPS = 60, now, then = Date.now(), interval = 1000/FPS, delta;

//STORES NAMES TO MAP TO NODES
var names = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

//GET DOM AND STORE AS VARIABLES
const DOCUMENT_RECORD = document.getElementById("record");
const ADD_BUTTON = document.getElementById("addNode");
const CLEAR_BUTTON = document.getElementById("clearNodes");
const SOLVE_BUTTON = document.getElementById("solve");

var shufflePath = new shuffle("#FF0000");
var lexicoPath = new lexicographic("#00FF00");
var greedyPath = new greedy("#0000FF");

var nodes = [];
var solving = false;

function addNode() {
    if (nodes.length < 26) { //MAX LENGTH TO AVOID A LACK OF NAMES
        nodes.push(new node());
    }
}

function clearNodes() {
    nodes = [];
}

function beginSolve() {
    shufflePath.init(nodes);
    lexicoPath.init(nodes);
    greedyPath.init(nodes);
    solving = true;
}

//Set up game
function initGame() {
    drawGame();
}

//Draw the background
function drawBackground() {
    ctx.fillStyle = '#2F2F2F';
    ctx.fillRect(0,0,W,H);
}

function drawNodes() {
    n = nodes.length;
    for(var i = 0; i < n; i++) {
        nodes[i].draw();
    }
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
        if(solving) {
            shufflePath.draw();
            greedyPath.draw();
            lexicoPath.draw();
        }
        updateGame();
        then = now - (delta % interval);
    }
}
  
function updateButtons() {
    if(nodes < 2) {
        CLEAR_BUTTON.disabled = true;
        SOLVE_BUTTON.disabled = true;
    }
    else if(nodes.length > 25) {
        ADD_BUTTON.disabled = true;
    }
    else if(nodes.length > 1) {
        CLEAR_BUTTON.disabled = false;
        SOLVE_BUTTON.disabled = false;
    }
    if(solving) {
        ADD_BUTTON.disabled = true;
        CLEAR_BUTTON.disabled = true;
        SOLVE_BUTTON.disabled = true;
    }
}

function updateRecord() {
    if(solving) {
        DOCUMENT_RECORD.innerHTML = "<span style='color: #FF0000'>Best shuffle - " + shufflePath.bestDistance.toFixed(2) + " : " + shufflePath.bestNames + " : " + shufflePath.count +
        "</span><span style='color: #00FF00'><br>Best path - " + lexicoPath.bestDistance.toFixed(2) + " : " + lexicoPath.bestNames + " : " + ((lexicoPath.count / lexicoPath.total) * 100).toFixed(0).toString() +
        "</span><span style='color: #0000FF'><br>Heuristic - " + greedyPath.bestDistance.toFixed(2) + " : " + greedyPath.bestNames + "</span>";
    }
}

//Update the game
function updateGame() {
    //UPDATE THINGS
    updateButtons();
    if(solving) {
        updateRecord();
        shufflePath.changePath();
        lexicoPath.changePath();
        greedyPath.changePath();
    }
}
  
//Start the game
window.onload = initGame();