

function crossoverFunc(i) {
    return i % 2 == 0;
}

let chromo1 = new Chromosome(4);
let chromo2 = new Chromosome(4);

chromo1.randomizeGenes(1, 1);
chromo2.randomizeGenes(2, 2);

console.table(chromo1.genes);
console.table(chromo2.genes);

//let chromoChild = chromo1.crossoverCenterMidpoint(chromo2); // Works
//let chromoChild = chromo1.crossoverRandomMidpoint(chromo2); // Works
//let chromoChild = chromo1.crossoverZipper(chromo2); // Works
//let chromoChild = chromo1.crossoverRandom(chromo2); // Works
let chromoChild = chromo1.crossover(chromo2, crossoverFunc); // Works

console.table(chromoChild.genes);


chars = "";
for(let i = 0; i < 1000; i++) {
    chars += randomAsciiLetter();
}
console.log(chars);