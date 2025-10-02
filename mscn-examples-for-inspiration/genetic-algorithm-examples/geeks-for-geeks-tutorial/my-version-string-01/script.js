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

// Brute-force combinations
console.log(Math.pow(TARGET.length, GENES.length));

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
            let p = random_num(0, 100)/100;

            // if prob is less than 0.45, insert gene 
            // from parent 1 
            if(p < 0.45)
                child_chromosome += this.chromosome[i];

            // if prob is between 0.45 and 0.90, insert 
            // gene from parent 2 
            else if(p < 0.90)
                child_chromosome += par2.chromosome[i];

            // otherwise insert random gene(mutate), 
            // for maintaining diversity 
            else
                //child_chromosome += mutated_genes();
                child_chromosome += newChar(); // Daniel Shiffman's newChar, for comparison
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
        let gnome = create_gnome();
        population.push(new Individual(gnome));
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
        let s = Math.floor((5*POPULATION_SIZE)/100); // Original value: 10
        for(let i = 0; i < s; i++)
            new_generation.push(population[i]);

        // From 50% of fittest population, Individuals 
        // will mate to produce offspring 
        s = Math.floor((95*POPULATION_SIZE)/100); // Original value: 90
        for(let i = 0; i < s; i++) {
            //let len = population.length;
            let r = random_num(0, 60); // Original value: 50
            let parent1 = population[r];
            r = random_num(0, 60); // Original value: 50
            let parent2 = population[r];
            let offspring = parent1.mate(parent2);
            new_generation.push(offspring);
        }
        population = new_generation;
        console.log("Generation: " + generation + "\tString: " + population[0].chromosome + "\tFitness: " + population[0].fitness);

        generation++;
    }
    console.log("Generation: " + generation + "\tString: " + population[0].chromosome + "\tFitness: " + population[0].fitness);
}

// Function to generate random numbers in given range 
function random_num(start, end) {
    return Math.floor(Math.random() * (end - start + 1) + start);
}

// Create random genes for mutation 
function mutated_genes() {
    let len = GENES.length;
    let r = random_num(0, len-1);
    return GENES[r];
}

// create chromosome or string of genes 
function create_gnome() {
    let len = TARGET.length;
    let gnome = "";
    for(let i = 0; i < len; i++)
        //gnome += mutated_genes();
        gnome += newChar(); // Daniel Shiffman's, for comparison
    return gnome;
}

function newChar() {
    // Daniel Shiffman's, for comparison
    let c = Math.floor(randomIntBetween(63, 122));
    if (c === 63) c = 32;
    if (c === 64) c = 46;
  
    return String.fromCharCode(c);
}

function randomIntBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}