// NAND Sigmoid neuron

// Source: http://neuralnetworksanddeeplearning.com/chap1.html#sigmoid_neurons
// NAND: https://en.wikipedia.org/wiki/NAND_gate

function NAND_sigmoid_neuron(input1, input2, weight1, weight2, bias) {
    return sigmoidLike2(input1 * weight1 + input2 * weight2 + bias, 0.0)
}

// Test
console.log( "Input [1, 1] = " + NAND_sigmoid_neuron(1, 1, -2, -2, 3));
console.log( "Input [1, 0] = " + NAND_sigmoid_neuron(1, 0, -2, -2, 3));
console.log( "Input [0, 1] = " + NAND_sigmoid_neuron(0, 1, -2, -2, 3));
console.log( "Input [0, 0] = " + NAND_sigmoid_neuron(0, 0, -2, -2, 3));

function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

function sigmoidLike(x) {
    return 0.5 + 0.5 * x / (1 + Math.abs(x));
}

// lower n gives a steeper sigmoid
// n = 0 equals perceptron behavior
function sigmoidLike2(x, n) {
    return 0.5 + 0.5 * x / (n + Math.abs(x));
}