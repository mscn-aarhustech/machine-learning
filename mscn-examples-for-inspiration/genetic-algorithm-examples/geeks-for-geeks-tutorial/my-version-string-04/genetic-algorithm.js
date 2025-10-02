"use strict";

class Individual {
    constructor() {
        this.value = null;
        this.chromosome = null;
        this.fitness = null;
    }
    calculateFitness() {
        // Calculate fitness from chromosome deviation
        // let fitness = 0;
        // for(let i = 0; i < this.chromosome.length; i++) {
        //     fitness += Math.abs(this.chromosome[i] - TARGET_CHROMO[i]);
        // }
        // this.fitness = fitness;
        // Calculate fitness from value deviation
        let fitness = 0;
        for(let i = 0; i < this.value.length; i++) {
            if( this.value[i] != TARGET_VALUE[i]) {
                fitness++;
            }
        }
        this.fitness = fitness;
    }
    setValue(value) {
        this.value = value;
        this.chromosome = Individual.encode(value);
    }
    setChromosome(chromosome) {
        this.chromosome = chromosome;
        this.value = Individual.decode(chromosome);
    }
    // Encode a string value into a chromosome of floats [0, 1]
    static encode(value) {
        let chromosome = [];
        for(let i = 0; i < value.length; i++) {
            let gene = map(value.charCodeAt(i), 0, 255, 0, 1);
            //gene = round(gene, 3); // 3 decimals is enough for 255 values
            //gene = Number(gene.toFixed(3));
            chromosome.push(gene);
        }
        return chromosome;
    }

    // Decode a chromosome of floats [0, 1] into a string value
    static decode(chromosome) {
        let value = "";
        for(let i = 0; i < chromosome.length; i++) {
            let gene = Math.round(map(chromosome[i], 0, 1, 0, 255));
            value += String.fromCharCode(gene);
        }
        return value;
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
    // createRandomChromosome() {
    //     let chromosome = [];
    //     for(let i = 0; i < 19; i++) {
    //         let randomGene = randomFloat(0, 1);
    //         chromosome.push(randomGene);
    //     }
    //     return chromosome;
    // }
    createRandomValue() {
        let value = "";
        for(let i = 0; i < TARGET_VALUE.length; i++) {
            value += newChar();
        }
        return value;
    }
    initializePopulation() {
        for (let i = 0; i < this.populationSize; i++) {
            let value = this.createRandomValue();
            let individual = new Individual();
            individual.setValue(value);
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

        // Create offspring
        for(let i = 0; i < this.offspringNum; i++) {
            let parents = this.nWayTournamentSelection(this.population, 2);
            let offspring = this.uniformCrossover(parents[0], parents[1]); 
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
        let child = new Individual();
        child.setChromosome(childChromosome);
        return child;
    }
    uniformCrossover(parentA, parentB) {
        let childChromosome = [];
        for (let i = 0; i < parentA.chromosome.length; i++) {
            if (Math.random() < 0.5) {
                childChromosome.push(parentA.chromosome[i]);
            } else {
                childChromosome.push(parentB.chromosome[i]);
            }
        }
        let child = new Individual();
        child.setChromosome(childChromosome);
        return child;
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
        let totalFitness = 0;
        for (let individual of population) {
            totalFitness += individual.fitness;
        }
        let pointerDistance = totalFitness / numParents;
        let startPoint = Math.random() * pointerDistance;
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
    nWayTournamentSelection(population=[], numParents=2, tournamentSize=2) {
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
    mutate(individual) {
        for(let i = 0; i < individual.value.length; i++) {
            if(Math.random() < this.mutationRate) {
                //individual.value[i] = newChar();
                individual.value = setCharAt(individual.value, i, newChar());
            }
        }
        individual.chromosome = Individual.encode(individual.value);

        // for(let i = 0; i < individual.chromosome.length; i++) {
        //     if(Math.random() < this.mutationRate) {
        //         let randomChar = newChar();
        //         individual.chromosome[i] = Individual.encode(randomChar); // Shouldn't work, but does?
        //     }
        // }
    }
    // Misc
    printResult() {
        console.log("Generation: " + this.generation + "\tSequence: " + this.population[0].value + "\tFitness: " + this.population[0].fitness);
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


// Parameters
let params = {
    populationSize: 200,
    mutationRate: 0.01,
    elitismRate: 0.05,
    fittestMatingRate: 0.25,
    maxGenerations: 1000,
    fitnessThreshold: 0
};

const TARGET_VALUE = "To be or not to be.";
const TARGET_CHROMO = Individual.encode(TARGET_VALUE);
console.log("Target: " + TARGET_VALUE);
console.log("Target chromosome: " + TARGET_CHROMO);


// Run genetic algorithm
let ga = new GeneticAlgorithm(params);
ga.run();


// Helper functions
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

// round float to n decimal places
function round(value, decimals) {
    //return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    return Number(value.toFixed(decimals));
    //return Math.round((value + Number.EPSILON) * 100) / 100;
    //return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

// Create random genes for mutation 
function newChar() {
    // Daniel Shiffman's, for comparison
    let c = Math.floor(randomInt(63, 122));
    if (c === 63) c = 32;
    if (c === 64) c = 46;
  
    return String.fromCharCode(c);
}

// Add char at index to string (strings are immutable)
function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}
