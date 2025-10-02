// Neuron with single input and single output
// rendering with canvas and plotly


// TODO:
// Name and group sliders
// Name or tag neurons 
// 


// initialize canvas
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800
canvas.height = 400

// Classes

class PointRGB {
    constructor(x, y, r, g, b) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.g = g;
        this.b = b;
    }
}

class PointRGBHSL {
    constructor(x, y, r, g, b) {
        // Position
        this.x = x;
        this.y = y;
        // RGB color
        this.r = r;
        this.g = g;
        this.b = b;
        // HSL color
        let hsl = RgbToHsl(r, g, b);
        this.h = hsl[0];
        this.s = hsl[1];
        this.l = hsl[2];
        // Radius
        this.radius = random(4, 12);
    }
}

// Script

// Create network
let layers = [4, 2];
let network = new Network(layers);

// List of objects with activation functions an names

let activationFunctions = {
    "identity": identity,
    "heaviside": heaviside,
    "sigmoid": sigmoid,
    "sigmoidLike": sigmoidLike,
    "sigmoidLike2": sigmoidLike2,
    "tanh": tanh,
    "tanhLike": tanhLike,
    "tanhLike2": tanhLike2,
    "rationalTanh": rationalTanh,
    "relu": relu,
    "leakyRelu": leakyRelu,
    "parametricRelu": parametricRelu,
    "elu": elu,
    "sin": sin,
    "cos": cos,
    "tan": tan,
};

console.log(network);

// In HTML document, create sliders for weights, named after the connection index
for (let i = 0; i < network.connections.length; i++) {
    let slider = document.createElement("input");
    slider.type = "range";
    slider.min = -1;
    slider.max = 1;
    slider.step = 0.01;
    slider.value = 0;
    slider.id = "w" + i;
    // append to div with id sliders
    document.getElementById("sliders").appendChild(slider);
}


// in HTML, add drop down menu for activation function selection
let activationFunctionMenu = document.createElement("select");
activationFunctionMenu.id = "activationFunction";
document.getElementById("buttons").appendChild(activationFunctionMenu);

// add options to drop down menu
for (let key in activationFunctions) {
    let option = document.createElement("option");
    option.value = key;
    option.text = key;
    activationFunctionMenu.appendChild(option);
}

// add event listener to sliders
for (let i = 0; i < network.connections.length; i++) {
    let slider = document.getElementById("w" + i);
    slider.addEventListener("input", function() {
        network.connections[i].weight = parseFloat(this.value);
    });
}

// Set HTML slider value to weight value
for (let i = 0; i < network.connections.length; i++) {
    let slider = document.getElementById("w" + i);
    slider.value = network.connections[i].weight;
}

var activationFunction = identity;

// add event listener to activation function drop down menu
activationFunctionMenu.addEventListener("change", function() {
    activationFunction = activationFunctions[this.value];
});

// In HTML, add weight reset and randomize buttons
let resetButton = document.createElement("button");
resetButton.id = "resetButton";
resetButton.innerHTML = "Reset weights";
document.getElementById("buttons").appendChild(resetButton);

let randomizeButton = document.createElement("button");
randomizeButton.id = "randomizeButton";
randomizeButton.innerHTML = "Randomize weights";
document.getElementById("buttons").appendChild(randomizeButton);

// add event listener to reset button
resetButton.addEventListener("click", function() {
    for (let i = 0; i < network.connections.length; i++) {
        network.connections[i].weight = 0;
    }
    for (let i = 0; i < network.connections.length; i++) {
        let slider = document.getElementById("w" + i);
        slider.value = network.connections[i].weight;
    }
});

// add event listener to randomize button
randomizeButton.addEventListener("click", function() {
    for (let i = 0; i < network.connections.length; i++) {
        network.connections[i].weight = random(-1, 1);
    }
    for (let i = 0; i < network.connections.length; i++) {
        let slider = document.getElementById("w" + i);
        slider.value = network.connections[i].weight;
    }
});

// generate points with position based color
let points = [];
let points_transformed = []; 

let numPointsX = 20; //16;
let numPointsY = 20; //16;

// for (let i = 0; i < numPointsX; i++) {
//     for (let j = 0; j < numPointsY; j++) {
//         let x = -1 + 2 * i / numPointsX + (1/numPointsX);
//         let y = -1 + 2 * j / numPointsY + (1/numPointsY);
//         //let col = getColorFromXY(random(-1, 1), random(-1, 1));
//         let col = getColorFromXY(x, y);
//         console.log(col);
//         //let col = getRandomColorRGB(0, 255);
//         //let hsl = getRandomColorHSL();
//         //let col = HslToRgb(hsl.h, hsl.s, hsl.l);
//         points.push(new PointRGBHSL(x, y, col.r, col.g, col.b));
//         points_transformed.push(new PointRGBHSL(x, y, col.r, col.g, col.b));
//     }
// }

for (let i = 0; i < numPointsX; i++) {
    for (let j = 0; j < numPointsY; j++) {
        let x = -1 + 2 * i / numPointsX + (1/numPointsX);
        let y = -1 + 2 * j / numPointsY + (1/numPointsY);
        //let col = getColorFromXY(random(-1, 1), random(-1, 1));
        //let col = getColorFromXY(x, y);
        //let col = getRandomColorRGB(0, 255);
        let hsl = getRandomColorHSL();
        let col = HslToRgb(hsl.h, hsl.s, hsl.l);
        points.push(new PointRGBHSL(x, y, col.r, col.g, col.b));
        points_transformed.push(new PointRGBHSL(x, y, col.r, col.g, col.b));
    }
}

// Plotly layout
let layout = {
    title: {
        text: 'Original dataset                                  Transformed dataset',
        font: {
            color: 'rgb(244, 244, 244)'
        }
    },
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
        autorange: false,
        color: 'rgb(244, 244, 244)'
    },
    yaxis: {
        range: [-2, 2],
        autorange: false,
        color: 'rgb(244, 244, 244)'
    },
    xaxis2: {
        domain: [0.55, 1],
        range: [-2, 2],
        autorange: false,
        color: 'rgb(244, 244, 244)'
    },
    yaxis2: {
        range: [-2, 2],
        autorange: false,
        color: 'rgb(244, 244, 244)'
    },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)'
};


render();

function renderNetwork(network) {
    const layerWidth = 100
    const layerHeight = 20
    const neuronRadius = 10
    const neuronSpacing = 25
    const layerSpacing = 25

    ctx.fillStyle = 'rgba(255, 255, 255, 0)';
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
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    }
    
    // Render neurons as circles
    // for (var layer = 0; layer < network.layers.length; layer++) {
    //   // loop through the neurons in the layer
    //   for (var neuron = 0; neuron < network.layers[layer].neurons.length; neuron++) {
    //     const x = 20 + layer * layerWidth + layer * layerSpacing
    //     const y = 20 + neuron * layerHeight + neuron * layerSpacing
    //     ctx.beginPath();
    //     ctx.arc(x, y, neuronRadius, 0, 2 * Math.PI, false);
    //     ctx.fillStyle = 'rgb(192, 192, 192)';
    //     ctx.fill();
    //     ctx.lineWidth = 3;
    //     // Color circle border according to bias
    //     const bias = network.layers[layer].neurons[neuron].bias
    //     const r = 255; //Math.floor(128 - bias * 128)
    //     const g = 255; // - r
    //     const b = 255
    //     ctx.strokeStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
    //     ctx.stroke();
    //   }
    // }

    // Render neurons as small tiled squares where values are represented by color
    for (var layer = 0; layer < network.layers.length; layer++) {
        // loop through the neurons in the layer
        for (var neuron = 0; neuron < network.layers[layer].neurons.length; neuron++) {
            const x = 20 + layer * layerWidth + layer * layerSpacing
            const y = 20 + neuron * layerHeight + neuron * layerSpacing
            const currentNeuron = network.layers[layer].neurons[neuron]
            
            for(let px = -1; px < 1; px += 0.1) {
                for(let py = -1; py < 1; py += 0.1) {
                    //network.setInput([x, y]);
                    network.setInput([px, py]);
                    network.run(activationFunction);
                    let output = currentNeuron.output; //network.getOutput();
                    // Color square according to output
                    // const red = Math.floor(128 - output * 128)
                    // const green = 255 - red
                    //ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + 128 + ')';
                    let r, g, b
                    if (output >= 0) {
                        r = 255 * output;
                        g = 128;
                        b = 255 - 255 * output;
                    } else {
                        r = 255 - 255 * -output;
                        g = 128;
                        b = 255 * -output;
                    }
                    ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
                    //ctx.fillRect(px * 100 + 400, py * 100 + 200, 10, 10);
                    let posX = (px * neuronRadius) + x;
                    let posY = (-py * neuronRadius) + y;
                    let width = neuronRadius * 0.1;
                    let height = neuronRadius * 0.1;
                    ctx.fillRect(posX, posY, width, height);
                }
            }

            // // Color square according to output
            // const red = Math.floor(128 - output * 128)
            // const green = 255 - red
            // ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + 128 + ')';
            // ctx.fillRect(x - neuronRadius, y - neuronRadius, neuronRadius * 2, neuronRadius * 2);
        }
        }

  }




function renderPlotlyGraph() {
    
    let trace1 = {
        x: points.map(p => p.x),
        y: points.map(p => p.y),
        mode: 'markers',
        marker: {
            //color: points.map(p => p.col),
            color: points.map(p => `rgb(${p.r},${p.g},${p.b})`),
            //size: pointRadius
            size: points.map(p => p.radius),
            opacity: 1.0,
            line: {
               color: 'rgb(0, 0, 0)',
               width: 0
            }
        },
        xaxis: 'x',
        yaxis: 'y'
    };
    
    let trace2 = {
        x: points_transformed.map(p => p.x),
        y: points_transformed.map(p => p.y),
        mode: 'markers',
        marker: {
            //color: points_transformed.map(p => p.col),
            color: points_transformed.map(p => `rgb(${p.r},${p.g},${p.b})`),
            //size: pointRadius
            size: points_transformed.map(p => p.radius),
            opacity: 1.0,
            line: {
               color: 'rgb(0, 0, 0)',
               width: 0
            }
        },
        xaxis: 'x2',
        yaxis: 'y2'
    };
    
    let data = [trace1, trace2];

    Plotly.newPlot('myDiv', data, layout);
}

function render()
{
    // transform points with neural network
    for (let i = 0; i < points.length; i++) {
        // normalize rgb values to range [-1, 1]
        let r = points[i].r / 255 * 2 - 1;
        let g = points[i].g / 255 * 2 - 1;
        let b = points[i].b / 255 * 2 - 1;
        let h = points[i].h / 360 * 2 - 1;
        let s = points[i].s / 100 * 2 - 1;
        let l = points[i].l / 100 * 2 - 1;
        // radius normalized to range [-1, 1] from min [4, 12]
        let radius = (points[i].radius - 4) / 8 * 2 - 1;
        //network.setInput([points[i].x, points[i].y, r, g, b]);
        //network.setInput([r, g, b, h, s, l]);
        network.setInput([h, s, l, radius]);
        network.run(activationFunction);
        let output = network.getOutput();
        points_transformed[i].x = output[0];
        points_transformed[i].y = output[1];
        // if (output[0] >= 0) {
        //     points_transformed[i].r = 255 * output[0];
        //     points_transformed[i].g = 128;
        //     points_transformed[i].b = 255 - 255 * output[0];
        // } else {
        //     points_transformed[i].r = 255 - 255 * -output[0];
        //     points_transformed[i].g = 128;
        //     points_transformed[i].b = 255 * -output[0];
        // }
    }

    renderPlotlyGraph()
    renderNetwork(network)
    requestAnimationFrame(render)
}

