"use strict";

class Individual {
    constructor(genome = [], fitness = null) {
        this.genome = genome;
        this.fitness = fitness;
    }
}

class GeneticAlgorithm {
    constructor(params = {}) {

        this.params = params;

        this.generation = 0;
    }
    step(population) {

        this.elitismNum = Math.floor(population.length * this.params.elitismRate);
        this.gemmationNum = Math.floor(population.length * this.params.gemmationRate);
        this.offspringNum = Math.floor(population.length - (this.elitismNum + this.gemmationNum));
        
        //console.log("Population: ", population);

        this.generation++;
        let nextPopulation = [];

        // Verify population
        let valid = population.every((individual) => {
            return individual instanceof Individual;
        });

        if (!valid) {
            throw new Error("Population must be an array of Individual class instances.");
        }

        // Sort population by fitness (ascending)
        population.sort((a, b) => a.fitness - b.fitness);

        //console.log("Population after sort: ", population);


        // Elitism (Cloning) without mutation
        for (let i = 0; i < this.elitismNum; i++) {
            nextPopulation.push(population[i]);
        }

        //console.log("nextPopulation after Elitism: ", nextPopulation);

        // Asexual reproduction (Gemmation) with mutation 
        for (let i = 0; i < this.gemmationNum; i++) {
            let individualGenes = this.params.selection.func(population, this.params.selection.params);
            this.params.mutation.func(individualGenes, this.params.mutation.params);
            for (let j = 0; j < individualGenes.length; j++) {
                //let individual = this.params.individual.func(individualGenes[j], this.params.individual.params);
                let individual = new Individual(individualGenes[j]);
                nextPopulation.push(individual);
            }
        }

        //console.log("nextPopulation after Gemmation: ", nextPopulation);

        // Sexual reproduction (Crossover) with mutation 
        //for (let i = 0; i < this.offspringNum; i++) {
        while (nextPopulation.length < population.length) {
            let parentGenes = this.params.selection.func(population, this.params.selection.params);
            let offspringGenes = this.params.crossover.func(parentGenes, this.params.crossover.params);
            this.params.mutation.func(offspringGenes, this.params.mutation.params);
            for (let j = 0; j < offspringGenes.length; j++) {
                let offspring = new Individual(offspringGenes[j]);
                if (nextPopulation.length < population.length) {
                    nextPopulation.push(offspring);
                } else {
                    break;
                }
            }
        }

        //console.log("nextPopulation after Crossover: ", nextPopulation);

        //population = nextPopulation;
        return nextPopulation;
    }
}