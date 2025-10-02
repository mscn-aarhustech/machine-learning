// Neuron with single input and single output
// rendering with canvas and plotly


// initialize canvas
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400
canvas.height = 400

// Classes

class Point {
    constructor(x, y, col) {
        this.x = x;
        this.y = y;
        this.col = col;
    }
}

class PointRGB {
    constructor(x, y, r, g, b) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.g = g;
        this.b = b;
    }
}

class Neuron {
    constructor() {
        this.inputConnections = []
        this.outputConnections = []
        this.bias = 0
        this.input = 0
        this.output = 0
        this.init()
    }
    init() {
        this.bias = 0; //random(-1, 1)
        this.input = 0
        this.output = 0
    }
    addInputConnection(connection) {
        this.inputConnections.push(connection)
    }
    addOutputConnection(connection) {
        this.outputConnections.push(connection)
    }
}

class Connection {
    constructor(from, to) {
        this.from = from
        this.to = to
        this.weight = 0
        this.init()
    }
    init() {
        this.weight = random(-1, 1);
    }
}

class Layer {
    constructor(numberOfNeurons) {
        this.neurons = []
        this.init(numberOfNeurons)
    }
    init(numberOfNeurons) {
        for (var i = 0; i < numberOfNeurons; i++) {
            const neuron = new Neuron()
            this.neurons.push(neuron)
        }
    }
}

class Network {

    constructor(numberOfLayers) {
        this.connections = [];
        this.init(numberOfLayers);
    }
    init(numberOfLayers) {
        this.connections = [];
        this.createLayers(numberOfLayers);
        this.connectLayers();
    }
    createLayers(numberOfLayers) {
        this.layers = numberOfLayers.map((length) => {
            const layer = new Layer(length) 
            return layer
        })
    }
    connectLayers() {
        for (var layer = 1; layer < this.layers.length; layer++) {
            const thisLayer = this.layers[layer]
            const prevLayer = this.layers[layer - 1]
            for (var neuron = 0; neuron < prevLayer.neurons.length; neuron++) {
                for(var neuronInThisLayer = 0; neuronInThisLayer < thisLayer.neurons.length; neuronInThisLayer++) {
                    const connection = new Connection(prevLayer.neurons[neuron], thisLayer.neurons[neuronInThisLayer])
                    prevLayer.neurons[neuron].addOutputConnection(connection)
                    thisLayer.neurons[neuronInThisLayer].addInputConnection(connection)
                    this.connections.push(connection);
                }
            }
        }
    }
    setInput(values) {
        this.layers[0].neurons.forEach((neuron, i) => {
            neuron.output = values[i];
        })
    }
    getOutput() {
        return this.layers[this.layers.length - 1].neurons.map(neuron => neuron.output)
    }
    run(activationFunction = identity) {
        for (var layer = 1; layer < this.layers.length; layer++) {
            const thisLayer = this.layers[layer]
            const prevLayer = this.layers[layer - 1]
            for (var neuron = 0; neuron < thisLayer.neurons.length; neuron++) {
                const thisNeuron = thisLayer.neurons[neuron]
                let sum = 0
                for (var neuronInPrevLayer = 0; neuronInPrevLayer < prevLayer.neurons.length; neuronInPrevLayer++) {
                    const prevNeuron = prevLayer.neurons[neuronInPrevLayer]
                    for (var connection = 0; connection < prevNeuron.outputConnections.length; connection++) {
                        const thisConnection = prevNeuron.outputConnections[connection]
                        if (thisConnection.to === thisNeuron) {
                            sum += prevNeuron.output * thisConnection.weight
                        }
                    }
                }
                sum += thisNeuron.bias
                thisNeuron.input = sum
                thisNeuron.output = activationFunction(sum)
            }
        }
    }
}


// Script

// Create network
let layers = [2, 2];
let network = new Network(layers);
console.log(network);


// generate points with position based color
let points = [];
let points_transformed = []; 

let numPointsX = 20;
let numPointsY = 20;
let pointRadius = 5;

for (let i = 0; i < numPointsX; i++) {
    for (let j = 0; j < numPointsY; j++) {
        let x = -1 + 2 * i / numPointsX + (1/numPointsX);
        let y = -1 + 2 * j / numPointsY + (1/numPointsY);
        let col = getColor(x, y);
        points.push(new Point(x, y, col));
        points_transformed.push(new Point(x, y, col));
    }
}

// Plotly layout
let layout = {
    title: 'Original dataset -> Transformed dataset',
    showlegend: false,
    hovermode: false,
    width: 800,
    height: 450,
    grid: {
        rows: 1,
        columns: 2,
        subplots: [['xy', 'x2y']]
    },
    xaxis: {
        domain: [0, 0.45],
        range: [-2, 2],
        autorange: false
    },
    yaxis: {
        range: [-2, 2],
        autorange: false
    },
    xaxis2: {
        domain: [0.55, 1],
        range: [-2, 2],
        autorange: false
    },
    yaxis2: {
        range: [-2, 2],
        autorange: false
    }
};

render();

function renderNetwork(network) {
    const layerWidth = 100
    const layerHeight = 100
    const neuronRadius = 10
    const neuronSpacing = 25
    const layerSpacing = 25

    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    // Render connections
    for (var layer = 0; layer < network.layers.length; layer++) {
      // loop through the neurons in the layer
      for (var neuron = 0; neuron < network.layers[layer].neurons.length; neuron++) {
        const x = 20 + layer * layerWidth + layer * layerSpacing
        const y = 20 + neuron * layerHeight + neuron * layerSpacing
        const currentNeuron = network.layers[layer].neurons[neuron]
        // loop through the connections of the neuron
        for (var connection = 0; connection < currentNeuron.outputConnections.length; connection++) {
          const currentConnection = currentNeuron.outputConnections[connection]
          const toNeuron = currentConnection.to
          const toLayer = network.layers[layer + 1]
          const toNeuronIndex = toLayer.neurons.indexOf(toNeuron)
          const toX = 20 + (layer + 1) * layerWidth + (layer + 1) * layerSpacing
          const toY = 20 + toNeuronIndex * layerHeight + toNeuronIndex * layerSpacing
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(toX, toY);
          // colour line gradually according to weight
          //const red = Math.floor(128 - currentConnection.weight * 128)
          const red = Math.floor(128 - currentConnection.weight * 128)
          const green = 255 - red
          ctx.strokeStyle = 'rgb(' + red + ',' + green + ',' + 128 + ')';
          ctx.lineWidth = 4;
          ctx.stroke();
        }
      }
    }
    
    // Render neurons 
    for (var layer = 0; layer < network.layers.length; layer++) {
      // loop through the neurons in the layer
      for (var neuron = 0; neuron < network.layers[layer].neurons.length; neuron++) {
        const x = 20 + layer * layerWidth + layer * layerSpacing
        const y = 20 + neuron * layerHeight + neuron * layerSpacing
        ctx.beginPath();
        ctx.arc(x, y, neuronRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'rgb(128, 128, 128)';
        ctx.fill();
        ctx.lineWidth = 5;
        // Color circle border according to bias
        const bias = network.layers[layer].neurons[neuron].bias
        const red = Math.floor(20 + bias * 20)
        const green = 255 - red
        ctx.strokeStyle = 'rgb(' + red + ',' + red + ',' + red + ')';
        ctx.stroke();
      }
    }
  }



function render()
{
    let w11 = parseFloat(document.getElementById("w11").value);
    let w12 = parseFloat(document.getElementById("w12").value);
    let w21 = parseFloat(document.getElementById("w21").value);
    let w22 = parseFloat(document.getElementById("w22").value);

    network.connections[0].weight = w11;
    network.connections[1].weight = w12;
    network.connections[2].weight = w21;
    network.connections[3].weight = w22;  

    // transform points with neural network
    for (let i = 0; i < points.length; i++) {
        network.setInput([points[i].x, points[i].y]);
        network.run(identity);
        let output = network.getOutput();
        points_transformed[i].x = output[0];
        points_transformed[i].y = output[1];
    }

    let trace1 = {
        x: points.map(p => p.x),
        y: points.map(p => p.y),
        mode: 'markers',
        marker: {
            color: points.map(p => p.col),
            size: pointRadius
        },
        xaxis: 'x',
        yaxis: 'y'
    };
    
    let trace2 = {
        x: points_transformed.map(p => p.x),
        y: points_transformed.map(p => p.y),
        mode: 'markers',
        marker: {
            color: points_transformed.map(p => p.col),
            size: pointRadius
        },
        xaxis: 'x2',
        yaxis: 'y2'
    };
    
    let data = [trace1, trace2];

    Plotly.newPlot('myDiv', data, layout);
    renderNetwork(network)
    requestAnimationFrame(render)
}

