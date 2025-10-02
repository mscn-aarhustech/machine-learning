
// Activation functions

//
function test(x) {
    return Math.sign(x) * Math.sqrt(Math.abs(x));
}

// ***   Linear functions   ***

//  Binary step / Heaviside step function
function heaviside(x) {
    return x >= 0 ? 1 : 0;
}

// Linear activation function / identity function
function identity(x) {
    return x;
}

// ***   Non-linear functions   ***


// Sigmoid function / Logistic function
function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

function dsigmoid(y) {
    return y * (1 - y);
  }

function sigmoidLike(x) {
    return 0.5 + 0.5 * x / (1 + Math.abs(x));
}

function dsigmoidLike(x) {
    return 0.5 / Math.pow(1 + Math.abs(x), 2);
}

function sigmoidLike2(x, n = 0.1) {
    // lower n gives a steeper sigmoid
    // n = 0 equals binary perceptron / Heaviside step function behavior
    return 0.5 + 0.5 * x / (n + Math.abs(x));
}

// Hyperbolic tangent / tanh
function tanh(x) {
    return Math.tanh(x);
}

function dtanh(x) {
    let y = Math.tanh(x);
    return 1 - y * y; // Ok
}

function tanhLike(x) {
    return x / (1 + Math.abs(x));
}

function dTanhlike(x) {
    return 1 / Math.pow(1 + Math.abs(x), 2);
}

function tanhLike2(x, n = 1.0) {
    // n < 1 gives a steeper sigmoid
    // n > 1 gives a flatter sigmoid
    // n = 0 gives binary perceptron / Heaviside step function behavior
    return x / (n + Math.abs(x));
}

function dTanhlike2(x, n = 1.0) {
    return n / Math.pow(n + Math.abs(x), 2);
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

// ReLU (Rectified Linear Unit)
function relu(x) {
    return Math.max(0, x);
}

function drelu(x) {
    if(x >= 0) return 1;
    return 0;
}

// Leaky ReLU
function leakyRelu(x) {
    return Math.max(0.1 * x, x);
}

function dLeakyRelu(x) {
    if(x >= 0) return 1;
    return 0.1;
}

// Parametric ReLU
function parametricRelu(x, a = 0.01) {
    return Math.max(a * x, x);
}

function dParametricRelu(x, a = 0.01) {
    if(x >= 0) return 1;
    return a;
}

// Exponential linear unit (ELU)
function elu(x, a = 0.01) {
    if(x >= 0) return x;
    return a * (Math.exp(x) - 1);
}

function dElu(x, a = 0.01) {
    if(x >= 0) return 1;
    return a * Math.exp(x); // ?
}


function sin(x) {
    return Math.sin(x);
}

function cos(x) {
    return Math.cos(x);
}

function tan(x) {
    return Math.tan(x);
}