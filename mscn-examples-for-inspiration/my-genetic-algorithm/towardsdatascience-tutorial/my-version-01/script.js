// Source: https://towardsdatascience.com/introduction-to-genetic-algorithms-including-example-code-e396e98d8bf3

// Individual class
function Individual() {
    this.fitness = 0;
    this.genes = new Array(5);
    this.geneLength = 5;

    for (let i = 0; i < this.genes.length; i++) {
        this.genes[i] = Math.abs(Math.random() < 0.5 ? 0 : 1);
    }

    this.fitness = 0;
}

Individual.prototype.calcFitness = function() {
    this.fitness = 0;
    for (let i = 0; i < 5; i++) {
        if (this.genes[i] == 1) {
            ++this.fitness;
        }
    }
};

// Population class
function Population() {
    this.popSize = 10;
    this.individuals = new Array(10);
    this.fittest = 0;

    for (let i = 0; i < this.individuals.length; i++) {
        this.individuals[i] = new Individual();
    }
}

Population.prototype.getFittest = function() {
    let maxFit = Number.MIN_SAFE_INTEGER;
    let maxFitIndex = 0;
    for (let i = 0; i < this.individuals.length; i++) {
        if (maxFit <= this.individuals[i].fitness) {
            maxFit = this.individuals[i].fitness;
            maxFitIndex = i;
        }
    }
    this.fittest = this.individuals[maxFitIndex].fitness;
    return this.individuals[maxFitIndex];
};

Population.prototype.getSecondFittest = function() {
    let maxFit1 = 0;
    let maxFit2 = 0;
    for (let i = 0; i < this.individuals.length; i++) {
        if (this.individuals[i].fitness > this.individuals[maxFit1].fitness) {
            maxFit2 = maxFit1;
            maxFit1 = i;
        } else if (this.individuals[i].fitness > this.individuals[maxFit2].fitness) {
            maxFit2 = i;
        }
    }
    return this.individuals[maxFit2];
};

Population.prototype.getLeastFittestIndex = function() {
    let minFitVal = Number.MAX_SAFE_INTEGER;
    let minFitIndex = 0;
    for (let i = 0; i < this.individuals.length; i++) {
        if (minFitVal >= this.individuals[i].fitness) {
            minFitVal = this.individuals[i].fitness;
            minFitIndex = i;
        }
    }
    return minFitIndex;
};

Population.prototype.calculateFitness = function() {
    for (let i = 0; i < this.individuals.length; i++) {
        this.individuals[i].calcFitness();
    }
    this.getFittest();
};

// Main function
function main() {
    let population = new Population();
    let fittest;
    let secondFittest;
    let generationCount = 0;

    population.calculateFitness();

    console.log("Generation: " + generationCount + " Fittest: " + population.fittest);

    //while (population.fittest < 5) {
    for (let i = 0; i < 50; i++) {
        ++generationCount;

        fittest = population.getFittest();
        secondFittest = population.getSecondFittest();

        let crossOverPoint = Math.floor(Math.random() * fittest.geneLength);
        for (let i = 0; i < crossOverPoint; i++) {
            let temp = fittest.genes[i];
            fittest.genes[i] = secondFittest.genes[i];
            secondFittest.genes[i] = temp;
        }

        if (Math.random() < 0.7) {
            let mutationPoint = Math.floor(Math.random() * fittest.geneLength);
            fittest.genes[mutationPoint] = fittest.genes[mutationPoint] == 0 ? 1 : 0;
            mutationPoint = Math.floor(Math.random() * secondFittest.geneLength);
            secondFittest.genes[mutationPoint] = secondFittest.genes[mutationPoint] == 0 ? 1 : 0;
        }

        fittest.calcFitness();
        secondFittest.calcFitness();

        population.individuals[population.getLeastFittestIndex()] = fittest.fitness > secondFittest.fitness ? fittest : secondFittest;

        population.calculateFitness();

        console.log("Generation: " + generationCount + " Fittest: " + population.fittest);
    }

    console.log("\nSolution found in generation " + generationCount);
    console.log("Fitness: "+population.getFittest().fitness);
    console.log("Genes: " + population.getFittest().genes.join(", "));
}

main();