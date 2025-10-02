function nextGeneration() {
	console.log('next generation');
	
	calculateFitness();
	
	for (let i = 0; i < NUM_SHIPS; i++) {
		ships[i] = pickOne();
	}
	
	for (let i = 0; i < NUM_SHIPS; i++) {
		savedShips[i].dispose();
	}
	savedShips = [];
}

function pickOne() {
	//console.log(savedShips.length);
	let index = 0;
	let r = random(0, 1);
	//console.log("r: ", r);
	while (r > 0) {
		//console.log(savedShips[index])
		r = r - savedShips[index].fitness;
		index++;
	}
	index--;
	let ship = savedShips[index];
	let child = new Ufo(ship.brain);
	//console.log("child: ", child);
	child.mutate();
	return child;
}

function calculateFitness() {
	// Find max score value for all ships
	// let max = 0;
	// for (let ship of savedShips) {
	// 	if (ship.score > max) {
	// 		max = ship.score;
	// 	}
	// }

	// // calculate fitness as a percentage of max fitness
	// for (let ship of savedShips) {
	// 	ship.fitness = ship.score / max;
	// 	console.log("score: ", ship.score, "fitness: ", ship.fitness);
	// }

	let sum = 0;
	for (let ship of savedShips) {
		sum += ship.score;
	}
	for (let ship of savedShips) {
		ship.fitness = ship.score / sum;
		//console.log("score: ", ship.score, "fitness: ", ship.fitness);
	}
}