"use strict";

// ******************************************************
//   Genetic operator library
//   
//   Parent selection, Crossover, and Mutation functions
// ******************************************************


// ******************************************************
//   Parent selection functions
// ******************************************************
function rouletteWheelParentSelection(population, numParents=2) {
    let sum = population.reduce((acc, individual) => acc + individual.fitness, 0);
    for (let individual of population) {
        individual.prob = individual.fitness / sum;
    }
    population.sort((a, b) => a.fitness - b.fitness);
    let parents = [];
    for (let i = 0; i < numParents; i++) {
        let randomProb = Math.random();
        let cumulativeProb = 0;
        for (let individual of population) {
            cumulativeProb += individual.prob;
            if (randomProb <= cumulativeProb) {
                parents.push(individual);
                break;
            }
        }
    }
    return parents;
}

// function rouletteWheelParentSelection(population) {
//     let totalFitness = 0;
//     for (let individual of population) {
//         totalFitness += individual.fitness;
//     }
//     let randomFitness = Math.random() * totalFitness;
//     let cumulativeFitness = 0;
//     for (let individual of population) {
//         cumulativeFitness += individual.fitness;
//         if (randomFitness <= cumulativeFitness) {
//             return individual;
//         }
//     }
// }

// function rouletteWheelParentSelection(population) {
//     let sum = population.reduce((acc, individual) => acc + individual.fitness, 0);
//     let randomVal = Math.random() * sum;
//     let cumulativeSum = 0;
//     for (let i = 0; i < population.length; i++) {
//         cumulativeSum += population[i].fitness;
//         if (cumulativeSum >= randomVal) {
//             return population[i];
//         }
//     }

//     // In case no individual is selected, return the first (fittest) individual
//     return population[0];
// }


function stochasticUniversalSampling(population, numParents=2) {
    let sum = population.reduce((acc, individual) => acc + individual.fitness, 0);
    let pointerDistance = sum / numParents;
    let startPoint = Math.random() * pointerDistance;
    let pointers = Array.from({length: numParents}, (_, i) => startPoint + i * pointerDistance);
    let parents = [];
    for (let pointer of pointers) {
        let cumulativeSum = 0;
        for (let i = 0; i < population.length; i++) {
            cumulativeSum += population[i].fitness;
            if (cumulativeSum >= pointer) {
                parents.push(population[i]);
                break;
            }
        }
    }
    return parents;
}

function randomWayTournamentSelection(population=[], numParents=2, maxContestants=null) {
    let parentGenes = [];
    for (let i = 0; i < numParents; i++) {
        let numContestants = maxContestants || population.length < population.length ? maxContestants : population.length;
        //console.log(numContestants);
        let tournamentSize = randomIntBetween(2, numContestants);
        let tournament = [];
        for (let j = 0; j < tournamentSize; j++) {
            let index = randomIntBetween(0, population.length-1);
            tournament.push(population[index]);
        }
        tournament.sort((a, b) => a.fitness - b.fitness);
        parentGenes.push(tournament[0].genome);
    }
    return parentGenes;
}

// function randomWayTournamentSelection(population=[], numParents=2, maxContestants=null) {
//     let parents = [];
//     for (let i = 0; i < numParents; i++) {
//         let numContestants = maxContestants || population.length < population.length ? maxContestants : population.length;
//         //console.log(numContestants);
//         let tournamentSize = randomIntBetween(2, numContestants);
//         let tournament = [];
//         for (let j = 0; j < tournamentSize; j++) {
//             let index = randomIntBetween(0, population.length-1);
//             tournament.push(population[index]);
//         }
//         tournament.sort((a, b) => a.fitness - b.fitness);
//         parents.push(tournament[0]);
//     }
//     return parents;
// }

// function randomWayTournamentSelection(population=[], numParents=2, numContestants=null) {
//     let parents = [];
//     for (let i = 0; i < numParents; i++) {
//         let tournamentSize = numContestants || randomIntBetween(2, population.length);
//         let tournament = [];
//         for (let j = 0; j < tournamentSize; j++) {
//             let index = randomIntBetween(0, population.length-1);
//             tournament.push(population[index]);
//         }
//         tournament.sort((a, b) => a.fitness - b.fitness);
//         parents.push(tournament[0]);
//     }
//     return parents;
// }


function nWayTournamentSelection(population=[], numParents=2, tournamentSize=2) {
    let parents = [];
    for (let i = 0; i < numParents; i++) {
        let tournament = [];
        for (let j = 0; j < tournamentSize; j++) {
            let randomIndex = randomIntBetween(0, population.length-1);
            tournament.push(population[randomIndex]);
        }
        tournament.sort((a, b) => a.fitness - b.fitness);
        parents.push(tournament[0]);
    }
    return parents;
}

function truncationSelection(population, numParents=2, matingNum=2) {
    let parents = [];
    population.sort((a, b) => a.fitness - b.fitness);
    for (let i = 0; i < numParents; i++) {
        let rnd = randomInt(0, matingNum); // TODO: take matingNum as parameter
        let individual = population[rnd];
        parents.push(individual);
    }
    return parents;
}


// Linear search approach
// function pickOne(list) {
//     let totalProb = 0;
//     for (let item of list) {
//       totalProb += item.prob;
//     }
  
//     let randomProb = Math.random() * totalProb;
//     let cumulativeProb = 0;
  
//     for (let item of list) {
//       cumulativeProb += item.prob;
//       if (randomProb <= cumulativeProb) {
//         return item;
//       }
//     }
//   }
  
  // Simplified linear search approach
  // function pickOne(list) {
  //   let randomProb = Math.random();
  //   let cumulativeProb = 0;
  
  //   for (let item of list) {
  //     cumulativeProb += item.prob;
  //     if (randomProb <= cumulativeProb) {
  //       return item;
  //     }
  //   }
  // }


// ******************************************************
//   Crossover functions
// ******************************************************

function uniformCrossover(parentGenes=[], numChildren=1) {
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

function onePointCrossover(genesA, genesB, numChildren=1) {
    // Select one chunk of genes from either parent around a
    // randomized midpoint in the range [0, numGenes].
    // Sometimes all child genes will be from just one parent.
    // Selected genes keep their original order and position.
    let children = [];
    for (let i = 0; i < numChildren; i++) {
        let newGenes = [];
        let midpoint = randomIntBetween(0, genesA.length);
        for (let i = 0; i < genesA.length; i++) {
            if (i < midpoint) {
                newGenes.push(genesA[i]);
            } else {
                newGenes.push(genesB[i]);
            }
        }
        children.push(newGenes);
    }
    return children;
}

function nPointCrossover(genesA, genesB, numChildren=1) {
    // Select multiple chunks of genes from either parent around
    // randomized midpoints in the range [0, numGenes].
    // Sometimes all child genes will be from just one parent.
    // Selected genes keep their original order and position.
    let children = [];
    for (let i = 0; i < numChildren; i++) {
        let newGenes = [];
        let numMidpoints = randomIntBetween(1, genesA.length);
        let midpoints = [];
        for (let i = 0; i < numMidpoints; i++) {
            midpoints.push(randomIntBetween(0, genesA.length));
        }
        midpoints.sort();
        let parent = 0;
        for (let i = 0; i < genesA.length; i++) {
            if (i >= midpoints[parent]) {
                parent++;
            }
            if (parent % 2 == 0) {
                newGenes.push(genesA[i]);
            } else {
                newGenes.push(genesB[i]);
            }
        }
        children.push(newGenes);
    }
    return children;
}

function nPointCrossoverOrdered(parents, numChildren=1) {
    // Check if all parents have the same number of genes
    const geneLength = parents[0].genome.length;
    for (let i = 1; i < parents.length; i++) {
        if (parents[i].genome.length !== geneLength) {
            throw new Error("All parents must have the same number of genes");
        }
    }

    // Select multiple chunks of genes from each parent in order
    let children = [];
    for (let i = 0; i < numChildren; i++) {
        let newGenes = [];
        let numMidpoints = randomIntBetween(1, geneLength);
        let midpoints = [];
        for (let j = 0; j < numMidpoints; j++) {
            midpoints.push(randomIntBetween(0, geneLength));
        }
        midpoints.sort();
        let parent = 0;
        for (let j = 0; j < geneLength; j++) {
            if (j >= midpoints[parent]) {
                parent = (parent + 1) % parents.length;
            }
            newGenes.push(parents[parent][j]);
        }
        children.push(newGenes);
    }
    return children;
}

function nPointCrossoverRandom(parents, numChildren=1) {
    // Check if all parents have the same number of genes
    const geneLength = parents[0].genome.length;
    for (let i = 1; i < parents.genome.length; i++) {
        if (parents[i].length !== geneLength) {
            throw new Error("All parents must have the same number of genes");
        }
    }

    // Select multiple chunks of genes, parent for each chunk is chosen randomly
    let children = [];
    for (let i = 0; i < numChildren; i++) {
        let newGenes = [];
        let numMidpoints = randomIntBetween(1, geneLength);
        let midpoints = [];
        for (let j = 0; j < numMidpoints; j++) {
            midpoints.push(randomIntBetween(0, geneLength));
        }
        midpoints.sort();
        let parent = Math.floor(Math.random() * parents.length);
        for (let j = 0; j < geneLength; j++) {
            if (j >= midpoints[parent]) {
                parent = Math.floor(Math.random() * parents.length);
            }
            newGenes.push(parents[parent][j]);
        }
        children.push(newGenes);
    }
    return children;
}

// function uniformCrossover(parents=[], numChildren=1) {
//     // Check if all parents have the same number of genes
//     const geneLength = parents[0].genome.length;
//     for (let i = 1; i < parents.length; i++) {
//         if (parents[i].genome.length !== geneLength) {
//             throw new Error("All parents must have the same number of genes");
//         }
//     }

//     // Randomly select genes from any parent.
//     // Selected genes keep their original order and position.
//     let children = [];
//     for (let i = 0; i < numChildren; i++) {
//         let newGenes = [];
//         for (let j = 0; j < geneLength; j++) {
//             let parentIndex = Math.floor(Math.random() * parents.length);
//             newGenes.push(parents[parentIndex].genome[j]);
//         }
//         let individual = new Phrase(); // TODO: refactor Class literal out of function
//         individual.setGenome(newGenes); 
//         //console.log(individual);
//         children.push(individual);
//     }
//     return children;
// }

// function uniformCrossover(genesA, genesB, numChildren=1) {
//     // Randomly select genes from either parent.
//     // Selected genes keep their original order and position.
//     let children = [];
//         for (let i = 0; i < numChildren; i++) {
//         let newGenes = [];
//         for (let i = 0; i < genesA.length; i++) {
//             if (Math.random() < 0.5) {
//                 newGenes.push(genesA[i]);
//             } else {
//                 newGenes.push(genesB[i]);
//             }
//         }
//         children.push(newGenes);
//     }
//     return children;
// }

function zipperCrossover(genesA, genesB, numChildren=1) {
    // Select every other gene from different parents (like a zipper).
    // Randomly start with one or the other parent.
    // Selected genes keep their original order and position.
    let children = [];
    for (let i = 0; i < numChildren; i++) {
        let newGenes = [];
        let start = randomIntBetween(0, 1);
        for (let i = 0; i < genesA.length; i++) {
            if ((i + start) % 2 == 0) {
                newGenes.push(genesA[i]);
            } else {
                newGenes.push(genesB[i]);
            }
        }
        children.push(newGenes);
    }
    return children;
}

function wholeArithmeticRecombination(parents, numChildren=1) {
    // Check if all parents have the same number of genes
    const geneLength = parents[0].length;
    for (let i = 1; i < parents.length; i++) {
        if (parents[i].length !== geneLength) {
            throw new Error("All parents must have the same number of genes");
        }
    }

    // Randomly weighted linear interpolation between two randomly selected parent genes.
    let children = [];
    for (let i = 0; i < numChildren; i++) {
        let newGenes = [];
        for (let j = 0; j < geneLength; j++) {
            let parentIndices = [];
            while (parentIndices.length < 2) {
                let randomIndex = Math.floor(Math.random() * parents.length);
                if (!parentIndices.includes(randomIndex)) {
                    parentIndices.push(randomIndex);
                }
            }
            let gene = lerp(parents[parentIndices[0]][j], parents[parentIndices[1]][j], Math.random());
            newGenes.push(gene);
        }
        children.push(newGenes);
    }
    return children;
}

// function wholeArithmeticRecombination(genesA, genesB, numChildren=1) {
//     // Randomly weighted linear interpolation between parent genes.
//     let children = [];
//     for (let i = 0; i < numChildren; i++) {
//         let newGenes = [];
//         for (let i = 0; i < genesA.length; i++) {
//             let gene = lerp(genesA[i], genesB[i], Math.random());
//             newGenes.push(gene);
//         }
//         children.push(newGenes);
//     }
//     return children;
// }

// function wholeArithmeticRecombination(parents, numChildren=1) {
//     // Check if all parents have the same number of genes
//     const geneLength = parents[0].length;
//     for (let i = 1; i < parents.length; i++) {
//         if (parents[i].length !== geneLength) {
//             throw new Error("All parents must have the same number of genes");
//         }
//     }

//     // Randomly weighted circular interpolation between parent genes.
//     let children = [];
//     for (let i = 0; i < numChildren; i++) {
//         let newGenes = [];
//         for (let j = 0; j < geneLength; j++) {
//             let angles = parents.map(parent => parent[j] * 2 * Math.PI / geneLength);
//             let avgAngle = averageAngle(angles);
//             let gene = geneLength * avgAngle / (2 * Math.PI);
//             newGenes.push(gene);
//         }
//         children.push(newGenes);
//     }
//     return children;
// }

// function averageAngle(angles) {
//     let sin = angles.map(Math.sin).reduce((a, b) => a + b) / angles.length;
//     let cos = angles.map(Math.cos).reduce((a, b) => a + b) / angles.length;
//     return Math.atan2(sin, cos);
// }

// function wholeArithmeticRecombination(parentGenes, numChildren=1) {
//     // Check if all parents have the same number of genes
//     const geneLength = parentGenes[0].length;
//     for (let i = 1; i < parentGenes.length; i++) {
//         if (parentGenes[i].length !== geneLength) {
//             throw new Error("All parents must have the same number of genes");
//         }
//     }

//     // Randomly weighted linear interpolation between parent genes.
//     let children = [];
//     for (let i = 0; i < numChildren; i++) {
//         let newGenes = [];
//         for (let j = 0; j < geneLength; j++) {
//             let gene = 0;
//             for (let k = 0; k < parentGenes.length; k++) {
//                 gene += lerp(parentGenes[k][j], parentGenes[(k+1)%parentGenes.length][j], Math.random());
//             }
//             gene /= parentGenes.length;
//             newGenes.push(gene);
//         }
//         children.push(newGenes);
//     }
//     return children;
// }

function davisOrderCrossover(genesA, genesB) {
    
}

function partiallyMappedCrossover(genesA, genesB) {

}

function orderBasedCrossover(genesA, genesB) {

}

function shuffleCrossover(genesA, genesB) {
    
}

function ringCrossover(genesA, genesB) {

}


// ******************************************************
//   Mutation functions
// ******************************************************

function bitFlipMutation(genes) {
    // Used for binary representation
}

function randomizeMutation(individualGenes) {
    for (let i = 0; i < individualGenes.length; i++) {
        let gene = individualGenes[i];
        for(let i = 0; i < gene.length; i++) {
            if(Math.random() < this.mutationChance) {
                gene[i] = Math.random();
            }
        }
    }
}

// function randomizeMutation(individuals) {
//     //console.log(individuals);
//     for (let i = 0; i < individuals.length; i++) {
//         let individual = individuals[i];
//         for(let i = 0; i < individual.genome.length; i++) {
//             if(Math.random() < this.mutationChance) {
//                 //individual.value[i] = newChar();
//                 individual.value = setCharAt(individual.value, i, randomChar());
//             }
//         }
//         individual.genome = individual.encode(individual.value);
//     }
// }

function randomResettingMutation(genes) {

}

function swapMutation(genes) {
    let numSwaps = randomIntBetween(1, genes.length);
    for (let i = 0; i < numSwaps; i++) {
        let indexA = randomIntBetween(0, genes.length);
        let indexB = randomIntBetween(0, genes.length);
        let temp = genes[indexA];
        genes[indexA] = genes[indexB];
        genes[indexB] = temp;
    }
}

function scambleMutation(genes) {
    // Randomly shuffle the order of genes
    fisherYatesShuffle(genes);
}

function inversionMutation(genes) {
    // Inverse gene order in a random chunk of genes
    let start = randomIntBetween(0, genes.length);
    let end = randomIntBetween(0, genes.length);
    if (start > end) {
        let temp = start;
        start = end;
        end = temp;
    }  
    let chunk = genes.slice(start, end);
    chunk.reverse();
    genes.splice(start, end - start, ...chunk);
}
