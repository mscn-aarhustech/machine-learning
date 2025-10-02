"use strict";

class GeneticAlgorithm {
    constructor(params = {}) {

        // If Json is passed, decode it and return a params object
        if (params instanceof Object) {
            this.params = params;
        } else {
            this.params = JSON.parse(params);
        }

        //
        this.init();
    }
    init() {

        //
        this.generation = 0;
        this.isFinished = false;
        this.population = [];
        this.elitismNum = Math.floor(this.params.populationSize * this.params.elitismRate);
        this.mutationNum = Math.floor(this.params.populationSize * this.params.mutationRate);
        this.offspringNum = Math.floor(this.params.populationSize - (this.elitismNum + this.mutationNum));

        // TODO: Check if all functions are defined, and return error message if not
    }
    createPopulation() {
        for (let i = 0; i < this.params.populationSize; i++) {
            let individual = this.params.individual.func(null, this.params.individual.params);
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
            let individualGenes = this.params.selection.func(this.population, this.params.selection.params);
            this.params.mutation.func(individualGenes, this.params.mutation.params);
            for (let j = 0; j < individualGenes.length; j++) {
                let individual = this.params.individual.func(individualGenes[j], this.params.individual.params);
                nextPopulation.push(individual);
            }
        }

        // Sexual reproduction (crossover)
        //for (let i = 0; i < this.offspringNum; i++) {
        while (nextPopulation.length < this.params.populationSize) {
            let parentGenes = this.params.selection.func(this.population, this.params.selection.params);
            let offspringGenes = this.params.crossover.func(parentGenes, this.params.crossover.params);
            this.params.mutation.func(offspringGenes, this.params.mutation.params);
            for (let j = 0; j < offspringGenes.length; j++) {
                let offspring = this.params.individual.func(offspringGenes[j], this.params.individual.params);
                if (nextPopulation.length < this.params.populationSize) {
                    nextPopulation.push(offspring);
                } else {
                    break;
                }
            }
        }

        this.population = nextPopulation;

        this.calculateFitness();
        this.sortByFitness();
    }

    run() {

        this.createPopulation();
        this.calculateFitness();
        this.sortByFitness();

        while (!this.isFinished) {
            this.step();
            this.printResult();

            // TODO: Refactor termination function
            if (this.population[0].fitness <= this.params.fitness.params.fitnessThreshold || this.generation >= this.params.maxGenerations) {
                this.isFinished = true;
            }
        }

        // TODO: Encapsulate in an outputResult function
        console.log("Finished!");

        let nn = this.population[0];
        for (let i = 0; i < this.params.fitness.data.inputs.length; i++) {
            nn.setInput(this.params.fitness.data.inputs[i]);
            nn.run();
            let output = nn.getOutput();
            console.log("Input: " + this.params.fitness.data.inputs[i] + " - " + "Desired output: " + this.params.fitness.data.outputs[i] + " - " + "actual output: " + output);
        }
        console.log(this.population[0]);

        // XOR
        // nn.setInput([0, 0]);
        // nn.run();
        // let output = nn.getOutput();
        // console.log("Input: [0, 0] - " + "Desired output: " + "0 - " + "actual output: " + output);
        // nn.setInput([0, 1]);
        // nn.run();
        // output = nn.getOutput();
        // console.log("Input: [0, 1] - " + "Desired output: " + "1 - " + "actual output: " + output);
        // nn.setInput([1, 0]);
        // nn.run();
        // output = nn.getOutput();
        // console.log("Input: [1, 0] - " + "Desired output: " + "1 - " + "actual output: " + output);
        // nn.setInput([1, 1]);
        // nn.run();
        // output = nn.getOutput();
        // console.log("Input: [1, 1] - " + "Desired output: " + "0 - " + "actual output: " + output);
        //console.log(this.population[0]);
    }

    calculateFitness() {
        //console.log(this.params.fitness.data);
        for (let i = 0; i < this.population.length; i++) {
            this.params.fitness.func(this.population[i], this.params.fitness.params, this.params.fitness.data);
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