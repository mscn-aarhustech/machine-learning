"use strict";

// TODO:
// Write missing genetic functions. Done!
// Make implementation work with simple string example. Done!
// Refactor target string out of genetic algorithm. Done!
// Refactor termination and helper funcs out of genetic operator library. Done!
// Selection functions must work with (and make assumptions about) arrays of individual class instances. Done!
// Make implementation work with population of nn's learning XOR. Done!
// Genetic operators are passed as objects containing function and parameters. Done!

// Crossover and Mutation work with arrays of genomes, not individual class instances.

// Make implementation work with population of nn's learning Tic-Tac-Toe.
// Function to validate all params and provide meaningful errors before run.
// Add diversifying function, that add genomes filling out holes with missing genome values in the population.
// Add selection based on mutual "attraction" betweeen the most different genomes, to avoid "inbreeding" premature convergence.
// Add fromJson and toJson functions to genetic algorithm and neural network.
// Add OutputResult function to genetic algorithm.
// Refactor termination.
// Expand genetic operator library.
// Getter and setter functions for genetic algorithm parameters?
// Add encode / decode functions to genetic algorithm itself.
// Optimize?


// AND gate data
let andData = {
    inputs: [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
    ],
    outputs: [
        [0],
        [0],
        [0],
        [1],
    ],
};

// OR gate data
let orData = {
    inputs: [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
    ],
    outputs: [
        [0],
        [1],
        [1],
        [1],
    ],
};

//NOT gate data
let notData = {
    inputs: [
        [0],
        [1],
    ],
    outputs: [
        [1],
        [0],
    ],
};


// XOR gate data
let xorData = {
    inputs: [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
    ],
    outputs: [
        [0],
        [1],
        [1],
        [0],
    ],
};

// Full adder data
let fullAdderData = {
    inputs: [
        [0, 0, 0],
        [0, 0, 1],
        [0, 1, 0],
        [0, 1, 1],
        [1, 0, 0],
        [1, 0, 1],
        [1, 1, 0],
        [1, 1, 1],
    ],
    outputs: [
        [0, 0],
        [0, 1],
        [0, 1],
        [1, 0],
        [0, 1],
        [1, 0],
        [1, 0],
        [1, 1],
    ],
};

let gaParams = {

    // Genetic algorithm parameters
    mutationRate : 0.0,   // Fraction of next generation created through asexual reproduction, ie. mutation.
    elitismRate : 0.1,  // Fraction of fittest individuals that will be copied to next generation.
    populationSize : 250,   // Number of individuals in population.
    maxGenerations : 1000,  // Maximum number of generations to run genetic algorithm.

    // Genetic operators
    // Select individuals for mating.
    selection : {
        func : GenOps.randomWayTournamentSelection,
        params : {
            numParents : 2,
            maxContestants : 4,
        },
    }, 
    // Mate individuals.
    crossover : {
        func : GenOps.wholeArithmeticRecombination, //GenOps.uniformCrossover,
        params : {
            numChildren : 1,
        },
    }, 
    // Mutate individuals.
    mutation : {
        func : GenOps.randomizeMutation,
        params : {
            mutationChance : 0.05, 
            minValue : 0, 
            maxValue : 1
        },
    },

    // Individual specific functions and their params.
    // Calculate fitness of an individual.
    fitness : {
        func : Network.calculateFitness,
        params : {
            fitnessThreshold : 1e-10,
        },
        data : fullAdderData,
    },
    // Create an individual.
    individual : { 
        func : Network.createInstance,
        params : {
            layers : [3, 3, 2],
            activation : {
                //func : ActivationFunctions.sigmoidLike2,
                func : ActivationFunctions.heaviside,
                params : {
                    n : 0, //   1e-100,
                },
            },
        },
    },  
};


//let gaParamsJson = JSON.stringify(gaParams, null, 2);

//console.log(gaParamsJson);

// Run genetic algorithm
let ga = new GeneticAlgorithm(gaParams);

ga.run();
