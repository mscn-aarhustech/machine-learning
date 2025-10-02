// https://www.youtube.com/watch?v=IlmNhFxre0w&list=PLRqwX-V7Uu6Y7MdSCaIfsxc561QI0U0Tb&index=5

// set up canvas
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 800;


// variables
var nn;

//
function setup() {

    nn = new NeuralNetwork(2, 2, 1);
    let input = [1, 0];
    let output = nn.feedForward(input);
    console.log(output);
}

//
function draw() {
    
}

// Simulation loop
setup();
//setInterval(draw, 1000/600);
