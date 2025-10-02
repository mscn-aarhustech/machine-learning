
// https://www.youtube.com/watch?v=DGxIcDjPzac&list=PLRqwX-V7Uu6Y7MdSCaIfsxc561QI0U0Tb&index=3

// set up canvas
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 800;

let points = new Array(100);

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function map(n, start1, stop1, start2, stop2) {
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
}

function f(x) {
    return 0.89 * x - 0.1;
}

class Point {
    constructor(x, y) {
        this.x = x || Math.random() - Math.random();
        this.y = y || Math.random() - Math.random();
        this.bias = 1;
        let lineY = f(this.x);
        if(this.y > lineY) {
            this.label = 1;
        } else {
            this.label = -1;
        }
    }
    pixelX() {
        return map(this.x, -1, 1, 0, canvas.width);
    }
    pixelY() {
        return map(this.y, -1, 1, canvas.height, 0);
    }
    show() {
        ctx.beginPath();
        ctx.arc(this.pixelX(), this.pixelY(), 4, 0, 2 * Math.PI);

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
    
    constructor(n) {
        this.weights = new Array(n);
        this.learningRate = 0.1;
        this.setup();
    }

    setup(){
        // Initialize weights randomly
        for(let i = 0; i < this.weights.length; i++) {
            //this.weights[i] = Math.random(-1, 1);
            this.weights[i] = random(-1, 1);
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

    guessY(x) {
        let w0 = this.weights[0];
        let w1 = this.weights[1];
        let w2 = this.weights[2];
        return -(w2/w1) - (w0/w1)*x;
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

let perceptron = new Perceptron(3);

function setup() {
    // initialize points
    for(let i = 0; i < points.length; i++) {
        points[i] = new Point(Math.random()-Math.random(), Math.random()-Math.random());
        //console.log(points[i]);
    }
    
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw border
    ctx.beginPath();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.rect(1, 1, canvas.width-2, canvas.height-2);
    ctx.stroke();
    
    // draw line for equation f(x)
    let p1 = new Point(-1, f(-1));
    let p2 = new Point(1, f(1));
    
    ctx.beginPath();
    ctx.moveTo(p1.pixelX(), p1.pixelY());
    ctx.lineTo(p2.pixelX(), p2.pixelY());
    ctx.stroke();

    // Draw line that perceptron thinks is right
    let p3 = new Point(-1, perceptron.guessY(-1));
    let p4 = new Point(1, perceptron.guessY(1));

    //console.log(p3.pixelX(), p3.pixelY(), p4.pixelX(), p4.pixelY());

    ctx.beginPath();
    ctx.strokeStyle = "#222222";
    ctx.moveTo(p3.pixelX(), p3.pixelY());
    ctx.lineTo(p4.pixelX(), p4.pixelY());
    ctx.stroke();

    // draw points
    for(let i = 0; i < points.length; i++) {
        points[i].show();
    }

    // train perceptron
    for(let i = 0; i < points.length; i++) {

        let inputs = [points[i].x, points[i].y, points[i].bias];
        let target = points[i].label;

        let guess = perceptron.guess(inputs);

        if(guess == target) {
            ctx.fillStyle = "#00ff00";
        } else {
            ctx.fillStyle = "#ff0000";
        }

        ctx.beginPath();
        ctx.arc(points[i].pixelX(), points[i].pixelY(), 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

    }
}

//
setup();

function mousePressed() {
    for(let i = 0; i < points.length; i++) {
        let inputs = [points[i].x, points[i].y, points[i].bias];
        let target = points[i].label;
        perceptron.train(inputs, target);
    }
}

canvas.addEventListener('click', (e) => mousePressed());

// Simulation loop
setInterval(draw, 1000/600);
