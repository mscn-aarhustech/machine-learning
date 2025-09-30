// Source: https://www.geeksforgeeks.org/genetic-algorithms/
// Java program to create target string, starting from random string using Genetic Algorithm
// Updated and refactored JavaScript version by Michael Schmidt Nissen

// Number of individuals in each generation 
const POPULATION_SIZE = 200;

// Valid Genes 
const GENES = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890, .-;:_!\"#%&/()=?@${[]}";
//const GENES = "abcdefghijklmnopqrstuvwxyz0123456789"

// Target string to be generated 
const TARGET = "To be or not to be.";
//const TARGET = "Insanity is doing the same thing over and over again and expecting different results";

// Percentage of next generation are fittest individuals from prev generation (elitism)
const ELITISM_PCT = 5;  // Original value: 10

// Percentage of next generation are sexually reproduced offspring from prev generation (crossover)
const OFFSPRING_PCT = 100 - ELITISM_PCT; // Original value: 90

// Percentage of fittest individuals are used for reproduction (Ranking)
const FITTEST_MATING_PCT = 25; // Original value: 50

// Mutation rate [0, 1]
const MUTATION_RATE = 0.05; // Original value: 0.1

const ELITISM_NUM = Math.floor((ELITISM_PCT * POPULATION_SIZE) / 100);
const OFFSPRING_NUM = Math.floor((OFFSPRING_PCT * POPULATION_SIZE) / 100);
const FITTEST_MATING_NUM = Math.floor((FITTEST_MATING_PCT * POPULATION_SIZE) / 100);

// Brute-force combinations
console.log(Math.pow(GENES.length, TARGET.length));

// Class representing individual in population 
class Individual {
    constructor(chromosome) {
        this.chromosome = chromosome;
        this.fitness = Infinity; //this.cal_fitness();
    }
    mate(par2) {
        let child_chromosome = "";
        for(let i = 0; i < this.chromosome.length; i++) {
            let p = Math.random();

            if(p < 0.5)
                child_chromosome += this.chromosome[i];
            else
                child_chromosome += par2.chromosome[i];
        }
        return new Individual(child_chromosome);
    }
    mateZipper(par2) {
        let child_chromosome = "";
        for(let i = 0; i < this.chromosome.length; i++) {

            if(i % 2 == 0)
                child_chromosome += this.chromosome[i];
            else
                child_chromosome += par2.chromosome[i];
        }
        return new Individual(child_chromosome);
    }
    mutate() {
        let child_chromosome = "";
        for(let i = 0; i < this.chromosome.length; i++) {
            let p = Math.random();

            if(p < MUTATION_RATE)
                //child_chromosome += mutated_genes();
                child_chromosome += newChar(); // Daniel Shiffman's newChar, for comparison
            else
                child_chromosome += this.chromosome[i]
        }
        return new Individual(child_chromosome);
    }
    cal_fitness() {
        let fitness = 0;
        for(let i = 0; i < TARGET.length; i++) {
            if(this.chromosome[i] != TARGET[i])
                fitness++;
        }
        return fitness;	 
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
        // sort the population in increasing order of fitness score (Ranking)
        population.sort((ind1, ind2) => ind1.fitness - ind2.fitness);

        // break the loop if we have reached the target (fitness = 0)
        if(population[0].fitness <= 0) {
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
            let offspring = parent1.mate(parent2);
            offspring = offspring.mutate();
            offspring.fitness = offspring.cal_fitness();
            new_generation.push(offspring);
        }
        population = new_generation;
        console.log("Generation: " + generation + "\tString: " + population[0].chromosome + "\tFitness: " + population[0].fitness);

        generation++;
    }
    console.log("Generation: " + generation + "\tString: " + population[0].chromosome + "\tFitness: " + population[0].fitness);
}

// Function to generate random numbers in given range 
function random_int(start, end) {
    return Math.floor(Math.random() * (end - start + 1) + start);
}

// Create random genes for mutation 
function mutated_genes() {
    let len = GENES.length;
    let r = random_int(0, len-1);
    return GENES[r];
}

// create chromosome or string of genes 
function create_genome() {
    let len = TARGET.length;
    let genome = "";
    for(let i = 0; i < len; i++)
        //genome += mutated_genes();
        genome += newChar(); // Daniel Shiffman's, for comparison
    return genome;
}

function newChar() {
    // Daniel Shiffman's, for comparison
    let c = Math.floor(random_int(63, 122));
    if (c === 63) c = 32;
    if (c === 64) c = 46;
  
    return String.fromCharCode(c);
}
