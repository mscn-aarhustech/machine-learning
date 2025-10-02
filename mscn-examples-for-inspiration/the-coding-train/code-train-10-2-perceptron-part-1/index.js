
// https://www.youtube.com/watch?v=ntKn5TPHHAk&list=PLRqwX-V7Uu6Y7MdSCaIfsxc561QI0U0Tb&index=2

// set up canvas
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 800;

let points = new Array(100);

class Point {
    constructor(width, height) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        if(this.x > this.y) {
            this.label = 1;
        } else {
            this.label = -1;
        }
    }
    show() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 4, 0, 2 * Math.PI);

        if(this.label == 1) {
            ctx.fillStyle = "#ffffff"
        } else {
            ctx.fillStyle = "#000000"
        }
        ctx.fill();
        ctx.strokeStyle = "#000000";
        ctx.stroke();
    }
}

class Perceptron {
    
    constructor() {
        this.weights = new Array(2);
        this.learningRate = 0.1;
        this.setup();
    }

    setup(){
        // Initialize weights randomly
        for(let i = 0; i < this.weights.length; i++) {
            this.weights[i] = Math.random(-1, 1);
        }
    }

    guess(inputs) {
        let sum = 0;
        for(let i = 0; i < this.weights.length; i++) {
            sum += inputs[i] * this.weights[i];
        }
        let output = this.activate(sum);
        return output;
    }

    train(inputs, target) {
        let guess = this.guess(inputs);
        let error = target - guess;

        // Tune all the weights
        for(let i = 0; i < this.weights.length; i++) {
            this.weights[i] += error * inputs[i] * this.learningRate;
        }
    }

    printGuess(inputs) {
        console.log("Weights: " + this.weights);
        console.log("Inputs: " + inputs);
        let output = this.guess(inputs);
        console.log("Output: " + output);
        return output;
    }

    // Activation function
    activate(n) {
        return Math.sign(n);
    }
}

let perceptron = new Perceptron();

function setup() {
    // initialize points
    for(let i = 0; i < points.length; i++) {
        points[i] = new Point(Math.random(canvas.width), Math.random(canvas.height));
    }

    inputs = [-1, 0.5];
    perceptron.printGuess(inputs);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // draw line
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.stroke();

    // draw points
    for(let i = 0; i < points.length; i++) {
        points[i].show();
    }

    // train perceptron
    for(let i = 0; i < points.length; i++) {

        let inputs = [points[i].x, points[i].y];
        let target = points[i].label;

        let guess = perceptron.guess(inputs);

        if(guess == target) {
            ctx.fillStyle = "#00ff00";
        } else {
            ctx.fillStyle = "#ff0000";
        }
        ctx.beginPath();
        ctx.arc(points[i].x, points[i].y, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

    }
}

//
setup();

function mousePressed() {
    for(let i = 0; i < points.length; i++) {
        let inputs = [points[i].x, points[i].y];
        let target = points[i].label;
        perceptron.train(inputs, target);
    }
}

canvas.addEventListener('click', (e) => mousePressed());

// Simulation loop
setInterval(draw, 1000/600);
