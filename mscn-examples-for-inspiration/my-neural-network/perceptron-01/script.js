// NAND Perceptron

// Source: http://neuralnetworksanddeeplearning.com/chap1.html#perceptrons
// NAND: https://en.wikipedia.org/wiki/NAND_gate

function NAND_perceptron(input1, input2, weight1, weight2, bias) {
    return (input1 * weight1 + input2 * weight2 + bias >= 0) ? 1 : 0;
}

// Test
console.log( "Input [1, 1] = " + NAND_perceptron(1, 1, -2, -2, 3));
console.log( "Input [1, 0] = " + NAND_perceptron(1, 0, -2, -2, 3));
console.log( "Input [0, 1] = " + NAND_perceptron(0, 1, -2, -2, 3));
console.log( "Input [0, 0] = " + NAND_perceptron(0, 0, -2, -2, 3));
