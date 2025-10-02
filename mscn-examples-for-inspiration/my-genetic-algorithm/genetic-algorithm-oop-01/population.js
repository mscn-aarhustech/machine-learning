
class Population {
    constructor() {
        this.entities = [];
    }
    pickEntity(entities = this.entities) {
        // Linear search approach
        let totalFitness = 0;
        for (let entity of entities) {
            totalFitness += entity.fitness;
        }
        let randomFitness = Math.random() * totalFitness;
        let cumulativeFitness = 0;
        for (let entity of entities) {
            cumulativeFitness += entity.fitness;
            if (randomFitness <= cumulativeFitness) {
                return entity;
            }
        }
    }
    pickEntitySimple() {
        // Simplified linear search approach
        let randomFitness = Math.random();
        let cumulativeFitness = 0;
        for (let entity of this.entities) {
            cumulativeFitness += entity.fitness;
            if (randomFitness <= cumulativeFitness) {
                return entity;
            }
        }
    }
    calculateFitness() {
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].calculateFitness();
        }
    }
    normalizeFitness() {
        let maxFitness = 0;
        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i].fitness > maxFitness) {
                maxFitness = this.entities[i].fitness;
            }
        }
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].fitness /= maxFitness;
        }
    }
}