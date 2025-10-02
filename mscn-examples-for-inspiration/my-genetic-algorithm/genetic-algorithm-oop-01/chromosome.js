
class Chromosome {
    constructor(genes) {
        this.mutationRate = 0.01;
        this.geneMinVal = -1.0;
        this.geneMaxVal = 1.0;
        if (Array.isArray(genes)) {
            this.genes = genes;
        } else {
            this.genes = new Array(genes).fill(0.0);
        }
    }
    randomizeGenes(min = this.geneMinVal, max = this.geneMaxVal) {
        for (let i = 0; i < this.genes.length; i++) {
            this.genes[i] = randomFloatBetween(min, max);
        }
    }
    // randomizeGenes(func) {
    //     for (let i = 0; i < this.genes.length; i++) {
    //         this.genes[i] = func();
    //     }
    // }
    mutateGenes(min = this.geneMinVal, max = this.geneMaxVal) {
        for (let i = 0; i < this.genes.length; i++) {
            if (Math.random() < this.mutationRate) {
                this.genes[i] = randomFloatBetween(min, max);
            }
        }
    }
    // mutateGenes(func) {
    //     for (let i = 0; i < this.genes.length; i++) {
    //         if (Math.random() < this.mutationRate) {
    //             this.genes[i] = func();
    //         }
    //     }
    // }
    shuffleGenes() {
        // Fisher-Yates shuffle.
        // Genes do not keep their original order or position.
        shuffleArray(this.genes);
    }
    crossoverRandom(chromosome) {
        // Randomly select genes from either parent.
        // Selected genes keep their original order and position.
        let newGenes = [];
        for (let i = 0; i < this.genes.length; i++) {
            if (Math.random() < 0.5) {
                newGenes.push(this.genes[i]);
            } else {
                newGenes.push(chromosome.genes[i]);
            }
        }
        return new Chromosome(newGenes);
    }
    crossoverRandomMidpoint(chromosome) {
        // Select one chunk of genes from either parent around a
        // randomized midpoint in the range [0, numGenes].
        // Sometimes all child genes will be from just one parent.
        // Selected genes keep their original order and position.
        let newGenes = [];
        let midpoint = randomIntBetween(0, this.genes.length);
        for (let i = 0; i < this.genes.length; i++) {
            if (i < midpoint) {
                newGenes.push(this.genes[i]);
            } else {
                newGenes.push(chromosome.genes[i]);
            }
        }
        return new Chromosome(newGenes);
    }
    crossoverCenterMidpoint(chromosome) {
        // Select 50% of genes from either parent around the center.
        // Selected genes keep their original order and position.
        let newGenes = [];
        let midpoint = Math.floor(this.genes.length / 2) ;
        console.log(midpoint);
        for (let i = 0; i < this.genes.length; i++) {
            if (i < midpoint) {
                newGenes.push(this.genes[i]);
            } else {
                newGenes.push(chromosome.genes[i]);
            }
        }
        return new Chromosome(newGenes);
    }
    crossoverZipper(chromosome) {
        // Select every other gene from different parents (like a zipper).
        // Selected genes keep their original order and position.
        let newGenes = [];
        for (let i = 0; i < this.genes.length; i++) {
            if (i % 2 == 0) {
                newGenes.push(this.genes[i]);
            } else {
                newGenes.push(chromosome.genes[i]);
            }
        }
        return new Chromosome(newGenes);
    }
    crossover(chromosome, func) {
        // Select genes from either parent using a custom function.
        // Selected genes keep their original order and position.
        let newGenes = [];
        for (let i = 0; i < this.genes.length; i++) {
            if (func(i)) {
                newGenes.push(this.genes[i]);
            } else {
                newGenes.push(chromosome.genes[i]);
            }
        }
        return new Chromosome(newGenes);
    }
}