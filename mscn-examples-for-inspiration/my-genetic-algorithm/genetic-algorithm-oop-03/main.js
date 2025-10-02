"use strict";

// TODO:
// Write missing genetic functions. Done!
// Make implementation work with simple string example. Done!
// Refactor target string out of genetic algorithm. Done!
// Refactor termination and helper funcs out of genetic operator library. Done!
// Selection functions must work with (and make assumptions about) arrays of individual class instances. Done!
// Make implementation work with population of nn's learning XOR. Done!

// Crossover and Mutation must work with arrays of genomes and not make assumptions about individual class.

// Make implementation work with population of nn's learning Tic-Tac-Toe.
// Genetic operators are passed as objects containing function and parameters.
// All genetic operators must take object as parameter?
// Refactor termination.
// Expand genetic operator library.
// Getter and setter functions for genetic algorithm parameters?
// Add encode / decode functions to genetic algorithm itself.
// Optimize?

let gaParams = {

    // Genetic algorithm parameters
    mutationRate     : 0.0,   // Fraction of next generation created through asexual reproduction, ie. mutation.
    elitismRate      : 0.05,  // Fraction of fittest individuals that will be copied to next generation.
    matingRate       : 0.0,   // Fraction of fittest individuals allowed to mate (only used in truncation-based functions)
    mutationChance   : 0.01,  // Chance that a gene will mutate when passed through a mutation function.
    populationSize   : 200,   // Number of individuals in population.
    maxGenerations   : 1000,  // Maximum number of generations to run genetic algorithm.
    fitnessThreshold : 1e-9,  // Terminate if fitness is equal to or below value (fitter individuals have lower values).

    // Genetic operators
    selectionFunc    : randomWayTournamentSelection, // Function used to select individuals for mating.
    crossoverFunc    : wholeArithmeticRecombination, // Function used to mate individuals.
    mutationFunc     : randomizeMutation,            // Function used to mutate an individual.

    // Genetic algorithm callbacks
    fitnessFunc      : Network.calculateFitness,      // Function used to calculate fitness of an individual.
    individualFunc   : Network.createInstance,        // Function used to create an individual.
};

let nnParams = {
    layers: [2, 2, 1],
    activationFuncton: {
        func: sigmoidLike2,
        params: {
            n: 0.0001,
        },
    }
};

let nnData = {
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


// Run genetic algorithm
let ga = new GeneticAlgorithm(gaParams);

ga.run();
