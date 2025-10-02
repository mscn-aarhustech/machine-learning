

// Genetic algorithm, first try
let numBest = 20;
let numBestMutated = 20;
let numChildren = 260;

// Define correct sequence
let correctSequence = [0, 1, 2, 3, 4, 5, 6];
let bestMatch = "";

// Create population of random sequences
let populationSize = 300;


let population = [];
let score = [];
let fitness = [];
let bestSequences = [];
let children = [];
let newGeneration = [];

let generation = 0;

// Add correct sequence to population
//population.push(correctSequence);

for (let i = 0; i < populationSize; i++) {
    let sequence = [...correctSequence]
    shuffleArray(sequence);
    population.push(sequence);
}

console.log("Randomized Population:");
console.log(population); // Ok

//while (!areEqual(correctSequence, bestMatch)) {
for (let i = 0; i < 300; i++) {
    
    generation++;
    console.log("Generation: " + generation);

    // Clear arrays
    score = [];
    fitness = [];
    bestSequences = [];
    children = [];
    newGeneration = [];

    // Give each sequence a score based on how close it matches the correct sequence
    // (use several different score algorithms)
    for (let i = 0; i < populationSize; i++) {
        let s = getScore(population[i], correctSequence);
        score.push(s);
    }

    //console.log("Scores:");
    //console.log(score); // Ok

    // Give each sequence a fitness based on score
    // (use several different fitness algorithms)
    for (let i = 0; i < score.length; i++) {
        let s = score[i];
        let f = s / correctSequence.length;
        fitness.push(f);
    }

    //console.log("Fitness:");
    //console.log(fitness); // Ok

    // Normalize fitness
    normalizeFitness();

    // Pick the best few sequences based on fitness
    // (use several different pick algorithms)
    for (let i = 0; i < numBest; i++) {
        let sequence = pickSequence(population, fitness);
        bestSequences.push(sequence);
    }

    //console.log("Best sequences:");
    //console.log(bestSequences); // Ok

    // Create a new generation based on the previous one

    // Add best sequences unchanged to the next generation
    newGeneration.push(...bestSequences);

    // Mutate and add best sequences to the next generation
    // (use several different mutation algorithms)
    let mutatedSequences = [];

    for (let i = 0; i < numBest; i++) {
        let sequence = mutateSequence(bestSequences[i], 1, 0, 5);
        mutatedSequences.push(sequence);
    }

    //console.log("Mutated Sequences:");
    //console.log(mutatedSequences); // Ok

    newGeneration.push(...mutatedSequences);

    // Add crossovers (children) of the best sequences to the next generation
    // (use several different crossover algorithms)
    for (let i = 0; i < numChildren; i++) {
        let sequenceA = pickSequence(population, fitness);
        let sequenceB = pickSequence(population, fitness);
        // console.log(sequenceA);
        // console.log(sequenceB);
        let sequenceC = crossoverZipper(sequenceA, sequenceB);
        children.push(sequenceC);
        // console.log(sequenceC);
    }

    //console.log("Children:");
    //console.log(children); // Ok

    newGeneration.push(...children);

    //console.log("New Generation:");
    //console.log(newGeneration); // Ok

    // Find the best matching sequence
    bestMatch = findBestSequence();

    console.log("Best match:");
    console.log(bestMatch); // Ok

    // Set population to new population
    population = newGeneration;

    //sleep(1000);

    //console.log(population);
}


// loop until best sequence == correct sequence


// Toolbox
function shuffleArray(array) {
    // Loop through array starting at the last index
    for (let i = array.length - 1; i > 0; i--) {
      // Generate a random index from 0 to i
      const j = Math.floor(Math.random() * (i + 1));
  
      // Swap elements at indexes i and j
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
}

function getScore(sequence, correctSequence) {
    let score = 0;
    for (let i = 0; i < sequence.length; i++) {
        if (sequence[i] == correctSequence[i]) {
            score++;
        }
    }
    return score
}

function normalizeFitness() {
    let sum = 0;
    for (let i = 0; i < fitness.length; i++) {
        sum += fitness[i];
    }
    for (let i = 0; i < fitness.length; i++) {
        fitness[i] /= sum;
    }
}

// pickEntitySimple() {
//     // Simplified linear search approach
//     let randomFitness = Math.random();
//     let cumulativeFitness = 0;
//     for (let entity of this.entities) {
//         cumulativeFitness += entity.fitness;
//         if (randomFitness <= cumulativeFitness) {
//             return entity;
//         }
//     }
// }

function pickSequence(population, fitness) {
    let randomFitness = Math.random();
    let cumulativeFitness = 0;
    for (let i = 0; i < fitness.length; i++) {
        cumulativeFitness += fitness[i];
        if (randomFitness <= cumulativeFitness) {
            return population[i];
        }
    }
}

function randomIntBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function mutateSequence(sequence, mutationRate, min = 0, max = 6) {
    let newSequence = [];
    for (let i = 0; i < sequence.length; i++) {
        if (Math.random() < mutationRate) {
            newSequence.push(randomIntBetween(min, max));
        } else {
            newSequence.push(sequence[i]);
        }
    }
    return newSequence;
}

function crossoverZipper(sequenceA, sequenceB) {
    // Select every other gene from different parents (like a zipper).
    // Selected genes keep their original order and position.
    let newSequence = [];
    for (let i = 0; i < sequenceA.length; i++) {
        if (i % 2 == 0) {
            newSequence.push(sequenceA[i]);
        } else {
            newSequence.push(sequenceB[i]);
        }
    }
    return newSequence;
}

function findBestSequence() {
    let bestScore = 0;
    let bestScoreIndex = 0;
    for (let i = 0; i < score.length; i++) {
        if (score[i] > bestScore) {
            bestScore = score[i];
            bestScoreIndex = i;
        }
    }
    return newGeneration[bestScoreIndex];
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function areEqual(array1, array2) {
    return JSON.stringify(array1) === JSON.stringify(array2);
  }