// Source: https://www.geeksforgeeks.org/genetic-algorithms/
// JavaScript program to create target string, starting from 
// random string using Genetic Algorithm 

// Number of individuals in each generation 
const POPULATION_SIZE = 200;

// Valid Genes 
const GENES = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890, .-;:_!\"#%&/()=?@${[]}";

// Target string to be generated 
//const TARGET = "I love GeeksforGeeks";
const TARGET = "To be or not to be.";

// Percentage of next generation are fittest individuals from prev generation (elitism)
const elitismPct = 5;  // Original value: 10

// Percentage of next generation are sexually reproduced offspring from prev generation (crossover)
const offspringPct = 100 - elitismPct; // Original value: 90

// Percentage of fittest individuals are used for reproduction (Ranking)
const fittestParentMatingPct = 25; // Original value: 25

// Mutation rate
const mutationRate = 0.05; // Original value: 0.1

const elitismNum = Math.floor((elitismPct * POPULATION_SIZE) / 100);
const offspringNum = Math.floor((offspringPct * POPULATION_SIZE) / 100);
const fittestParentMatingNum = Math.floor((fittestParentMatingPct * POPULATION_SIZE) / 100);

// Brute-force combinations
console.log(Math.pow(GENES.length, TARGET.length));

// Class representing individual in population 
class Individual {
    constructor(chromosome) {
        this.chromosome = chromosome;
        this.fitness = this.cal_fitness();
    }

    // Perform mating and produce new offspring 
    mate(par2) {
        // chromosome for offspring 
        let child_chromosome = "";

        let len = this.chromosome.length;
        for(let i = 0; i < len; i++) {
            // random probability 
            //let p = random_int(0, 100)/100;
            let p = Math.random();

            // if prob is between 0.0 and 0.5, insert gene 
            // from parent 1 
            if(p < 0.5)
                child_chromosome += this.chromosome[i];

            // if prob is between 0.5 and 1.0, insert 
            // gene from parent 2 
            else
                child_chromosome += par2.chromosome[i];
        }
        // create new Individual(offspring) using 
        // generated chromosome for offspring 
        return new Individual(child_chromosome);
    }

    mateZipper(par2) {
        let child_chromosome = "";
        let len = this.chromosome.length;

        for(let i = 0; i < len; i++) {

            // gene from parent 1 
            if(i % 2 == 0)
                child_chromosome += this.chromosome[i];
            // gene from parent 2 
            else
                child_chromosome += par2.chromosome[i];
        }

        // create new Individual(offspring) using 
        // generated chromosome for offspring 
        return new Individual(child_chromosome);
    }

    mutate() {
        let child_chromosome = "";
        let len = this.chromosome.length;
        for(let i = 0; i < len; i++) {
            // random probability 
            //let p = random_int(0, 100)/100;
            let p = Math.random();

            if(p < mutationRate)
                //child_chromosome += mutated_genes();
                child_chromosome += newChar(); // Daniel Shiffman's newChar, for comparison
            else
                child_chromosome += this.chromosome[i]
        }
        // create new Individual(offspring) using 
        // generated chromosome for offspring 
        return new Individual(child_chromosome);
    }

    // Calculate fitness score, it is the number of 
    // characters in string which differ from target 
    // string. 
    cal_fitness() {
        let len = TARGET.length;
        let fitness = 0;
        for(let i = 0; i < len; i++) {
            if(this.chromosome[i] != TARGET[i])
                fitness++;
        }
        return fitness;	 
    }
}

// Run script
main();

// Driver code 
function main() {
    // current generation 
    let generation = 0;

    let population = [];
    let found = false;

    // create initial population 
    for(let i = 0; i < POPULATION_SIZE; i++) {
        let genome = create_genome();
        population.push(new Individual(genome));
    }

    while(!found) {
        // sort the population in increasing order of fitness score 
        population.sort((ind1, ind2) => ind1.fitness - ind2.fitness);

        // if the individual having lowest fitness score ie. 
        // 0 then we know that we have reached to the target 
        // and break the loop 
        if(population[0].fitness <= 0) {
            found = true;
            break;
        }

        // Otherwise generate new offsprings for new generation 
        let new_generation = [];

        // Perform Elitism, that mean 10% of fittest population 
        // goes to the next generation 
        //let s = Math.floor((5*POPULATION_SIZE)/100); // Original value: 10
        for(let i = 0; i < elitismNum; i++)
            new_generation.push(population[i]);

        // From 50% of fittest population, Individuals 
        // will mate to produce offspring 
        //s = Math.floor((95*POPULATION_SIZE)/100); // Original value: 90
        for(let i = 0; i < offspringNum; i++) {
            //let len = population.length;
            let r = random_int(0, fittestParentMatingNum); // Original value: 50
            let parent1 = population[r];
            r = random_int(0, fittestParentMatingNum); // Original value: 50
            let parent2 = population[r];
            let offspring = parent1.mate(parent2);
            offspring = offspring.mutate();
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
