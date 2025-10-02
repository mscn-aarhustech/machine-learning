
class Neuron {
    constructor() {
        this.inputConnections = []
        this.outputConnections = []
        this.bias = 0
        this.input = 0
        this.output = 0
        this.init()
    }
    init() {
        this.bias = random(-2, 2);
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
        this.init()
    }
    init() {
        this.weight = random(-1, 1);
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

    constructor(numberOfLayers) {
        this.connections = [];
        this.init(numberOfLayers);
    }
    init(numberOfLayers) {
        this.createLayers(numberOfLayers);
        this.connectLayers();
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
                for(var neuronInThisLayer = 0; neuronInThisLayer < thisLayer.neurons.length; neuronInThisLayer++) {
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
    run(activationFunction = identity) {
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
                thisNeuron.output = activationFunction(sum)
            }
        }
    }
        // Encode neural network, including all weights and biases, into a "chromosome" array of floats in the range [0, 1]
        encode() {
            let chromosome = [];
            for (var i = 0; i < this.links.length; i++) {
                chromosome.push(map(this.links[i].weight, -1, 1, 0, 1));
            }
            for (var i = 1; i < this.layers.length; i++) {
                for (var j = 0; j < this.layers[i].nodes.length; j++) {
                    chromosome.push(map(this.layers[i].nodes[j].bias, -10, 10, 0, 1));
                }
            }
            return chromosome;
        }
    
        // Decode a "chromosome" array of floats in the range [0, 1] into a neural network, including all weights and biases
        decode(chromosome) {
            let chromosomeIndex = 0;
            for (var i = 0; i < this.links.length; i++) {
                this.links[i].weight = map(chromosome[chromosomeIndex], 0, 1, -1, 1);
                chromosomeIndex++;
            }
            for (var i = 1; i < this.layers.length; i++) {
                for (var j = 0; j < this.layers[i].nodes.length; j++) {
                    this.layers[i].nodes[j].bias = map(chromosome[chromosomeIndex], 0, 1, -10, 10);
                    chromosomeIndex++;
                }
            }
        }
}