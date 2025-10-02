"use strict";

// ******************************************************
//   Genetic operator library
//   
//   Parent selection, Crossover, and Mutation functions
// ******************************************************

class GenOps {


    // ******************************************************
    //   Parent selection functions
    // ******************************************************

    static randomWayTournamentSelection(population = [], config = {}) {
        let numParents = config.numParents;
        let maxContestants = config.maxContestants;

        let parentGenes = [];
        for (let i = 0; i < numParents; i++) {
            let numContestants = maxContestants || population.length < population.length ? maxContestants : population.length;
            //console.log(numContestants);
            let tournamentSize = randomIntBetween(2, numContestants);
            let tournament = [];
            for (let j = 0; j < tournamentSize; j++) {
                let index = randomIntBetween(0, population.length - 1);
                tournament.push(population[index]);
            }
            tournament.sort((a, b) => a.fitness - b.fitness);
            parentGenes.push(tournament[0].genome);
        }
        return parentGenes;
    }

    // static randomWayTournamentSelection(population = [], numParents = 2, maxContestants = null) {
    //     let parentGenes = [];
    //     for (let i = 0; i < numParents; i++) {
    //         let numContestants = maxContestants || population.length < population.length ? maxContestants : population.length;
    //         //console.log(numContestants);
    //         let tournamentSize = randomIntBetween(2, numContestants);
    //         let tournament = [];
    //         for (let j = 0; j < tournamentSize; j++) {
    //             let index = randomIntBetween(0, population.length - 1);
    //             tournament.push(population[index]);
    //         }
    //         tournament.sort((a, b) => a.fitness - b.fitness);
    //         parentGenes.push(tournament[0].genome);
    //     }
    //     return parentGenes;
    // }

    static rouletteWheelSelection(population = [], numParents = 2) {
        let sum = population.reduce((acc, individual) => acc + individual.fitness, 0);
        for (let individual of population) {
            individual.prob = individual.fitness / sum;
        }
        // population.sort((a, b) => a.fitness - b.fitness);
        let parentGenes = [];
        for (let i = 0; i < numParents; i++) {
            let randomProb = Math.random();
            let cumulativeProb = 0;
            for (let individual of population) {
                cumulativeProb += individual.prob;
                if (randomProb <= cumulativeProb) {
                    parentGenes.push(individual.genome);
                    break;
                }
            }
        }
        return parentGenes;
    }

    static stochasticUniversalSampling(population = [], numParents = 2) {
        let sum = population.reduce((acc, individual) => acc + individual.fitness, 0);
        let pointerDistance = sum / numParents;
        let startPoint = Math.random() * pointerDistance;
        let pointers = Array.from({ length: numParents }, (_, i) => startPoint + i * pointerDistance);
        let parentGenes = [];
        for (let pointer of pointers) {
            let cumulativeSum = 0;
            for (let i = 0; i < population.length; i++) {
                cumulativeSum += population[i].fitness;
                if (cumulativeSum >= pointer) {
                    parentGenes.push(population[i].genome);
                    break;
                }
            }
        }
        return parentGenes;
    }

    static nWayTournamentSelection(population = [], numParents = 2, tournamentSize = 2) {
        let parentGenes = [];
        for (let i = 0; i < numParents; i++) {
            let tournament = [];
            for (let j = 0; j < tournamentSize; j++) {
                let randomIndex = randomIntBetween(0, population.length - 1);
                tournament.push(population[randomIndex]);
            }
            tournament.sort((a, b) => a.fitness - b.fitness);
            parentGenes.push(tournament[0].genome);
        }
        return parentGenes;
    }

    static truncationSelection(population = [], numParents = 2, matingNum = Math.floor(population.length * 0.5)) {
        let parentGenes = [];
        population.sort((a, b) => a.fitness - b.fitness);
        for (let i = 0; i < numParents; i++) {
            let rnd = randomIntBetween(0, matingNum);
            let individual = population[rnd];
            parentGenes.push(individual.genome);
        }
        return parentGenes;
    }

    static randomSelection(population = [], numParents = 2) {
        // Randomly select parents from population
        // For comparison with other selection functions
        let parentGenes = [];
        for (let i = 0; i < numParents; i++) {
            let randomIndex = randomIntBetween(0, population.length - 1);
            let individual = population[randomIndex];
            parentGenes.push(individual.genome);
        }
        return parentGenes;
    }


    // ******************************************************
    //   Crossover statics
    // ******************************************************

    static uniformCrossover(parentGenes = [], params = {}) {
        let numChildren = params.numChildren;
        // Check if all parents have the same number of genes
        const geneLength = parentGenes[0].length;
        for (let i = 1; i < parentGenes.length; i++) {
            if (parentGenes[i].length !== geneLength) {
                throw new Error("All parents must have the same number of genes");
            }
        }

        // Randomly select genes from any parent.
        // Selected genes keep their original order and position.
        let offspringGenes = [];
        for (let i = 0; i < numChildren; i++) {
            let newGenes = [];
            for (let j = 0; j < geneLength; j++) {
                let parentGeneIndex = Math.floor(Math.random() * parentGenes.length);
                newGenes.push(parentGenes[parentGeneIndex][j]);
            }
            //console.log(individual);
            offspringGenes.push(newGenes);
        }
        return offspringGenes;
    }

    // static uniformCrossover(parentGenes = [], numChildren = 1) {
    //     // Check if all parents have the same number of genes
    //     const geneLength = parentGenes[0].length;
    //     for (let i = 1; i < parentGenes.length; i++) {
    //         if (parentGenes[i].length !== geneLength) {
    //             throw new Error("All parents must have the same number of genes");
    //         }
    //     }

    //     // Randomly select genes from any parent.
    //     // Selected genes keep their original order and position.
    //     let offspringGenes = [];
    //     for (let i = 0; i < numChildren; i++) {
    //         let newGenes = [];
    //         for (let j = 0; j < geneLength; j++) {
    //             let parentGeneIndex = Math.floor(Math.random() * parentGenes.length);
    //             newGenes.push(parentGenes[parentGeneIndex][j]);
    //         }
    //         //console.log(individual);
    //         offspringGenes.push(newGenes);
    //     }
    //     return offspringGenes;
    // }

    static wholeArithmeticRecombination(parentGenes = [], params = {}) {
        // Only used with genomes encoded as floating point numbers.
        let numChildren = params.numChildren;

        // Check if all parents have the same number of genes
        const geneLength = parentGenes[0].length;
        for (let i = 1; i < parentGenes.length; i++) {
            if (parentGenes[i].length !== geneLength) {
                throw new Error("All parents must have the same number of genes");
            }
        }

        // Randomly weighted linear interpolation between two randomly selected parent genes.
        let offspringGenes = [];
        for (let i = 0; i < numChildren; i++) {
            let newGenes = [];
            for (let j = 0; j < geneLength; j++) {
                let parentIndices = [];
                while (parentIndices.length < 2) {
                    let randomIndex = Math.floor(Math.random() * parentGenes.length);
                    if (!parentIndices.includes(randomIndex)) {
                        parentIndices.push(randomIndex);
                    }
                }
                let gene = lerp(parentGenes[parentIndices[0]][j], parentGenes[parentIndices[1]][j], Math.random());
                newGenes.push(gene);
            }
            offspringGenes.push(newGenes);
        }
        return offspringGenes;
    }

    // static wholeArithmeticRecombination(parentGenes = [], numChildren = 1) {
    //     // Only used with genomes encoded as floating point numbers.

    //     // Check if all parents have the same number of genes
    //     const geneLength = parentGenes[0].length;
    //     for (let i = 1; i < parentGenes.length; i++) {
    //         if (parentGenes[i].length !== geneLength) {
    //             throw new Error("All parents must have the same number of genes");
    //         }
    //     }

    //     // Randomly weighted linear interpolation between two randomly selected parent genes.
    //     let offspringGenes = [];
    //     for (let i = 0; i < numChildren; i++) {
    //         let newGenes = [];
    //         for (let j = 0; j < geneLength; j++) {
    //             let parentIndices = [];
    //             while (parentIndices.length < 2) {
    //                 let randomIndex = Math.floor(Math.random() * parentGenes.length);
    //                 if (!parentIndices.includes(randomIndex)) {
    //                     parentIndices.push(randomIndex);
    //                 }
    //             }
    //             let gene = lerp(parentGenes[parentIndices[0]][j], parentGenes[parentIndices[1]][j], Math.random());
    //             newGenes.push(gene);
    //         }
    //         offspringGenes.push(newGenes);
    //     }
    //     return offspringGenes;
    // }


    // ******************************************************
    //   Mutation functions
    // ******************************************************

    static randomizeMutation(genes = [], params = {}) {
        let mutationChance = params.mutationChance;
        let minValue = params.minValue;
        let maxValue = params.maxValue;
        for (let i = 0; i < genes.length; i++) {
            let gene = genes[i];
            for (let i = 0; i < gene.length; i++) {
                if (Math.random() < mutationChance) {
                    //console.log("Muation!");
                    gene[i] = randomFloatBetween(minValue, maxValue);
                }
            }
        }
    }

    // static randomizeMutation(genes = [], mutationChance = 0.01, minValue = 0, maxValue = 1) {
    //     for (let i = 0; i < genes.length; i++) {
    //         let gene = genes[i];
    //         for (let i = 0; i < gene.length; i++) {
    //             if (Math.random() < mutationChance) {
    //                 gene[i] = randomFloatBetween(minValue, maxValue);
    //             }
    //         }
    //     }
    // }

    static swapMutation(genes = []) {
        let numSwaps = randomIntBetween(1, genes.length);
        for (let i = 0; i < numSwaps; i++) {
            let indexA = randomIntBetween(0, genes.length - 1);
            let indexB = randomIntBetween(0, genes.length - 1);
            let temp = genes[indexA];
            genes[indexA] = genes[indexB];
            genes[indexB] = temp;
        }
    }

    static scambleMutation(genes = []) {
        // Randomly shuffle the order of genes
        fisherYatesShuffle(genes);
    }

    static inversionMutation(genes = []) {
        // Inverse gene order in a random chunk of genes
        let start = randomIntBetween(0, genes.length - 1);
        let end = randomIntBetween(0, genes.length - 1);
        if (start > end) {
            let temp = start;
            start = end;
            end = temp;
        }
        let chunk = genes.slice(start, end);
        chunk.reverse();
        genes.splice(start, end - start, ...chunk);
    }
}