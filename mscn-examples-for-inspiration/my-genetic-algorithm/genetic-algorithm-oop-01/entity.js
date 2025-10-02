
class Entity {
    constructor(chromosome) {
        this.score = 0;
        this.fitness = 0;
        this.chromosome = chromosome;
    }
    calculateFitness() {
        this.fitness = Math.pow(this.score, 4);
    }
}