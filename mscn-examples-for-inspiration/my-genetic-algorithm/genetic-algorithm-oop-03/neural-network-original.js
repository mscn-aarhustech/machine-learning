
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
        this.bias = randomFloatBetween(-10, 10);
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
    constructor(genome) {
        this.fitness = null;
        this.connections = [];
        let numberOfLayers = [2, 2, 1];
        this.init(numberOfLayers);
        if (genome) {
            this.genome = genome;
            this.decode(genome);
        } else {
            let genome = this.createRandomGenome();
            this.genome = genome;
            this.decode(genome);
        }
        Network.calculateFitness(this);
    }
    init(numberOfLayers) {
        this.createLayers(numberOfLayers);
        this.connectLayers();
    }
    static createInstance(genome) { 
        return new Network(genome);
    }
    static calculateFitness(nn) {
        
        // Sqrt
        // let fitness = 0;
        // let numTries = 10;
        // for (var i = 0; i < numTries; i++) {
        //     let a = randomFloatBetween(0, 1);
        //     let c = Math.sqrt(a);
        //     nn.setInput([a]);
        //     nn.run(sigmoidLike2);
        //     let output = nn.getOutput();
        //     //console.log("Input: " + a + " - Desired output: " + c + " - actual output: " + output[0]);
        //     fitness += Math.abs(output[0] - c);
        // }
        // fitness /= numTries;
        // nn.fitness = fitness;
        
        // XOR
        // Bad fitness function!!!
        // let numTries = 10;
        // let a, b, c, output;
        // for (var i = 0; i < numTries; i++) {
        //     a = randomIntBetween(0, 1);
        //     b = randomIntBetween(0, 1);
        //     c = a ^ b;
        //     nn.setInput([a, b]);
        //     nn.run(sigmoidLike2);
        //     output = nn.getOutput();
        //     fitness += Math.abs(output[0] - c);
        // }
        // fitness /= numTries;
        // nn.fitness = fitness;

        // if (fitness < 0.01) {
        //     console.log(a, b, c, output[0]);
        // }

        // XOR
        // Excellent fitness function!!!
        let fitness = 0;
        let activationFunction = sigmoidLike2;
        nn.setInput([0, 0]);
        nn.run(activationFunction);
        let output = nn.getOutput();
        fitness += Math.abs(output[0] - 0);
        nn.setInput([0, 1]);
        nn.run(activationFunction);
        output = nn.getOutput();
        fitness += Math.abs(output[0] - 1);
        nn.setInput([1, 0]);
        nn.run(activationFunction);
        output = nn.getOutput();
        fitness += Math.abs(output[0] - 1);
        nn.setInput([1, 1]);
        nn.run(activationFunction);
        output = nn.getOutput();
        fitness += Math.abs(output[0] - 0);
        // Normalize fitness. A random output (50/50 right and wrong) equals 0.5.
        nn.fitness = fitness/4;
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
        //console.log(numLinks);
        // Calculate number of biases
        let numBiases = 0;
        for (var layer = 1; layer < this.layers.length; layer++) {
            const thisLayer = this.layers[layer]
            numBiases += thisLayer.neurons.length
        }
        //console.log(numBiases);
        let numGenes = numLinks + numBiases;

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
        for (var i = 0; i < this.connections.length; i++) {
            chromosome.push(map(this.connections[i].weight, -10, 10, 0, 1));
        }
        for (var i = 1; i < this.layers.length; i++) {
            for (var j = 0; j < this.layers[i].neurons.length; j++) {
                chromosome.push(map(this.layers[i].neurons[j].bias, -10, 10, 0, 1));
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
    }
}