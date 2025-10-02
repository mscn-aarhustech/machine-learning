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

    // brain = new NeuralNetwork(3, 3, 1);
    // var m1 = new Matrix(2, 2);
    // m1.randomize();
    // m1.print();
    // m1.multiply(2);
    // m1.print();
    // let m2 = new Matrix(2, 2);
    // m2.randomize();
    // m2.print();
    // let m3 = Matrix.multiply(m1, m2);
    // m3.print();

    let a = new Matrix(2, 2);
    a.randomize();
    a.print();

    function doubleIt(x) {
        return x * 2;
    }

    a.map(doubleIt);

    a.print();

}

//
function draw() {
    
}



// Simulation loop
setup();
//setInterval(draw, 1000/600);
