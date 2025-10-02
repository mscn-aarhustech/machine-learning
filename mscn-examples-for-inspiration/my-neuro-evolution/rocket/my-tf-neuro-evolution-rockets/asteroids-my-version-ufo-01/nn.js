//

// Math functions
function sigmoid(z) {
    return 1 / (1 + Math.exp(-z));
  }

function uid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

// Classes
class Neuron {
    constructor() {
      this.inputConnections = []
      this.outputConnections = []
      this.bias = 0
      // delta is used to store a percentage of change in the weight
      this.delta = 0
      this.output = 0
      this.error = 0
      this.id = uid()
    }
  
    toJSON() {
      return {
        id: this.id,
        delta: this.delta,
        output: this.output,
        error: this.error,
        bias: this.bias,
        inputConnections: this.inputConnections.map(i => i.toJSON()),
        outputConnections: this.outputConnections.map(i => i.toJSON())
      }
    }
  
    getRandomBias() {
      const min = -3;
      const max = 3
      return Math.floor(Math.random() * (+max - +min)) +min; 
    }
  
    addInputConnection(connection) {
      this.inputConnections.push(connection)
    }
  
    addOutputConnection(connection) {
      this.outputConnections.push(connection)
    }
  
    setBias(val) {
      this.bias = val
    }
  
    setOutput(val) {
      this.output = val
    }
  
    setDelta(val) {
      this.delta = val
    }
  
    setError(val) {
      this.error = val
    }
}
  

class Connection {
    constructor(from, to) {
        this.from = from
        this.to = to
        this.weight = Math.random()
        this.change = 0
    }

    toJSON() {
        return {
        change: this.change,
        weight: this.weight,
        from: this.from.id,
        to: this.to.id
        }
    }

    setWeight(w) {
        this.weight = w
    }

    setChange(val) {
        this.change = val
    }
}

class Layer {
    constructor(numberOfNeurons) {
      const neurons = []
      for (var j = 0; j < numberOfNeurons; j++) {
        // const value = Math.random()
        const neuron = new Neuron()
    
        // Neurons in other than initial layer have a bias value
        
        neurons.push(neuron)
      }
      
      this.neurons = neurons
    }
  
    toJSON() {
      return this.neurons.map(n => {
        return n.toJSON()
      })
    }
  }

class Network {
    constructor(numberOfLayers) {
      this.layers = numberOfLayers.map((length, index) => {
        const layer = new Layer(length) 
        if (index !== 0 ) {
          layer.neurons.forEach(neuron => {
            neuron.setBias(neuron.getRandomBias())
          })
        }
        return layer
      })
      this.learningRate = 0.3  // multiply's against the input and the delta then adds to momentum
      this.momentum =  0.1       // multiply's against the specified "change" then adds to learning rate for change
      this.iterations = 0
      this.connectLayers()
    }
  
    toJSON() {
      return {
        learningRate: this.learningRate,
        iterations: this.iterations,
        layers: this.layers.map(l => l.toJSON())
      }
    }
  
    setLearningRate(value) {
      this.learningRate = value
    }
  
    setIterations(val) {
      this.iterations = val
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
          }
        }
      }
    }
  
    // When training we will run this set of functions each time
    train(input, output) {
      this.activate(input)
  
      // Forward propagate
      this.runInputSigmoid()
  
      // backpropagate
      this.calculateDeltasSigmoid(output)
      this.adjustWeights()
      // console.log(this.layers.map(l => l.toJSON()))
      this.setIterations(this.iterations + 1)
    }
  
    activate(values) {
      this.layers[0].neurons.forEach((n, i) => {
        n.setOutput(values[i])
      })
    }
  
    run() {
      // For now we only use sigmoid function
      return this.runInputSigmoid()
    }
  
    runInputSigmoid() {
      for (var layer = 1; layer < this.layers.length; layer++) {
        for (var neuron = 0; neuron < this.layers[layer].neurons.length; neuron++) {
          const bias = this.layers[layer].neurons[neuron].bias
          // For each neuron in this layer we compute its output value
  
          const connectionsValue = this.layers[layer].neurons[neuron].inputConnections.reduce((prev, conn)  => {
            const val = conn.weight * conn.from.output
            return prev + val
          }, 0) 
  
          this.layers[layer].neurons[neuron].setOutput(sigmoid(bias + connectionsValue))
        }
      }
  
      return this.layers[this.layers.length - 1].neurons.map(n => n.output)
    }
  
    calculateDeltasSigmoid(target) {
      for (let layer = this.layers.length - 1; layer >= 0; layer--) {
        const currentLayer = this.layers[layer]
  
        for (let neuron = 0; neuron < currentLayer.neurons.length; neuron++) {
          const currentNeuron = currentLayer.neurons[neuron]
          let output = currentNeuron.output;
  
          let error = 0;
          if (layer === this.layers.length -1 ) {
            // Is output layer
            error = target[neuron] - output;
            // console.log('calculate delta, error, last layer', error)
          }
          else {
            // Other than output layer
            for (let k = 0; k < currentNeuron.outputConnections.length; k++) {
              const currentConnection = currentNeuron.outputConnections[k]
              error += currentConnection.to.delta * currentConnection.weight
              // console.log('calculate delta, error, inner layer', error)
            }
  
  
          }
          currentNeuron.setError(error)
          currentNeuron.setDelta(error * output * (1 - output))
        }
      }
    }
  
    adjustWeights() {
      
      for (let layer = 1; layer <= this.layers.length -1; layer++) {
        const prevLayer = this.layers[layer - 1]
        const currentLayer = this.layers[layer]
  
        for (let neuron = 0; neuron < currentLayer.neurons.length; neuron++) {
           const currentNeuron = currentLayer.neurons[neuron]
           let delta = currentNeuron.delta
           
          for (let i = 0; i < currentNeuron.inputConnections.length; i++) {
            const currentConnection = currentNeuron.inputConnections[i]
            let change = currentConnection.change
           
            change = (this.learningRate * delta * currentConnection.from.output)
                + (this.momentum * change);
            
            currentConnection.setChange(change)
            currentConnection.setWeight(currentConnection.weight + change)
          }
  
          currentNeuron.setBias(currentNeuron.bias + (this.learningRate * delta))
         
        }
      }
    }
  
  }
  

// Script
// Define the layer structure
// const layers = [
//     2, // This is the input layer
//     10, // Hidden layer 1
//     10, // Hidden layer 2
//     1 // Output
//   ]

  // const layers = [
  //   2, // This is the input layer
  //   2, // Hidden layer 1
  //   1 // Output
  // ]
  
  // const network = new Network(layers)
  
  // // Start training
  // const numberOfIterations = 100000
  
  // // Training data for a "XOR" logic gate
  // const trainingData = [{
  //   input : [0,0],
  //   output: [0]
  // }, {
  //   input : [0,1],
  //   output: [0]
  // }, {
  //   input : [1,0],
  //   output: [0]
  // }, {
  //   input : [1,1],
  //   output: [1]
  // }]
  
  // for(var i = 0; i < numberOfIterations; i ++) {
  //   // Get a random training sample
  //   const trainingItem = trainingData[Math.floor((Math.random()*trainingData.length))]
  //   network.train(trainingItem.input, trainingItem.output);
  // }
  
  // // After training we can see if it works
  // // we call activate to set a input in the first layer
  // network.activate(trainingData[0].input)
  // const resultA = network.run()
  
  // network.activate(trainingData[1].input)
  // const resultB = network.run()
  
  // network.activate(trainingData[2].input)
  // const resultC = network.run()
  
  // network.activate(trainingData[3].input)
  // const resultD = network.run()
  // console.log('Expected ' + trainingData[0].output[0] + ' got ' + resultA[0])
  // console.log('Expected ' + trainingData[1].output[0] + ' got ' + resultB[0])
  // console.log('Expected ' + trainingData[2].output[0] + ' got ' + resultC[0])
  // console.log('Expected ' + trainingData[3].output[0] + ' got ' + resultD[0])