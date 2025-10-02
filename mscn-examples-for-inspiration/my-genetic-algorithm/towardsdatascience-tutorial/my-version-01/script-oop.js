class Individual {
    constructor() {
        this.fitness = 0;
        this.genes = Array.from({length: 5}, () => Math.random() > 0.5 ? 1 : 0);
        this.geneLength = 5;
    }

    calcFitness() {
        this.fitness = this.genes.reduce((acc, gene) => gene === 1 ? acc + 1 : acc, 0);
    }
}

class Population {
    constructor() {
        this.popSize = 10;
        this.individuals = Array.from({length: this.popSize}, () => new Individual());
        this.fittest = 0;
    }

    initializePopulation(size) {
        this.individuals = Array.from({length: size}, () => new Individual());
    }

    getFittest() {
        let maxFitIndex = this.individuals.reduce((maxIndex, individual, currentIndex) => 
            individual.fitness > this.individuals[maxIndex].fitness ? currentIndex : maxIndex, 0);
        this.fittest = this.individuals[maxFitIndex].fitness;
        return this.individuals[maxFitIndex];
    }

    getSecondFittest() {
        let indices = [0, 0];
        this.individuals.forEach((individual, index) => {
            if (individual.fitness > this.individuals[indices[0]].fitness) {
                indices[1] = indices[0];
                indices[0] = index;
            } else if (individual.fitness > this.individuals[indices[1]].fitness) {
                indices[1] = index;
            }
        });
        return this.individuals[indices[1]];
    }

    getLeastFittestIndex() {
        return this.individuals.reduce((minIndex, individual, currentIndex) => 
            individual.fitness < this.individuals[minIndex].fitness ? currentIndex : minIndex, 0);
    }

    calculateFitness() {
        this.individuals.forEach(individual => individual.calcFitness());
        this.getFittest();
    }
}

class SimpleDemoGA {
    constructor() {
        this.population = new Population();
        this.fittest = null;
        this.secondFittest = null;
        this.generationCount = 0;
    }

    selection() {
        this.fittest = this.population.getFittest();
        this.secondFittest = this.population.getSecondFittest();
    }

    crossover() {
        let crossOverPoint = Math.floor(Math.random() * this.population.individuals[0].geneLength);
        for (let i = 0; i < crossOverPoint; i++) {
            let temp = this.fittest.genes[i];
            this.fittest.genes[i] = this.secondFittest.genes[i];
            this.secondFittest.genes[i] = temp;
        }
    }

    mutation() {
        let mutationPoint = Math.floor(Math.random() * this.population.individuals[0].geneLength);

        // Flip values at the mutation point
        this.fittest.genes[mutationPoint] = this.fittest.genes[mutationPoint] === 0 ? 1 : 0;
        this.secondFittest.genes[mutationPoint] = this.secondFittest.genes[mutationPoint] === 0 ? 1 : 0;
    }

    addFittestOffspring() {
        // Update fitness values of parents
        this.fittest.calcFitness();
        this.secondFittest.calcFitness();

        // Check if any of the parents is the best solution so far
        if (this.fittest.fitness > this.population.fittest) {
            this.population.fittest = this.fittest.fitness;
        }
        if (this.secondFittest.fitness > this.population.fittest) {
            this.population.fittest = this.secondFittest.fitness;
        }

        // Replace least fit individual from population with the fittest offspring
        this.population.individuals[this.population.getLeastFittestIndex()] = this.fittest;
    }
}

// Main function
function main() {
    let demo = new SimpleDemoGA();

    // Initialize population
    demo.population.initializePopulation(10);

    // Calculate fitness of each individual
    demo.population.calculateFitness();

    console.log("Generation: " + demo.generationCount + " Fittest: " + demo.population.fittest);

    // While population gets an individual with maximum fitness
    //while (demo.population.fittest < 5) {
    for (let i = 0; i < 50; i++) {
        ++demo.generationCount;

        // Do selection
        demo.selection();

        // Do crossover
        demo.crossover();

        // Do mutation under a random probability
        if (Math.random() <= 0.5) {
            demo.mutation();
        }

        // Add fittest offspring to population
        demo.addFittestOffspring();

        // Calculate new fitness value
        demo.population.calculateFitness();

        console.log("Generation: " + demo.generationCount + " Fittest: " + demo.population.fittest);
    }

    console.log("\nSolution found in generation " + demo.generationCount);
    console.log("Fitness: " + demo.population.fittest);
}

main();