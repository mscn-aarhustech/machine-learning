"use strict";

// Exampe neural network params:
// const nnParams = {
//     layers : [2, 2, 1],
//     learningRate : 0.3,
//     momentum : 0.1,
//     bias : {
//         min : -10,
//         max : 10
//     },
//     weight : {
//         min : -10,
//         max : 10
//     },
//     activation : {
//         function : ActivationFunctions.sigmoid,
//         derivative : ActivationFunctions.dsigmoid
//     }
// }

class Neuron {
    constructor() {
        this.bias = null;
        this.delta = 0;
        this.output = 0;
        this.error = 0;
        this.influence = 0;
        this.id = null;

        Object.seal(this);
    }

    toJSON() {
        return {
            id: this.id,
            delta: this.delta,
            output: this.output,
            error: this.error,
            influence: this.influence,
            bias: this.bias
        };
    }
}

class Connection {
    constructor(from, to) {
        this.from = from;  // The "from" neuron
        this.to = to;      // The "to" neuron
        this.weight = null;
        this.change = 0;
        this.id = null;

        Object.seal(this);
    }

    toJSON() {
        return {
            change: this.change,
            weight: this.weight,
            from: this.from.id,
            to: this.to.id
        };
    }
}

class Layer {
    constructor(numberOfNeurons) {
        this.neurons = Array.from({ length: numberOfNeurons }, () => new Neuron());
        this.connections = [];  // connections between this and next layer
        this.id = null;

        Object.seal(this);
    }

    toJSON() {
        return {
            neurons: this.neurons.map(n => n.toJSON()),
            connections: this.connections.map(c => c.toJSON())
        };
    }
}

class Network {
    constructor(params) {
        this.params = params;
        // Initialize layers
        this.layers = this.params.layers.map((numberOfNeurons, layerIndex) => {
            const layer = new Layer(numberOfNeurons);
            layer.id = `L${layerIndex}`;

            layer.neurons.forEach((neuron, neuronIndex) => {
                neuron.id = `L${layerIndex}N${neuronIndex}`;
            });

            // If not the input layer, assign random biases to neurons
            if (layerIndex !== 0) {
                // Loop through neurons in the layer, with index
                layer.neurons.forEach((neuron, neuronIndex) => {
                    neuron.bias = Math.random() * (this.params.bias.max - this.params.bias.min) + this.params.bias.min;
                });
            }
            return layer;
        });
        
        this.learningRate = this.params.learningRate;
        this.momentum = this.params.momentum;

        this.connectLayers();

        Object.seal(this);
    }

    calculateInfluence() {
        for (let layerIndex = 1; layerIndex < this.layers.length - 1; layerIndex++) {
            const neurons = this.layers[layerIndex].neurons;
            const connections = this.layers[layerIndex - 1].connections;
            
            for (let neuron of neurons) {
                
                let influence = 0;
                
                for (let connection of connections) {
                    if (connection.to === neuron) {
                        influence += connection.from.influence * connection.weight;
                        influence += connection.weight;
                    }
                }
                
                neuron.influence = neuron.bias + influence;
                //neuron.influence = influence;
            }
        }
    }

    sortByInfluence() {
        
        this.calculateInfluence();
        
        // for (let layer of this.layers) {
        //     layer.neurons.sort((a, b) => a.influence - b.influence);
        // }
        for (let layerIndex = 1; layerIndex < this.layers.length - 1; layerIndex++) {
            let layer = this.layers[layerIndex];
            layer.neurons.sort((a, b) => a.influence - b.influence);
        }

        for (let layerIndex = 0; layerIndex < this.layers.length - 1; layerIndex++) {
            let fromNeurons = this.layers[layerIndex].neurons;
            let toNeurons = this.layers[layerIndex + 1].neurons;

            let connections = this.layers[layerIndex].connections;
            let sortedConnections = [];

            for (let fromNeuron of fromNeurons) {
                for (let toNeuron of toNeurons) {
                    let connection = connections.find(c => c.id === `${fromNeuron.id}-${toNeuron.id}`);
                    sortedConnections.push(connection);
                }
            }

            this.layers[layerIndex].connections = sortedConnections;
        }
    }

    // Connect layers by creating connections between adjacent layers
    connectLayers() {
        for (let i = 0; i < this.layers.length - 1; i++) {
            let connectionIndex = 0;
            //this.layers[i].connectTo(this.layers[i + 1], this.params.weight);
            for (let fromNeuron of this.layers[i].neurons) {
                for (let toNeuron of this.layers[i + 1].neurons) {
                    const connection = new Connection(fromNeuron, toNeuron);
                    connection.weight = Math.random() * (this.params.weight.max - this.params.weight.min) + this.params.weight.min;
                    connection.id = `${fromNeuron.id}-${toNeuron.id}`;
                    this.layers[i].connections.push(connection);
                    connectionIndex++;
                }
            }
        }
    }

    toJSON() {
        return {
            learningRate: this.learningRate,
            layers: this.layers.map(layer => layer.toJSON())
        };
    }

    train(input, output) {
        this.activate(input);
        this.runInputActivationFunction();
        this.calculateDeltas(output);
        this.adjustWeights();
    }

    // Set input values for the first layer
    activate(values) {
        this.layers[0].neurons.forEach((n, i) => {
            n.output = values[i];
        });
    }

    // Forward pass through the network
    runInputActivationFunction(activationFunction = this.params.activation.function) {
        for (let layerIndex = 1; layerIndex < this.layers.length; layerIndex++) {
            const layer = this.layers[layerIndex];
            for (let neuron of layer.neurons) {
                let weightedSum = neuron.bias;
                // Sum weighted inputs from previous layer
                for (let connection of this.layers[layerIndex - 1].connections) {
                    if (connection.to === neuron) {
                        weightedSum += connection.weight * connection.from.output;
                    }
                }
                neuron.output = activationFunction(weightedSum);
            }
        }
        return this.layers[this.layers.length - 1].neurons.map(n => n.output);
    }

    calculateDeltas(target, activationFunctionDerivative = this.params.activation.derivative) {
        for (let layerIndex = this.layers.length - 1; layerIndex >= 0; layerIndex--) {
            const layer = this.layers[layerIndex];
            for (let neuron of layer.neurons) {
                let output = neuron.output;
                let error = 0;

                if (layerIndex === this.layers.length - 1) {
                    // Output layer error
                    error = target[layer.neurons.indexOf(neuron)] - output;
                } else {
                    // Hidden layers' errors
                    for (let connection of this.layers[layerIndex].connections) {
                        if (connection.from === neuron) {
                            error += connection.to.delta * connection.weight;
                        }
                    }
                }

                neuron.error = error;
                neuron.delta = error * activationFunctionDerivative(output);
            }
        }
    }

    adjustWeights() {
        for (let layerIndex = 1; layerIndex < this.layers.length; layerIndex++) {
            const prevLayer = this.layers[layerIndex - 1];
            const currentLayer = this.layers[layerIndex];

            for (let neuron of currentLayer.neurons) {
                const delta = neuron.delta;
                for (let connection of prevLayer.connections) {
                    if (connection.to === neuron) {
                        let change = connection.change;
                        change = (this.learningRate * delta * connection.from.output) + (this.momentum * change);
                        connection.change = change;
                        connection.weight += change;
                    }
                }
                neuron.bias += this.learningRate * delta;
            }
        }
    }

    logMinMax() {
        let minBias = Infinity;
        let maxBias = -Infinity;
        let minWeight = Infinity;
        let maxWeight = -Infinity;

        for (let layer of this.layers) {
            for (let neuron of layer.neurons) {
                minBias = Math.min(minBias, neuron.bias);
                maxBias = Math.max(maxBias, neuron.bias);
            }

            for (let connection of layer.connections) {
                minWeight = Math.min(minWeight, connection.weight);
                maxWeight = Math.max(maxWeight, connection.weight);
            }
        }

        console.log(`Min Bias: ${minBias}, Max Bias: ${maxBias}, Min Weight: ${minWeight}, Max Weight: ${maxWeight}`);
    }
}
