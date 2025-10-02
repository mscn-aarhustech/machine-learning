"use strict";

class Neuron {
    constructor() {
        this.inputConnections = []
        this.outputConnections = []
        this.bias = 0
        this.n = 0;
        this.input = 0
        this.output = 0
        //this.init()
    }
    init() {
        this.bias = randomFloatBetween(-10, 10);
        this.n = randomFloatBetween(0, 2);
        this.input = 0
        this.output = 0
    }
    addInputConnection(connection) {
        this.inputConnections.push(connection)
    }
    addOutputConnection(connection) {
        this.outputConnections.push(connection)
    }
}

class Connection {
    constructor(from, to) {
        this.from = from
        this.to = to
        this.weight = 0
        //this.init()
    }
    init() {
        this.weight = randomFloatBetween(-10, 10);
    }
}

class Layer {
    constructor(numberOfNeurons) {
        this.neurons = []
        this.init(numberOfNeurons)
    }
    init(numberOfNeurons) {
        for (var i = 0; i < numberOfNeurons; i++) {
            const neuron = new Neuron()
            this.neurons.push(neuron)
        }
    }
}

class Network {
    constructor(genome = null, params = {}) {
        this.fitness = null;
        this.connections = [];
        this.params = params;
        //this.activation = params.activation;
        this.init(this.params.layers);
        if (genome) {
            this.genome = genome;
            this.decode(genome);
        } else {
            let genome = this.createRandomGenome();
            this.genome = genome;
            this.decode(genome);
        }

    }
    init(numberOfLayers) {
        this.createLayers(numberOfLayers);
        this.connectLayers();
    }
    static createInstance(genome, params) {
        return new Network(genome, params);
    }
    createRandomGenome() {
        let genome = [];
        // Calculate number of links
        let numLinks = 0;
        for (var layer = 1; layer < this.layers.length; layer++) {
            const thisLayer = this.layers[layer]
            const prevLayer = this.layers[layer - 1]
            numLinks += prevLayer.neurons.length * thisLayer.neurons.length
        }
        // Calculate number of biases
        let numBiases = 0;
        for (var layer = 1; layer < this.layers.length; layer++) {
            const thisLayer = this.layers[layer]
            numBiases += thisLayer.neurons.length
        }
        // Calculate number of ns
        let numNs = 0;
        for (var layer = 1; layer < this.layers.length; layer++) {
            const thisLayer = this.layers[layer]
            numNs += thisLayer.neurons.length;
        }
        // Calculate total number of genes
        let numGenes = numLinks + numBiases + numNs;

        // console.log("numLinks: ", numLinks);
        // console.log("numBiases: ", numBiases);
        // console.log("numNs: ", numNs);

        for (let i = 0; i < numGenes; i++) {
            let gene = Math.random();
            genome.push(gene);
        }
        return genome;
    }
    createLayers(numberOfLayers) {
        this.layers = numberOfLayers.map((length) => {
            const layer = new Layer(length)
            return layer
        })
    }
    connectLayers() {
        for (var layer = 1; layer < this.layers.length; layer++) {
            const thisLayer = this.layers[layer]
            const prevLayer = this.layers[layer - 1]
            for (var neuron = 0; neuron < prevLayer.neurons.length; neuron++) {
                for (var neuronInThisLayer = 0; neuronInThisLayer < thisLayer.neurons.length; neuronInThisLayer++) {
                    const connection = new Connection(prevLayer.neurons[neuron], thisLayer.neurons[neuronInThisLayer])
                    prevLayer.neurons[neuron].addOutputConnection(connection)
                    thisLayer.neurons[neuronInThisLayer].addInputConnection(connection)
                    this.connections.push(connection);
                }
            }
        }
    }
    setInput(values) {
        this.layers[0].neurons.forEach((neuron, i) => {
            neuron.output = values[i];
        })
    }
    getOutput() {
        return this.layers[this.layers.length - 1].neurons.map(neuron => neuron.output)
    }

    

    run() {
        //console.log("Neuron n values:");
        for (var layer = 1; layer < this.layers.length; layer++) {
            const thisLayer = this.layers[layer]
            const prevLayer = this.layers[layer - 1]
            for (var neuron = 0; neuron < thisLayer.neurons.length; neuron++) {
                const thisNeuron = thisLayer.neurons[neuron]
                let sum = 0
                for (var neuronInPrevLayer = 0; neuronInPrevLayer < prevLayer.neurons.length; neuronInPrevLayer++) {
                    const prevNeuron = prevLayer.neurons[neuronInPrevLayer]
                    for (var connection = 0; connection < prevNeuron.outputConnections.length; connection++) {
                        const thisConnection = prevNeuron.outputConnections[connection]
                        if (thisConnection.to === thisNeuron) {
                            sum += prevNeuron.output * thisConnection.weight
                        }
                    }
                }
                sum += thisNeuron.bias
                thisNeuron.input = sum
                //thisNeuron.output = this.params.activation.func(sum, this.params.activation.params);
                thisNeuron.output = this.params.activation.func(sum, {n : thisNeuron.n});

                //console.log(thisNeuron.n);
            }
        }
    }
    // Encode neural network, including all weights and biases, into a "chromosome" array of floats in the range [0, 1]
    encode() {
        let chromosome = [];
        for (var i = 0; i < this.connections.length; i++) {
            chromosome.push(map(this.connections[i].weight, -10, 10, 0, 1));
        }
        for (var i = 1; i < this.layers.length; i++) {
            for (var j = 0; j < this.layers[i].neurons.length; j++) {
                chromosome.push(map(this.layers[i].neurons[j].bias, -10, 10, 0, 1));
            }
        }
        for (var i = 1; i < this.layers.length; i++) {
            for (var j = 0; j < this.layers[i].neurons.length; j++) {
                chromosome.push(map(this.layers[i].neurons[j].n, 0, 2, 0, 1));
            }
        }
        return chromosome;
    }
    // Decode a "chromosome" array of floats in the range [0, 1] into a neural network, including all weights and biases
    decode(chromosome) {
        let chromosomeIndex = 0;
        for (var i = 0; i < this.connections.length; i++) {
            this.connections[i].weight = map(chromosome[chromosomeIndex], 0, 1, -10, 10);
            chromosomeIndex++;
        }
        for (var i = 1; i < this.layers.length; i++) {
            for (var j = 0; j < this.layers[i].neurons.length; j++) {
                this.layers[i].neurons[j].bias = map(chromosome[chromosomeIndex], 0, 1, -10, 10);
                chromosomeIndex++;
            }
        }
        for (var i = 1; i < this.layers.length; i++) {
            for (var j = 0; j < this.layers[i].neurons.length; j++) {
                this.layers[i].neurons[j].n = map(chromosome[chromosomeIndex], 0, 1, 0, 2);
                chromosomeIndex++;
            }
        }
    }
}