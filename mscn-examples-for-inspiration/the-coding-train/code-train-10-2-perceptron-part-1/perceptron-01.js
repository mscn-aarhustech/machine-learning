
function perceptron(inputs, weights, bias) {
    result = bias;
    for (let i = 0; i < inputs.length; i++) {
        result += inputs[i] * weights[i];
    }
    return Math.sign(result);
}

class Perceptron {
    constructor(inputs, weights, bias, threshold) {
        this.inputs = inputs;
        this.weights = weights;
        this.bias = bias;
        this.threshold = threshold;
    }
    result() {
        result = bias;
        for (let i = 0; i < inputs.length; i++) {
            result += inputs[i] * weights[i];
        }
        return Math.sign(result);
    }
    activate() {
        return 
    }
    

}