"use strict";

class Node {
    constructor() {
        this.inputLinks = []
        this.outputLinks = []
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
    addInputLink(link) {
        this.inputLinks.push(link)
    }
    addOutputLink(link) {
        this.outputLinks.push(link)
    }
}

class Link {
    constructor(from, to) {
        this.from = from
        this.to = to
        this.weight = 0
        this.init()
    }
    init() {
        this.weight = randomFloatBetween(-1, 1);
    }
}

class Layer {
    constructor(numNodes) {
        this.nodes = []
        this.init(numNodes)
    }
    init(numNodes) {
        for (var i = 0; i < numNodes; i++) {
            const node = new Node()
            this.nodes.push(node)
        }
    }
}

class Network {
    constructor(genome) {
        this.fitness = null;
        this.links = [];
        let numberOfLayers = [2, 2, 1];
        this.init(numberOfLayers);
        if (genome) {
            this.genome = genome;
        } else {
            let genome = this.createRandomGenome();
            this.genome = genome;
        }
        //Network.calculateFitness(this);
    }
    init(numberOfLayers) {
        this.createLayers(numberOfLayers);
        this.connectLayers();
    }
    static createInstance(genome) { 
        return new Network(genome);
    }
    static calculateFitness(nn) {

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

        nn.fitness = fitness/4;

        // // Test nn on XOR
        // let fitness = 0;
        // let numTries = 40;
        // let a, b, c, output;
        // for (var i = 0; i < numTries; i++) {
        //     a = randomIntBetween(0, 1);
        //     b = randomIntBetween(0, 1);
        //     c = a ^ b;
        //     //console.log(a, b, c);
        //     nn.setInput([a, b]);
        //     nn.run(sigmoid);
        //     output = nn.getOutput();
        //     //console.log(output);
        //     fitness += Math.abs(output[0] - c);
        //     //console.log(output);
        // }
        // fitness /= numTries;
        // nn.fitness = fitness;

        // if (fitness < 0.1) {
        //     console.log(a, b, c, output[0]);
        // }
    }
    createRandomGenome() {
        let genome = [];
        // Calculate number of links
        let numLinks = 0;
        for (var layer = 1; layer < this.layers.length; layer++) {
            const thisLayer = this.layers[layer]
            const prevLayer = this.layers[layer - 1]
            numLinks += prevLayer.nodes.length * thisLayer.nodes.length
        }
        // Calculate number of biases
        let numBiases = 0;
        for (var layer = 1; layer < this.layers.length; layer++) {
            const thisLayer = this.layers[layer]
            numBiases += thisLayer.nodes.length
        }

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
            for (var node = 0; node < prevLayer.nodes.length; node++) {
                for (var nodeInThisLayer = 0; nodeInThisLayer < thisLayer.nodes.length; nodeInThisLayer++) {
                    const link = new Link(prevLayer.nodes[node], thisLayer.nodes[nodeInThisLayer])
                    prevLayer.nodes[node].addOutputLink(link)
                    thisLayer.nodes[nodeInThisLayer].addInputLink(link)
                    this.links.push(link);
                }
            }
        }
    }
    setInput(values) {
        this.layers[0].nodes.forEach((node, i) => {
            node.output = values[i];
        })
    }
    getOutput() {
        return this.layers[this.layers.length - 1].nodes.map(node => node.output)
    }
    run(activationFunction = sigmoidLike) {
        for (var layer = 1; layer < this.layers.length; layer++) {
            const thisLayer = this.layers[layer]
            const prevLayer = this.layers[layer - 1]
            for (var node = 0; node < thisLayer.nodes.length; node++) {
                const thisNode = thisLayer.nodes[node]
                let sum = 0
                for (var nodeInPrevLayer = 0; nodeInPrevLayer < prevLayer.nodes.length; nodeInPrevLayer++) {
                    const prevNode = prevLayer.nodes[nodeInPrevLayer]
                    for (var link = 0; link < prevNode.outputLinks.length; link++) {
                        const thisLink = prevNode.outputLinks[link]
                        if (thisLink.to === thisNode) {
                            sum += prevNode.output * thisLink.weight
                        }
                    }
                }
                sum += thisNode.bias
                thisNode.input = sum
                thisNode.output = activationFunction(sum)
            }
        }
    }
    // Encode neural network, including all weights and biases, into a "genome" array of floats in the range [0, 1]
    encode() {
        let genome = [];
        for (var i = 0; i < this.links.length; i++) {
            genome.push(map(this.links[i].weight, -1, 1, 0, 1));
        }
        for (var i = 1; i < this.layers.length; i++) {
            for (var j = 0; j < this.layers[i].nodes.length; j++) {
                genome.push(map(this.layers[i].nodes[j].bias, -10, 10, 0, 1));
            }
        }
        return genome;
    }
    // Decode a "genome" array of floats in the range [0, 1] into a neural network, including all weights and biases
    decode(genome) {
        let genomeIndex = 0;
        for (var i = 0; i < this.links.length; i++) {
            this.links[i].weight = map(genome[genomeIndex], 0, 1, -1, 1);
            genomeIndex++;
        }
        for (var i = 1; i < this.layers.length; i++) {
            for (var j = 0; j < this.layers[i].nodes.length; j++) {
                this.layers[i].nodes[j].bias = map(genome[genomeIndex], 0, 1, -10, 10);
                genomeIndex++;
            }
        }
    }
}
