
// Activation functions

//
function test(x) {
    return Math.sign(x) * Math.sqrt(Math.abs(x));
}

// Heaviside step function
function heaviside(x) {
    return x > 0 ? 1 : 0;
}

function dheaviside(x) {
    return 0;
}

// Linear activation function, aka identity function
function identity(x) {
    return x;
}

function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

function dsigmoid(y) {
    return y * (1 - y);
  }

function sigmoidLike(x) {
    return 0.5 + 0.5 * x / (1 + Math.abs(x));
}

// lower n gives a steeper sigmoid
// n = 0 equals binary perceptron / Heaviside step function behavior
function sigmoidLike2(x, n=0.1) {
    return 0.5 + 0.5 * x / (n + Math.abs(x));
}

function tanh(x) {
    return Math.tanh(x);
}

function dtanh(y) {
    return 1 - y * y; // Ok
}

function tanhLike(x) {
    return x / (0.1 + Math.abs(x));
}

function tanhLike2(x, n=0.1) {
    return x / (n + Math.abs(x));
}

function rationalTanh(x) {
    if(x < -3) return -1;
    if(x > 3) return 1;
    // Original function
    //return x * (27 + x * x) / (27 + 9 * x * x);
    // My optimized version
    let m = 2.7;
    let n = 7.5;
    return x*(m*n + x*x)/(m*n + n*x*x);
}

// relu
function relu(x) {
    return Math.max(0, x);
}

function drelu(x) {
    if(x >= 0) return 1;
    return 0;
}

function sin(x) {
    return Math.sin(x);
}