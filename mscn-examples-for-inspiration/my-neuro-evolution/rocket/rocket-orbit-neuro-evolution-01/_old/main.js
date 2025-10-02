"use strict";

// TODO:



let gaParams = {

    // Genetic algorithm parameters
    mutationRate : 0.0,   // Fraction of next generation created through asexual reproduction, ie. mutation.
    elitismRate : 0.05,  // Fraction of fittest individuals that will be copied to next generation.
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
        func : Ship.calculateFitness,
        params : {
            fitnessThreshold : 1e-2,
        },
        data : fullAdderData,
    },
    // Create an individual.
    individual : { 
        func : Ship.createInstance,
        params : {
            layers : [3, 3, 2],
            activation : {
                func : ActivationFunctions.sigmoidLike2,
                params : {
                    n : 1e-3,
                },
            },
        },
    },  
};

// Run genetic algorithm
let ga = new GeneticAlgorithm(gaParams);

