
// n-way Tournament parent selection
// Roulette wheel parent selection
// Float [0, 1] genetic encoding / decoding


class Individual {
    constructor(chromosome) {
        this.chromosome = chromosome;
        this.fitness = Infinity;
    }
    calculateFitness() {
        let fitness = 0;
        for(let i = 0; i < this.chromosome.length; i++) {
            fitness += Math.abs(this.chromosome[i] - TARGET[i]);
        }
        this.fitness = fitness;
    }
}

class GeneticAlgorithm {
    constructor(params) {
        this.populationSize = params.populationSize;
        this.mutationRate = params.mutationRate;
        this.elitismRate = params.elitismRate;
        this.fittestMatingRate = params.fittestMatingRate;
        this.maxGenerations = params.maxGenerations;
        this.fitnessThreshold = params.fitnessThreshold;

        this.init();
    }
    init() {
        this.generation = 0;
        this.isFinished = false;
        this.population = [];
        this.offspringRate = 1.0 - this.elitismRate;
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
    }
    step() {

        this.generation++;

        let nextPopulation = [];

        // Elitism
        for(let i = 0; i < this.elitismNum; i++) {
            nextPopulation.push(this.population[i]);
        }

        // Parent selection, Crossover, and Mutation
        for(let i = 0; i < this.offspringNum; i++) {
            let parents = this.nWayTournamentSelection(this.population, 2);
            let offspring = this.crossoverNumericalLerp(parents[0], parents[1]); 
            this.mutate(offspring);
            nextPopulation.push(offspring);
        }

        this.population = nextPopulation;

        this.calculateFitness();
        this.sortByFitness();
    }
    run() {
        this.initializePopulation();
        this.calculateFitness();
        this.sortByFitness();

        while(this.isFinished == false && this.generation < this.maxGenerations) {
            this.step();
            this.printResult();
            this.terminate();
        }
    }
    // Crossover
    crossoverNumericalLerp(parentA, parentB) {
        let childChromosome = [];
        for(let i = 0; i < parentA.chromosome.length; i++) {
            let gene = lerp(parentA.chromosome[i], parentB.chromosome[i], Math.random());
            childChromosome.push(gene);
        }
        return new Individual(childChromosome);
    }
    // Parent selection
    truncationSelection(population, numParents=2) {
        let parents = [];
        for (let i = 0; i < numParents; i++) {
            let r = randomInt(0, this.fittestMatingNum);
            let individual = population[r];
            parents.push(individual);
        }
        return parents;
    }
    rouletteWheelSelection(population, numParents=2) {
        let totalFitness = 0;
        for (let individual of population) {
            totalFitness += individual.fitness;
        }
      
        let randomFitness = Math.random() * totalFitness;
        let cumulativeFitness = 0;
        let parents = [];
        for (let i = 0; i < numParents; i++) {
            for (let individual of population) {
                cumulativeFitness += individual.fitness;
                if (randomFitness <= cumulativeFitness) {
                    parents.push(individual);
                }
            }
            
        }
        return parents;
    }
    stochasticUniversalSampling(population, numParents=2) {
        // Calculate the total fitness of the population
        let totalFitness = 0;
        for (let individual of population) {
            totalFitness += individual.fitness;
        }
    
        // Calculate the distance between the pointers
        let pointerDistance = totalFitness / numParents;
    
        // Choose a random number between 0 and the pointer distance as the start point
        let startPoint = Math.random() * pointerDistance;
    
        // Generate pointers at evenly spaced intervals starting from the start point
        let pointers = Array.from({length: numParents}, (_, i) => startPoint + i * pointerDistance);
    
        let parents = [];
        for (let pointer of pointers) {
            let cumulativeSum = 0;
            for (let i = 0; i < population.length; i++) {
                cumulativeSum += population[i].fitness;
                if (cumulativeSum >= pointer) {
                    parents.push(population[i]);
                    break;
                }
            }
        }
        return parents;
    }
    nWayTournamentSelection(population, numParents=2, tournamentSize=2) {
        let parents = [];
        for (let i = 0; i < numParents; i++) {
            let tournament = [];
            for (let j = 0; j < tournamentSize; j++) {
                var randomIndex = Math.floor(Math.random() * population.length);
                tournament.push(population[randomIndex]);
            }
            tournament.sort((a, b) => a.fitness - b.fitness);
            parents.push(tournament[0]);
        }
        return parents;
    }
    // Mutation
    mutate(ind) {
        for(let i = 0; i < ind.chromosome.length; i++) {
            if(Math.random() < this.mutationRate)
                ind.chromosome[i] = randomFloat(TARGET_MIN, TARGET_MAX);
        }
    }
    // Misc
    printResult() {
        console.log("Generation: " + this.generation + "\tSequence: " + this.population[0].chromosome + "\tFitness: " + this.population[0].fitness);
    }
    terminate() {
        if(this.population[0].fitness <= this.fitnessThreshold) {
            this.isFinished = true;
        }
    }
    calculateFitness() {
        for(let i = 0; i < this.populationSize; i++) {
            this.population[i].calculateFitness();
        }
    }
    sortByFitness() {
        this.population.sort((a, b) => a.fitness - b.fitness);
    }
}

// Target
const TARGET = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
const TARGET_MAX = 1; //Math.max(...TARGET);
const TARGET_MIN = 0; //Math.min(...TARGET);

// Parameters
let params = {
    populationSize: 200,
    mutationRate: 0.02,
    elitismRate: 0.05,
    fittestMatingRate: 0.2,
    maxGenerations: 10000,
    fitnessThreshold: 0.001
};

// Run genetic algorithm
let ga = new GeneticAlgorithm(params);
ga.run();

// Helper functions

// Function to generate random numbers in given range 
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function randomElementFromArray(array) {
    var randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function map(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}