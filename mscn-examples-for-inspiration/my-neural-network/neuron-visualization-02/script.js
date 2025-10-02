// Neuron with single input and single output
// rendering with Chart.js

const ctx = document.getElementById('myChart');

// Activation functions
function identity(x) {
    return x;
}

function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

function sigmoidLike(x) {
    return 0.5 + 0.5 * x / (1 + Math.abs(x));
}

// lower n gives a steeper sigmoid
// n = 0 equals binary perceptron / Heaviside step function behavior
function sigmoidLike2(x, n) {
    return 0.5 + 0.5 * x / (n + Math.abs(x));
}

function tanh(x) {
    return Math.tanh(x);
}

// Neuron
function neuron(input1, weight1, bias, activation) {
    return activation(input1 * weight1 + bias)
}

class Point {
    constructor(x, y, col) {
        this.x = x;
        this.y = y;
        this.col = col;
    }
}

function getColor(x, y) {
    // let r = Math.floor((x + 1) * 127.5); // scale x from [-1, 1] to [0, 255]
    // let g = Math.floor((y + 1) * 127.5); // scale y from [-1, 1] to [0, 255]
    let r = Math.floor((+ x + 1) * 127.5);
    let g = Math.floor(0.5 * (- x + 1 - y + 1) * 127.5);
    let b = Math.floor((y + 1) * 127.5);
    return `rgb(${r},${g},${b})`;
}

//  10 x  10 = 100
//  31.62 x 31.62 = 1000
// 100 x 100 = 10000


// generate 100 x 100 points in the range [-1, 1] x [-1, 1] with position based color
let points = [];

for (let i = 0; i < 1000; i++) {
    let x = -1 + 2 * Math.random();
    let y = -1 + 2 * Math.random();
    let col = getColor(x, y);
    points.push(new Point(x, y, col));
}

let points_transformed = [];  

// transform points with neuron
for (let i = 0; i < points.length; i++) {
    let x = neuron(points[i].x, -0.5, 0, identity);
    let y = neuron(points[i].y, -0.5, 0, identity);
    let col = points[i].col;
    points_transformed.push(new Point(x, y, col));
}

// Render with Plotly
let trace = {
    x: points.map(p => p.x),
    y: points.map(p => p.y),
    mode: 'markers',
    marker: {
        color: points.map(p => p.col),
        size: 6
    }
};

let data = [trace];

let layout = {
    title: 'Scatter Plot',
    showlegend: false,
    hovermode: false,
    xaxis: {
        range: [-1, 1],
        autorange: false
    },
    yaxis: {
        range: [-1, 1],
        autorange: false
    }
};

Plotly.newPlot('myDiv', data, layout);

// Render transformed Points in new plot named myDivTransformed
let trace2 = {
    x: points_transformed.map(p => p.x),
    y: points_transformed.map(p => p.y),
    mode: 'markers',
    marker: {
        color: points_transformed.map(p => p.col),
        size: 6
    }
};

let data2 = [trace2];

let layout2 = {
    title: 'Scatter Plot',
    showlegend: false,
    hovermode: false,
    xaxis: {
        range: [-1, 1],
        autorange: false
    },
    yaxis: {
        range: [-1, 1],
        autorange: false
    }
};

Plotly.newPlot('myDivTransformed', data2, layout2);

