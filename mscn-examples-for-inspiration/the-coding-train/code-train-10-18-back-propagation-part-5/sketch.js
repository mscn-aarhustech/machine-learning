// https://www.youtube.com/watch?v=qB2nwJxNVxM&list=PLRqwX-V7Uu6Y7MdSCaIfsxc561QI0U0Tb&index=20

// set up canvas
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 800;

let training_data = [
    {
        inputs: [0, 1],
        targets: [1]
    },
    {
        inputs: [1, 0],
        targets: [1]
    },
    {
        inputs: [1, 1],
        targets: [0]
    },
    {
        inputs: [0, 0],
        targets: [0]
    }
]


function setup() {

    let nn = new NeuralNetwork(2, 2, 1);

    for(let i = 0; i < 1000000; i++) {
        let data = training_data[(Math.floor(Math.random() * training_data.length))]
        nn.train(data.inputs, data.targets);
    }

    console.log(nn.feedForward([1, 0]));
    console.log(nn.feedForward([0, 1]));
    console.log(nn.feedForward([1, 1]));
    console.log(nn.feedForward([0, 0]));
}

//
function draw() {
    
}

// Simulation loop
setup();
//setInterval(draw, 1000/600);
