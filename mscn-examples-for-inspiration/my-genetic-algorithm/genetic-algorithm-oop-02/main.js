"use strict";

// TODO:
// Write missing genetic functions. Done!
// Make implementation work with simple string example. Done!
// Refactor target string out of genetic algorithm. Done!
// Refactor termination and helper funcs out of genetic operator library. Done!
// Selection functions must work with (and make assumptions about) arrays of individual class instances. Done!

// Crossover and Mutation must work with arrays of genomes and not make assumptions about individual class.

// Make implementation work with population of nn's learning XOR.
// Refactor termination.
// Expand genetic operator library.
// Getter and setter functions for genetic algorithm parameters?
// Add encode / decode functions to genetic algorithm.
// Optimizations

let params = {

    // Genetic algorithm parameters
    mutationRate     : 0.00,  // Fraction of next generation created through asexual reproduction, ie. mutation.
    elitismRate      : 0.05,  // Fraction of fittest individuals that will be copied to next generation.
    matingRate       : 0.00,  // Fraction of fittest individuals allowed to mate (only used in truncation-based functions)
    mutationChance   : 0.01,  // Chance that a gene will mutate when passed through a mutation function.
    populationSize   : 250,   // Number of individuals in population.
    maxGenerations   : 2000,  // Maximum number of generations to run genetic algorithm.
    fitnessThreshold : 0.00,  // Terminate if fitness is equal to or below value (fitter individuals have lower values).

    // Genetic operators
    selectionFunc    : randomWayTournamentSelection, // Function used to select individuals for mating.
    crossoverFunc    : uniformCrossover,             // Function used to mate individuals.
    mutationFunc     : randomizeMutation,            // Function used to mutate an individual.

    // Genetic algorithm callbacks
    fitnessFunc      : Phrase.calculateFitness,      // Function used to calculate fitness of an individual.
    individualFunc   : Phrase.createInstance,        // Function used to create an individual.
};

let ga = new GeneticAlgorithm(params);

console.log(ga);

ga.run();
