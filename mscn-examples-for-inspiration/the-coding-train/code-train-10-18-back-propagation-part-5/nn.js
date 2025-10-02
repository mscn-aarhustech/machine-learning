
// Activation functions
function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

function dsigmoid(y) {
    // return sigmoid(x) * (1 - sigmoid(x));
    // for efficiency, work with previously calculated y instead of x
    return y * (1 - y);
}

function sigmoidLike(x) {
    return 0.5 + 0.5 * x / (1 + Math.abs(x));
}

function sigmoidLikeN(x, n) {
    return 0.5 + 0.5 * x / (n + Math.abs(x));
}

function derivative_sigmoidLikeN(x, n) {
    if (x > 0) {
        return ((n + x) * 0.5 - 0.5 * x) / Math.pow(n + x, 2);
    } else if (x < 0) {
        return ((n - x) * 0.5 + 0.5 * x) / Math.pow(n - x, 2);
    } else {
        // Define the derivative at x = 0 as needed
        return 0;
    }
}

function tanh(x) {
    return Math.tanh(x);
}

function dtanh(y) {
    return 1 - y * y;
}

function tanhLike(x) {
    return x / (1 + Math.abs(x));
}

function tanhLikeN(x, n) {
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

function relu(x) {
    return Math.max(0, x);
}



class NeuralNetwork {
    constructor(numI, numH, numO) {
        this.input_nodes = numI;
        this.hidden_nodes = numH;
        this.output_nodes = numO;

        this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
        this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
        this.weights_ih.randomize();
        this.weights_ho.randomize();

        this.bias_h = new Matrix(this.hidden_nodes, 1);
        this.bias_o = new Matrix(this.output_nodes, 1);
        this.bias_h.randomize();
        this.bias_o.randomize();
        this.learning_rate = 0.1;
    }

    feedForward(input_array) {

        // Generate hidden layer outputs
        let inputs = Matrix.fromArray(input_array);
        let hidden = Matrix.multiply(this.weights_ih, inputs);
        hidden.add(this.bias_h);

        // activation function
        hidden.map(sigmoid);

        // Generate output layer putput
        let output = Matrix.multiply(this.weights_ho, hidden);
        output.add(this.bias_o);

        // activation function
        output.map(sigmoid);

        return output.toArray();
    }

    train(input_array, target_array) {
        
        // Feedforward
        // Generate hidden layer outputs
        let inputs = Matrix.fromArray(input_array);
        let hidden = Matrix.multiply(this.weights_ih, inputs);
        hidden.add(this.bias_h);
        // activation function
        hidden.map(sigmoid);

        // Generate output layer putput
        let outputs = Matrix.multiply(this.weights_ho, hidden);
        outputs.add(this.bias_o);

        // activation function
        outputs.map(sigmoid);

        // Convert array to matrix object
        let targets = Matrix.fromArray(target_array); 

        // Calculate the error
        // ERROR = TARGETS - OUTPUTS
        let output_errors = Matrix.subtract(targets, outputs);
        // gradient outputs * (1-outputs)
        
        // Calculate gradient
        let gradients = Matrix.map(outputs, dsigmoid)
        gradients.multiply(output_errors);
        gradients.multiply(this.learning_rate);

        // Calculate deltas
        let hidden_T = Matrix.transpose(hidden);
        let weights_ho_deltas = Matrix.multiply(gradients, hidden_T);
        // Adjust the weights by deltas
        this.weights_ho.add(weights_ho_deltas);
        // Adjust the bias by its deltas (which is just the gradients)
        this.bias_o.add(gradients);

        // Calculate the hidden layer errors
        let who_t = Matrix.transpose(this.weights_ho);
        let hidden_errors = Matrix.multiply(who_t, output_errors);
        
        let hidden_gradients = Matrix.map(hidden, dsigmoid);
        hidden_gradients.multiply(hidden_errors);
        hidden_gradients.multiply(this.learning_rate);

        // Calculate hidden deltas
        let input_T = Matrix.transpose(inputs);
        let weights_ih_deltas = Matrix.multiply(hidden_gradients, input_T);
        // Adjust the weights by deltas
        this.weights_ih.add(weights_ih_deltas);
        // Adjust the bias by its deltas (which is just the gradients)
        this.bias_h.add(hidden_gradients);

        // outputs.print();
        // targets.print();
        // output_errors.print();

    }
}