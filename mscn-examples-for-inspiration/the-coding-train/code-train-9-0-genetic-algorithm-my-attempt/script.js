
// Three principles of Darwinian evolution:
// 1. Variation. There are differences between individuals in a population.
// 2. Inheritance. Traits from one generation are passed on to the next.
//   2a. crossover from sexual repoduction
//   2b. mutation
// 3. Selection. Some individuals are more likely to survive and reproduce than others.

// Simulation algorithm:
// Setup:
//
// Step 1. Initialize. Generate a random population of N individuals (variation).
//
// Simulation loop:
//
// Step 2. Evaluate fitness and assign a fitness score to each individual in the population (selection).
// Step 3. Reproduction: (repeat N times)
//   a. Select two parents based on fitness (selection).
//   b. crossover - Create a new individual by combining the DNA of these two parents.
//   c. mutation - Mutate the DNA of the new individual.
//   d. Add offspring to a new population.
// Step 4. Replace the old population with the new population and return to Step 2.


let target = "weylandyutani";
let targetLength = target.length;

let population = [];

let popSize = 100;
let mutationRate = 0.01;

