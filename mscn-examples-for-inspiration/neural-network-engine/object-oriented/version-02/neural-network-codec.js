"use strict";

// The codec (coder-decoder) is responsible for encoding and decoding the neural network parameters into a genome (chromosome) and vice versa.
// This ensures separation of concerns and allows for easy swapping of encoding/decoding strategies.

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

class NeuralNetworkCodec {
    
    // Encode the network to a genome (chromosome)
    static encodeNetwork(network) {
        let chromosome = [];

        // Encode biases
        for (let i = 1; i < network.layers.length; i++) {
            for (let neuron of network.layers[i].neurons) {
                let normalizedBias = ToolBox.map(neuron.bias, network.params.bias.min, network.params.bias.max, 0, 1);
                chromosome.push(normalizedBias);
            }
        }

        // Encode weights
        for (let i = 0; i < network.layers.length - 1; i++) {
            for (let connection of network.layers[i].connections) {
                let normalizedWeight = ToolBox.map(connection.weight, network.params.weight.min, network.params.weight.max, 0, 1);
                chromosome.push(normalizedWeight);
            }
        }

        return chromosome;
    }

    // Decode the genome (chromosome) back into an existing network
    static decodeNetwork(network, chromosome) {
        let chromosomeIndex = 0;

        // Decode biases
        for (let i = 1; i < network.layers.length; i++) {
            for (let neuron of network.layers[i].neurons) {
                let denormalizedBias = ToolBox.map(chromosome[chromosomeIndex], 0, 1, network.params.bias.min, network.params.bias.max);
                neuron.bias = denormalizedBias;
                chromosomeIndex++;
            }
        }

        // Decode weights
        for (let i = 0; i < network.layers.length - 1; i++) {
            for (let connection of network.layers[i].connections) {
                let denormalizedWeight = ToolBox.map(chromosome[chromosomeIndex], 0, 1, network.params.weight.min, network.params.weight.max);
                connection.weight = denormalizedWeight;
                chromosomeIndex++;
            }
        }
    }

    // Decode a genome directly into a new network instance
    static decodeParams(params, chromosome) {
        let network = new Network(params);
        let chromosomeIndex = 0;

        // Decode biases
        for (let i = 1; i < network.layers.length; i++) {
            for (let neuron of network.layers[i].neurons) {
                let denormalizedBias = ToolBox.map(chromosome[chromosomeIndex], 0, 1, network.params.bias.min, network.params.bias.max);
                neuron.bias = denormalizedBias;
                chromosomeIndex++;
            }
        }

        // Decode weights
        for (let i = 0; i < network.layers.length - 1; i++) {
            for (let connection of network.layers[i].connections) {
                let denormalizedWeight = ToolBox.map(chromosome[chromosomeIndex], 0, 1, network.params.weight.min, network.params.weight.max);
                connection.weight = denormalizedWeight;
                chromosomeIndex++;
            }
        }

        return network;
    }

    // Function for generating a random genome (chromosome) based on the network parameters, with random values between 0 and 1
    static generateRandomGenome(params) {
        let chromosome = [];

        // Generate random biases
        for (let i = 1; i < params.layers.length; i++) {
            for (let j = 0; j < params.layers[i]; j++) {
                let randomBias = Math.random();
                chromosome.push(randomBias);
            }
        }

        // Generate random weights
        for (let i = 0; i < params.layers.length - 1; i++) {
            for (let j = 0; j < params.layers[i] * params.layers[i + 1]; j++) {
                let randomWeight = Math.random();
                chromosome.push(randomWeight);
            }
        }

        return chromosome;
    }

    // Function for generating a genome (chromosome) based on the network parameters, with all values set to the function input
    static generateUniformGenome(params, value) {
        let chromosome = [];

        // Generate uniform biases
        for (let i = 1; i < params.layers.length; i++) {
            for (let j = 0; j < params.layers[i]; j++) {
                chromosome.push(value);
            }
        }

        // Generate uniform weights
        for (let i = 0; i < params.layers.length - 1; i++) {
            for (let j = 0; j < params.layers[i] * params.layers[i + 1]; j++) {
                chromosome.push(value);
            }
        }

        return chromosome;
    }

}
