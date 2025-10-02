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

    var m1 = new Matrix(3, 2);
    var m2 = new Matrix(3, 2);

    m1.randomize();
    m2.randomize();

    console.table(m1.matrix);
    console.table(m2.matrix);

    m1.add(m2);

    console.table(m1.matrix);

}

//
function draw() {
    
}



// Simulation loop
setup();
//setInterval(draw, 1000/600);
