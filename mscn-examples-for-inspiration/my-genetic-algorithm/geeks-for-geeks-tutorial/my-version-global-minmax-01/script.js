// Source: https://www.geeksforgeeks.org/genetic-algorithms/
// Java program to create target array of floats, starting from random using Genetic Algorithm
// Updated and refactored JavaScript version by Michael Schmidt Nissen

// Number of individuals in each generation 
const POPULATION_SIZE = 100;

// Valid Genes 
//const GENES = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890, .-;:_!\"#%&/()=?@${[]}";

// Target string to be generated 
//const TARGET = "To be or not to be.";

const TARGET_X = [1]; // Value not used
const TARGET_Y = 3; // USed for fitness calculation
const TARGET_MAX = 1000000; //Math.max(...TARGET);
const TARGET_MIN = -1000000; //Math.min(...TARGET);

const COEFFICIENTS = [1, -2, 4]

const FITNESS_THRESHOLD = 0.01;

const NUM_DECIMALS = 8;

// Percentage of next generation are fittest individuals from prev generation (elitism)
const ELITISM_PCT = 5;  // Original value: 10

// Percentage of next generation are sexually reproduced offspring from prev generation (crossover)
const OFFSPRING_PCT = 100 - ELITISM_PCT; // Original value: 90

// Percentage of fittest individuals are used for reproduction (Ranking)
const FITTEST_MATING_PCT = 25; // Original value: 50

// Mutation rate [0, 1]
const MUTATION_RATE = 0.1; // Original value: 0.1

const ELITISM_NUM = Math.floor((ELITISM_PCT * POPULATION_SIZE) / 100);
const OFFSPRING_NUM = Math.floor((OFFSPRING_PCT * POPULATION_SIZE) / 100);
const FITTEST_MATING_NUM = Math.floor((FITTEST_MATING_PCT * POPULATION_SIZE) / 100);

// Class representing individual in population 
class Individual {
    constructor(chromosome) {
        this.chromosome = chromosome;
        this.fitness = this.cal_fitness();
    }
    cal_fitness() {
        // Polynomial evaluation with Horner's ruleS
        let fitness = 0;
        let y = this.eval_polynomial();
        //console.log(y);
        fitness = Math.abs(y - TARGET_Y);
        return fitness;	 
    }
    eval_polynomial() {
        let y = COEFFICIENTS[0];
        for (let i = 0; i < TARGET_X.length; i++) {
            for (let j = 1; j < COEFFICIENTS.length; j++) {
                y = y * this.chromosome[i] + COEFFICIENTS[j];
            }
        }
        return y
    }
    mate(par2) {
        let child_chromosome = [];
        for(let i = 0; i < this.chromosome.length; i++) {
            if(Math.random() < 0.5)
                child_chromosome.push(this.chromosome[i]);
            else
                child_chromosome.push(par2.chromosome[i]);
        }
        return new Individual(child_chromosome);
    }
    mateNumericalAvg(par2) {
        let child_chromosome = [];
        for(let i = 0; i < this.chromosome.length; i++) {
            let gene = (this.chromosome[i] + par2.chromosome[i]) / 2;
            child_chromosome.push(gene);
        }
        return new Individual(child_chromosome);
    }
    mateNumericalLerp(par2) {
        let child_chromosome = [];
        for(let i = 0; i < this.chromosome.length; i++) {
            let gene = lerp(this.chromosome[i], par2.chromosome[i], Math.random());
            child_chromosome.push(gene);
        }
        return new Individual(child_chromosome);
    }
    mateZipper(par2) {
        let child_chromosome = [];
        for(let i = 0; i < this.chromosome.length; i++) {
            if(i % 2 == 0)
                child_chromosome.push(this.chromosome[i]);
            else
                child_chromosome.push(par2.chromosome[i]);
        }
        return new Individual(child_chromosome);
    }
    mutate() {
        for(let i = 0; i < this.chromosome.length; i++) {
            if(Math.random() < MUTATION_RATE)
                this.chromosome[i] = mutated_genes();
        }
    }
}

// Run script
main();

function main() {
    
    let generation = 0;

    let population = [];
    let found = false;

    // create initial population 
    for(let i = 0; i < POPULATION_SIZE; i++) {
        let genome = create_genome();
        population.push(new Individual(genome));
    }

    while(!found) {
    //for (let i = 0; i < 100; i++) {

        // sort the population in increasing order of fitness score (Ranking)
        population.sort((ind1, ind2) => ind1.fitness - ind2.fitness);

        // break the loop if we have reached the target (fitness = 0)
        if(population[0].fitness <= FITNESS_THRESHOLD) {
            found = true;
            break;
        }

        // Otherwise generate new offsprings for new generation 
        let new_generation = [];

        // Only some % of fittest individuals are copied to next generation (elitism)
        for(let i = 0; i < ELITISM_NUM; i++)
            new_generation.push(population[i]);

        // Only some % of fittest individuals will mate to produce offspring 
        for(let i = 0; i < OFFSPRING_NUM; i++) {
            let r = random_int(0, FITTEST_MATING_NUM);
            let parent1 = population[r];
            r = random_int(0, FITTEST_MATING_NUM);
            let parent2 = population[r];
            let offspring = parent1.mateNumericalLerp(parent2);
            offspring.mutate();
            offspring.fitness = offspring.cal_fitness();
            new_generation.push(offspring);
        }

        // replace the old population with the new one
        population = new_generation;

        // Print best match
        console.log("Generation: " + generation + "\tSequence: " + population[0].chromosome + "\tFitness: " + population[0].fitness);

        // Increment generation number
        generation++;
    }

    // Print result
    console.log("Generation: " + generation + "\tSequence: " + population[0].chromosome + "\tFitness: " + population[0].fitness);
}

// Function to generate random numbers in given range 
function random_int(start, end) {
    return Math.floor(Math.random() * (end - start + 1) + start);
}

function random_float(min, max) {
    return Math.random() * (max - min) + min;
}

// Create random genes for mutation 
function mutated_genes() {
    return random_float(TARGET_MIN, TARGET_MAX)
}

// create chromosome or string of genes 
function create_genome() {
    let genome = [];
    for(let i = 0; i < TARGET_X.length; i++)
        genome.push(mutated_genes());
    return genome;
}

function lerp(a, b, t) {
    return (a + (b - a) * t);
}
