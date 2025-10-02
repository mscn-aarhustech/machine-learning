const target = [0.1, 0.2, 0.3, 0.4, 0.5];  // The target solution
const popSize = 100;  // The size of the population
const mutationRate = 0.01;  // The rate of mutation

// Initialization: create an initial population of random individuals
let population = Array.from({length: popSize}, () => 
    target.map(() => Math.random()));

// Fitness Calculation: calculate the fitness of an individual
function fitness(individual) {
    return individual.reduce((sum, gene, index) => 
        sum + Math.abs(gene - target[index]), 0);
}

// Selection: select two parents for reproduction
function select(population) {
    let mates = population.sort((a, b) => fitness(a) - fitness(b)).slice(0, 2);
    return mates;
}

// Crossover: generate a new individual by combining two parents
function crossover(parent1, parent2) {
    let child = parent1.map((gene, index) => 
        Math.random() < 0.5 ? gene : parent2[index]);
    return child;
}

// Mutation: randomly alter some genes of an individual
function mutate(individual) {
    return individual.map(gene => 
        Math.random() < mutationRate ? Math.random() : gene);
}

// Loop: repeat the genetic algorithm until a stopping condition is met
let generation = 0;
//while (true) {
for (let i = 0; i < 100; i++) {
    generation++;
    
    // Calculate the fitness of each individual in the population
    let fitnesses = population.map(fitness);
    
    // Check the stopping condition: if the best individual's fitness is 0, stop
    if (Math.min(...fitnesses) === 0) break;

    // Select two parents and generate a new individual
    let [parent1, parent2] = select(population);
    let child = crossover(parent1, parent2);
    
    // Mutate the new individual and add it to the population
    child = mutate(child);
    population.push(child);
    
    // Remove the worst individual to maintain the population size
    population.sort((a, b) => fitness(a) - fitness(b));
    population.pop();
    
    // Log the generation number and the best individual
    console.log(`Generation: ${generation}`);
    console.log(`Best individual: ${population[0]}`);
}

console.log(`Final best individual: ${population[0]}`);  // The best individual in the population
