// https://www.youtube.com/watch?v=qB2nwJxNVxM&list=PLRqwX-V7Uu6Y7MdSCaIfsxc561QI0U0Tb&index=20

// set up canvas
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 800;


// variables
var nn;

//
function setup() {

    nn = new NeuralNetwork(2, 2, 2);
    let inputs = [1, 0];
    let targets = [1, 0];

    nn.train(inputs, targets);
}

//
function draw() {
    
}

// Simulation loop
setup();
//setInterval(draw, 1000/600);
