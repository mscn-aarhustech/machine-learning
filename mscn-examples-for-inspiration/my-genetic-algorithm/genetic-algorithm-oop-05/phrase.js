"use strict";

class Phrase {
    constructor(genome) {
        this.fitness = null;
        //this.targetValue = "To be or not to be.";
        //this.targetValue = "The quick brown fox jumps over the lazy dog.";
        this.targetValue = "Insanity is doing the same thing over and over again and expecting different results.";
        this.targetGenome = this.encode(this.targetValue);
        if (genome) {
            this.setGenome(genome);
        } else {
            let genome = this.createRandomGenome();
            this.setGenome(genome);
        }
        Phrase.calculateFitness(this);
    }
    static createInstance(genome) {
        if (genome) {
            return new Phrase(genome);
        } else {
            return new Phrase();
        }
    }
    static calculateFitness(phrase) {

        // Calculate fitness from genome deviation
        // let fitness = 0;
        // for(let i = 0; i < phrase.value.length; i++) {
        //     fitness += Math.abs(phrase.genome[i] - phrase.targetGenome[i]);
        // }
        // phrase.fitness = fitness;

        // Calculate fitness from string value deviation
        let fitness = 0;
        for (let i = 0; i < phrase.value.length; i++) {
            if (phrase.value[i] != phrase.targetValue[i]) {
                fitness++;
            }
        }
        phrase.fitness = fitness;
    }
    createRandomGenome() {
        let genome = [];
        for (let i = 0; i < this.targetValue.length; i++) {
            let gene = Math.random();
            genome.push(gene);
        }
        return genome;
    }
    setValue(value) {
        this.value = value;
        this.genome = this.encode(value);
    }
    setGenome(genome) {
        this.genome = genome;
        this.value = this.decode(genome);
    }
    encode(value) {
        // Encode a string value into a genome of floats [0, 1]
        let genome = [];
        for (let i = 0; i < value.length; i++) {
            let gene = map(value.charCodeAt(i), 0, 255, 0, 1);
            //gene = round(gene, 3); // 3 decimals is enough for 255 values
            //gene = Number(gene.toFixed(3));
            genome.push(gene);
        }
        return genome;
    }
    decode(genome) {
        // Decode a genome of floats [0, 1] into a string value
        let value = "";
        for (let i = 0; i < genome.length; i++) {
            let gene = Math.round(map(genome[i], 0, 1, 0, 255));
            value += String.fromCharCode(gene);
        }
        return value;
    }
}