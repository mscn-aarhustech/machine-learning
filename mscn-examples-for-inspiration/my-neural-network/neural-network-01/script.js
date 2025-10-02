
function random(min, max) {
    return Math.random() * (max - min) + min;
}

function activation_sigmoid(z) {
    return 1 / (1 + Math.exp(-z));
}

class Neuron {
    constructor() {
        this.bias = new Number(0.0);
        this.output = new Number(0.0);
        this.activationFunction = activation_sigmoid;
        this.inputConnections = new Array();
        this.outputConnections = new Array();
    }
    init() {
        this.bias = random(-1, 1);
    }
    activate() {
        let input = 0;
        for (let i = 0; i < this.inputConnections.length; i++) {
            input += this.inputConnections[i].inputNeuron.output * this.inputConnections[i].weight;
        }
        input += this.bias;
        this.output = this.activationFunction(input);
    }
}

class Connection {
    constructor(inputNeuron, outputNeuron, weight) {
        this.inputNeuron = inputNeuron;
        this.outputNeuron = outputNeuron;
        this.weight = weight;
    }
    init() {
        this.weight = random(-1, 1);
        this.inputNeuron.outputConnections.push(this);
        this.outputNeuron.inputConnections.push(this);
    }
}

class NeuronLayer {
    constructor(numNeurons) {
        this.neurons = new Array(numNeurons);
    }
    init() {
        for (let i = 0; i < this.neurons.length; i++) {
            this.neurons[i] = new Neuron();
            this.neurons[i].init();
        }
    }
}

class NeuralNetwork {
    constructor(layers) {
        this.layer = new Array(layers.length);

        for (let i = 0; i < layers.length; i++) {
            this.layer[i] = new NeuronLayer(layers[i]);
            this.layer[i].init();
        }

        // Connect all neuron layers with connections
        for (let i = 0; i < this.layer.length - 1; i++) {
            for (let j = 0; j < this.layer[i].neurons.length; j++) {
                for (let k = 0; k < this.layer[i + 1].neurons.length; k++) {
                    let connection = new Connection(this.layer[i].neurons[j], this.layer[i + 1].neurons[k]);
                    connection.init();
                }
            }
        }
    }
}

// let neuronA = new Neuron();
// neuronA.init();
// console.log(neuronA);

// let neuronB = new Neuron();
// neuronB.init();
// console.log(neuronB);

// let connectionAB = new Connection(neuronA, neuronB);
// connectionAB.init();
// console.log(connectionAB);

// let layer = new NeuronLayer(2);
// layer.init();
// console.log(layer);


let neuralNetwork = new NeuralNetwork([2, 2, 1]);
// neuralNetwork.init();
console.log(neuralNetwork);

// setup canvas
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let width = canvas.width = 800;
let height = canvas.height = 800;

// draw neural network 
function drawNeuralNetwork() {
    // clear screen with black color
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    // render neurons as white circles
    ctx.fillStyle = "white";
    for (let i = 0; i < neuralNetwork.layer.length; i++) {
        for (let j = 0; j < neuralNetwork.layer[i].neurons.length; j++) {
            ctx.beginPath();
            ctx.arc(100 + i * 100, 100 + j * 100, 30, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}

drawNeuralNetwork();