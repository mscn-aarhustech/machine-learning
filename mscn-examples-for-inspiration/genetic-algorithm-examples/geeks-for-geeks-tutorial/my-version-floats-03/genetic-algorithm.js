
class Individual {
    constructor(chromosome) {
        this.chromosome = chromosome;
        this.fitness = Infinity;
    }
}

class GeneticAlgorithm {
    constructor() {
        this.populationSize = 200;
        this.mutationRate = 0.01;
        this.elitismRate = 0.05;
        this.offspringRate = 1.0 - this.elitismRate;
        this.fittestMatingRate = 0.5;
        this.generation = 0;
        this.maxGenerations = 10000;
        this.fitnessThreshold = 0.001;
        this.isFinished = false;
        this.population = [];

        this.init();
    }
    init() {
        this.generation = 0;
        this.isFinished = false;
        this.population = [];
        this.elitismNum = Math.floor(this.populationSize * this.elitismRate);
        this.offspringNum = Math.floor(this.populationSize * this.offspringRate);
        this.fittestMatingNum = Math.floor(this.populationSize * this.fittestMatingRate);
    }
    createChromosome() {
        let chromosome = [];
        for(let i = 0; i < TARGET.length; i++) {
            let randomGene = randomFloat(TARGET_MIN, TARGET_MAX);
            chromosome.push(randomGene);
        }
        return chromosome;
    }
    initializePopulation() {
        for (let i = 0; i < this.populationSize; i++) {
            let chromosome = this.createChromosome();
            let individual = new Individual(chromosome);
            this.population.push(individual);
        }

        // Fitnnes calculation
        for(let i = 0; i < this.populationSize; i++) {
            let ind = this.population[i];
            ind.fitness = this.calculateFitness(ind);
        }

        // Sort population by fitness in ascending order 
        this.population.sort((indA, indB) => indA.fitness - indB.fitness);
    }
    step() {

        this.generation++;

        // Selection

        let nextPopulation = [];

        // Elitism
        for(let i = 0; i < this.elitismNum; i++) {
            nextPopulation.push(this.population[i]);
        }

        // Crossover
        for(let i = 0; i < this.offspringNum; i++) {
            let r1 = randomInt(0, this.fittestMatingNum);
            let r2 = randomInt(0, this.fittestMatingNum);
            let parent1 = this.population[r1];
            let parent2 = this.population[r2];
            let offspring = this.crossoverNumericalLerp(parent1, parent2);
            nextPopulation.push(offspring);
        }

        // Mutation
        for(let i = 0; i < this.offspringNum; i++) {
            let ind = nextPopulation[i];
            this.mutate(ind);
        }

        this.population = nextPopulation;

        // Fitnnes calculation
        for(let i = 0; i < this.offspringNum; i++) {
            let ind = this.population[i];
            //console.log(ind);
            ind.fitness = this.calculateFitness(ind);
        }

        // Sort population by fitness in ascending order 
        this.population.sort((indA, indB) => indA.fitness - indB.fitness);

    }
    run() {

        this.initializePopulation();

        while(!this.isFinished && this.generation < this.maxGenerations) {
            
            this.step();

            this.printResult();

            //this.terminate();
            if(this.population[0].fitness <= this.fitnessThreshold) {
                this.isFinished = true;
            }
        }
    }
    mutate(ind) {
        for(let i = 0; i < ind.chromosome.length; i++) {
            if(Math.random() < this.mutationRate)
                ind.chromosome[i] = randomFloat(TARGET_MIN, TARGET_MAX);
        }
    }
    calculateFitness(ind) {
        let fitness = 0;
        for(let i = 0; i < TARGET.length; i++) {
            fitness += Math.abs(ind.chromosome[i] - TARGET[i]);
        }
        return fitness;	 
    }
    crossoverNumericalLerp(parentA, parentB) {
        let childChromosome = [];
        for(let i = 0; i < parentA.chromosome.length; i++) {
            let gene = lerp(parentA.chromosome[i], parentB.chromosome[i], Math.random());
            childChromosome.push(gene);
        }
        return new Individual(childChromosome);
    }
    printResult() {
        console.log("Generation: " + this.generation + "\tSequence: " + this.population[0].chromosome + "\tFitness: " + this.population[0].fitness);
    }
}

const TARGET = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
const TARGET_MAX = 1; //Math.max(...TARGET);
const TARGET_MIN = 0; //Math.min(...TARGET);

// Run genetic algorithm
let ga = new GeneticAlgorithm();
ga.run();

// Helper functions

// Function to generate random numbers in given range 
function randomInt(start, end) {
    return Math.floor(Math.random() * (end - start + 1) + start);
}

function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}