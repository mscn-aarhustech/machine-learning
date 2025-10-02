
function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

function sigmoidLike(x) {
    return 0.5 + 0.5 * x / (1 + Math.abs(x));
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

    train(inputs, targets) {
        let outputs = this.feedForward(inputs);

        // Convert array to matrix object
        outputs = Matrix.fromArray(outputs);
        targets = Matrix.fromArray(targets); 

        // Calculate the error
        // ERROR = TARGETS - OUTPUTS
        let output_errors = Matrix.subtract(targets, outputs);

        // Hidden layer weights transposed
        let weights_ho_t = Matrix.transpose(this.weights_ho);

        let hidden_errors = Matrix.multiply(weights_ho_t, output_errors);


        outputs.print();
        targets.print();
        output_errors.print();

    }
}