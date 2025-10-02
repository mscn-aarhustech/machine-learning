// https://www.youtube.com/watch?v=IlmNhFxre0w&list=PLRqwX-V7Uu6Y7MdSCaIfsxc561QI0U0Tb&index=5

// set up canvas
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 800;


// variables
var brain;

//
function setup() {

    brain = new NeuralNetwork(3, 3, 1);

    var a = new Matrix(2, 3);
    var b = new Matrix(3, 2);

    a.randomize();
    b.randomize();

    console.table(a.matrix);
    console.table(b.matrix);

    let c = a.multiply(b);
    console.table(c.matrix);

}

//
function draw() {
    
}



// Simulation loop
setup();
//setInterval(draw, 1000/600);
