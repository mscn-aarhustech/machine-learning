"use strict";

class GeneticAlgorithm {
    constructor(params) {

        // Genetic algorithm parameters
        this.mutationRate = params.mutationRate;
        this.elitismRate = params.elitismRate;
        this.matingRate = params.matingRate;
        this.mutationChance = params.mutationChance;
        this.populationSize = params.populationSize;
        this.maxGenerations = params.maxGenerations;
        this.fitnessThreshold = params.fitnessThreshold;

        // Genetic operators
        this.mutationFunc = params.mutationFunc;
        this.selectionFunc = params.selectionFunc;
        this.crossoverFunc = params.crossoverFunc;

        // Genetic algorithm callbacks
        this.fitnessFunc = params.fitnessFunc;
        this.individualFunc = params.individualFunc;

        //
        this.init();
    }
    init() {

        //
        this.generation = 0;
        this.isFinished = false;
        this.population = [];
        this.elitismNum = Math.floor(this.populationSize * this.elitismRate);
        this.mutationNum = Math.floor(this.populationSize * this.mutationRate);
        this.offspringNum = Math.floor(this.populationSize - (this.elitismNum + this.mutationNum));
        this.matingNum = Math.floor(this.populationSize * this.matingRate);

        // Check if all functions are defined, and return error message if not
    }
    createPopulation() {
        for (let i = 0; i < this.populationSize; i++) {
            let individual = this.individualFunc();
            this.population.push(individual);
        }
    }

    step() {
        this.generation++;
        let nextPopulation = [];

        // Elitism (copy fittest individuals)
        for (let i = 0; i < this.elitismNum; i++) {
            nextPopulation.push(this.population[i]);
        }

        // Asexual reproduction (mutation)
        for (let i = 0; i < this.mutationNum; i++) {
            let individualGenes = this.selectionFunc(this.population, 1, 4);
            this.mutationFunc(individualGenes);
            for (let j = 0; j < individualGenes.length; j++) {
                let individual = this.individualFunc(individualGenes[j]);
                nextPopulation.push(individual);
            }
        }

        // Sexual reproduction (crossover)
        for (let i = 0; i < this.offspringNum; i++) {
            let parentGenes = this.selectionFunc(this.population, 2, 4);
            let offspringGenes = this.crossoverFunc(parentGenes, 1);
            this.mutationFunc(offspringGenes, this.mutationChance);
            for (let j = 0; j < offspringGenes.length; j++) {
                let offspring = this.individualFunc(offspringGenes[j]);
                nextPopulation.push(offspring);
            }
        }

        this.population = nextPopulation;

        this.calculateFitness(this.population);
        this.sortByFitness();
    }

    run() {

        this.createPopulation();
        this.calculateFitness(this.population);
        this.sortByFitness();

        while (!this.isFinished) {
            this.step();
            this.printResult();

            // TODO: Refactor termination function
            if (this.population[0].fitness <= this.fitnessThreshold || this.generation >= this.maxGenerations) {
                this.isFinished = true;
            }
        }

        console.log("Finished!");

        let nn = this.population[0]
        let activationFunction = sigmoidLike2; //heaviside;

        // Sqrt
        // let numTries = 10;
        // for (var i = 0; i < numTries; i++) {
        //     let a = randomFloatBetween(0, 1);
        //     let c = Math.sqrt(a);
        //     nn.setInput([a]);
        //     nn.run(sigmoidLike2);
        //     let output = nn.getOutput();
        //     console.log("Input: " + a + " - Desired output: " + c + " - actual output: " + output[0]);
        // }

        // XOR
        nn.setInput([0, 0]);
        nn.run(activationFunction);
        let output = nn.getOutput();
        console.log("Input: [0, 0] - " + "Desired output: " + "0 - " + "actual output: " + output);
        nn.setInput([0, 1]);
        nn.run(activationFunction);
        output = nn.getOutput();
        console.log("Input: [0, 1] - " + "Desired output: " + "1 - " + "actual output: " + output);
        nn.setInput([1, 0]);
        nn.run(activationFunction);
        output = nn.getOutput();
        console.log("Input: [1, 0] - " + "Desired output: " + "1 - " + "actual output: " + output);
        nn.setInput([1, 1]);
        nn.run(activationFunction);
        output = nn.getOutput();
        console.log("Input: [1, 1] - " + "Desired output: " + "0 - " + "actual output: " + output);

        console.log(this.population[0]);
    }

    calculateFitness(population = []) {
        for (let i = 0; i < population.length; i++) {
            this.fitnessFunc(population[i]);
        }
    }

    normalizeFitness(population = []) {
        // Normalize fitness so sum of all values is 1
        let totalFitness = 0;
        for (let individual of population) {
            totalFitness += individual.fitness;
        }
        for (let individual of population) {
            individual.fitness /= totalFitness;
        }
    }

    sortByFitness() {
        this.population.sort((a, b) => a.fitness - b.fitness);
    }

    printResult() {
        console.log("Generation: " + this.generation + " - Fitness: " + this.population[0].fitness);
    }
}