// Source: https://www.geeksforgeeks.org/genetic-algorithms/
// Java program to create target polynomial, starting from random using Genetic Algorithm
// Updated and refactored JavaScript version by Michael Schmidt Nissen

// 0.022999759856968626,0.4539993747047218,-2.758999984724361,5.11999143439483,-1.257630586989546e-7

// Number of individuals in each generation 
const POPULATION_SIZE = 200;

const NUM_POLYNOMIAL_TERMS = 5;

// Target x and y values
const TARGET_X = [1, 3.22, 5.27, 10.49, 7.12];
const TARGET_Y = [4.3, 1.18, 0.01, 1.48, 3.44];

const TARGET_MAX = 10; //Math.max(...TARGET);
const TARGET_MIN = -10; //Math.min(...TARGET);

//const TARGET_TERMS = [0.023, 0.454, -2.759, 5.12, 0];

const WIGGLE_ROOM = 1.0; 

// Percentage of next generation are fittest individuals from prev generation (elitism)
const ELITISM_PCT = 30;  // Original value: 10

// Percentage of next generation are sexually reproduced offspring from prev generation (crossover)
const OFFSPRING_PCT = 100 - ELITISM_PCT; // Original value: 90

// Percentage of fittest individuals are used for reproduction (Ranking)
const FITTEST_MATING_PCT = 50; // Original value: 50

// Mutation rate [0, 1]
const MUTATION_RATE = 1; // Original value: 0.1

const ELITISM_NUM = Math.floor((ELITISM_PCT * POPULATION_SIZE) / 100);
const OFFSPRING_NUM = Math.floor((OFFSPRING_PCT * POPULATION_SIZE) / 100);
const FITTEST_MATING_NUM = Math.floor((FITTEST_MATING_PCT * POPULATION_SIZE) / 100);


// Class representing individual in population 
class Individual {
    constructor(coefficients) {
        this.coefficients = coefficients;
        this.actualY = [];
        this.fitness = this.cal_fitness();
    }
    eval_polynomial(x, coeffs) {
        let y = coeffs[0];
        for (let i = 1; i < this.coefficients.length; i++) {
            y = y * x + coeffs[i];
        }
        return y;
    }

    // Calculate fitness score, it is the absolute difference 
    // between the solution of the equation using the individual's 
    // coefficients and the desired solution.
    cal_fitness() {
        // Polynomial evaluation with Horner's rule
        let fitness = 0;
        this.actualY = [];

        for (let i = 0; i < TARGET_X.length; i++) {
            let y = this.eval_polynomial(TARGET_X[i], this.coefficients);
            this.actualY.push(y);
            fitness += Math.abs(y - TARGET_Y[i]);
            //fitness += Math.abs(this.coefficients[i] - TARGET_TERMS[i]);
        }

        // for (let i = 0; i < TARGET_X.length; i++) {
        //     let y = this.coefficients[0];
        //     for (let j = 1; j < this.coefficients.length; j++) {
        //         y = y * TARGET_X[i] + this.coefficients[j];
        //     }
        //     this.actualY.push(y);
        //     fitness += Math.abs(y - TARGET_Y[i]);
        // }
        return fitness;	 
    }
    
    // Perform mating and produce new offspring 
    // mate(par2) {
    //     let child_coefficients = [];
    //     for (let i = 0; i < this.coefficients.length; i++) {
    //         let c = (this.coefficients[i] + par2.coefficients[i]) / 2
    //         child_coefficients.push(c);
    //     }
    //     return new Individual(child_coefficients);
    // }

    mate(par2) {
        let child_coefficients = [];
        for (let i = 0; i < this.coefficients.length; i++) {
            if (Math.random() < 0.5)
                child_coefficients.push(this.coefficients[i]);
            else
                child_coefficients.push(par2.coefficients[i]);
        }
        return new Individual(child_coefficients);
    }
    mateNumerical2(par2) {
        let child_coefficients = [];
        for(let i = 0; i < this.coefficients.length; i++) {
            let gene = lerp(this.coefficients[i], par2.coefficients[i], Math.random());
            child_coefficients.push(gene);
        }
        return new Individual(child_coefficients);
    }
    // Mutate the coefficients slightly
    mutate() {
        //console.log("Mutate!")
        let mutated_coefficients = [];

        for (let i = 0; i< this.coefficients.length; i++) {
            if(Math.random() < MUTATION_RATE) {
                //mutated_coefficients.push(mutated_genes());
                mutated_coefficients.push(this.coefficients[i] += (Math.random() - 0.5) * this.fitness * 0.2);
            } else {
                mutated_coefficients.push(this.coefficients[i]);
            }

        }

        return new Individual(mutated_coefficients);
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
    console.log("Original population");
    console.log(population);

    //while(!found) {
    for (let i = 0; i < 100000; i++) {

        // Otherwise generate new offsprings for new generation 
        let new_generation = [];

        // Only some % of fittest individuals are copied to next generation (elitism)
        for(let i = 0; i < ELITISM_NUM; i++) {
            new_generation.push(population[i]);
        }

        //console.log("Sorted population:");
        //console.log(population);

        // Only some % of fittest individuals will mate to produce offspring 
        for(let i = 0; i < OFFSPRING_NUM; i++) {
            let i1 = random_int(0, FITTEST_MATING_NUM);
            let parent1 = population[i1];
            //console.log(i1, parent1);
            let i2 = random_int(0, FITTEST_MATING_NUM);
            let parent2 = population[i2];
            //console.log(i2, parent1);
            //let offspring = parent1.mate(parent2);
            let offspring = parent1.mateNumerical2(parent2);
            //offspring = offspring.mutate();
            offspring = offspring.mutate();
            new_generation.push(offspring);
        }

        population = new_generation;

        // sort the population in increasing order of fitness score (Ranking)
        population.sort((ind1, ind2) => ind1.fitness - ind2.fitness);
        
        //console.log("Sorted population:");
        //console.log(population);

        // break the loop if we have reached the target (fitness <= WIGGLE_ROOM)
        if(Math.abs(population[0].fitness) <= WIGGLE_ROOM) {
            found = true;
            break;
        }

        console.log("Generation: " + generation + "\tString: " + population[0].coefficients + "\tFitness: " + population[0].fitness);

        generation++;
    }

    console.log("Generation: " + generation + "\tString: " + population[0].coefficients + "\tFitness: " + population[0].fitness);
    
    // Print actual y values
    console.log(population[0].actualY);
}

// Function to generate random numbers in given range 
function random_int(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function random_float(min, max) {
    return Math.random() * (max - min) + min;
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

// Create random genes for mutation 
function mutated_genes() {
    return random_float(TARGET_MIN, TARGET_MAX)
}

// create chromosome or string of genes 
function create_genome() {
    let genome = [];
    for(let i = 0; i < NUM_POLYNOMIAL_TERMS; i++)
        genome.push(mutated_genes());
    return genome;
}
