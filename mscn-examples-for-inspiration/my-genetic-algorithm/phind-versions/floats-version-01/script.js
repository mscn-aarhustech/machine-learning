// Number of individuals in each generation 
const POPULATION_SIZE = 200;

// Target string to be generated 
const TARGET = Array(8).fill().map(() => Math.random() * 2 - 1);

// Class representing individual in population 
class Individual {
    constructor(chromosome) {
        this.chromosome = chromosome;
        this.fitness = this.cal_fitness();
    }

    // Perform mating and produce new offspring 
    mate(par2) {
        // chromosome for offspring 
        let child_chromosome = [];

        let len = this.chromosome.length;
        for(let i = 0; i < len; i++) {
            // generate weighted average from both parents' genes
            child_chromosome[i] = (this.chromosome[i] + par2.chromosome[i]) / 2;
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
            //let p = random_num(0, 100)/100;
            let p = Math.random();

            if(p < 0.1)
                //child_chromosome += mutated_genes();
                child_chromosome += random_num(-1, 1);
            else
                child_chromosome += this.chromosome[i]
        }
        // create new Individual(offspring) using 
        // generated chromosome for offspring 
        return new Individual(child_chromosome);
    }

    // Calculate fitness score based on how close each gene is to the target
    cal_fitness() {
        let len = TARGET.length;
        let fitness = 0;
        for(let i = 0; i < len; i++) {
            fitness += Math.abs(this.chromosome[i] - TARGET[i]);
        }
        return fitness;	 
    }
}

// Function to generate random numbers in given range 
function random_num(start, end) {
    return Math.random() * (end - start) + start;
}

function random_int(start, end) {
    return Math.floor(Math.random() * (end - start + 1) + start);
}

// create chromosome or string of genes 
function create_genome() {
    let len = TARGET.length;
    let genome = [];
    for(let i = 0; i < len; i++)
        genome[i] = random_num(-1, 1);
    return genome;
}

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

    //while(!found) {
    for (let i = 0; i < 100; i++) {
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
        let s = Math.floor((10*POPULATION_SIZE)/100);
        for(let i = 0; i < s; i++)
            new_generation.push(population[i]);

        // From 50% of fittest population, Individuals 
        // will mate to produce offspring 
        s = Math.floor((90*POPULATION_SIZE)/100);
        for(let i = 0; i < s; i++) {
            let r = random_int(0, 50);
            let parent1 = population[r];
            r = random_int(0, 50);
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

// Run script
main();
