function nextGeneration() {
	console.log('next generation');
	
	calculateFitness();
	
	for (let i = 0; i < TOTAL; i++) {
		spaceShips[i] = pickOne();
	}
	
	for (let i = 0; i < TOTAL; i++) {
		savedSpaceShips[i].dispose();
	}
	savedSpaceShips = [];
}

function pickOne() {
	let index = 0;
	let r = random(1);
	while (r > 0) {
		r = r - savedSpaceShips[index].fitness;
		index++;
	}
	index--;
	let car = savedSpaceShips[index];
	let child = new Spaceship(car.brain);
	child.mutate();
	return child;
}

function calculateFitness() {
	let sum = 0;
	for (let car of savedSpaceShips) {
		sum += car.score;
	}
	for (let car of savedSpaceShips) {
		car.fitness = car.score / sum;
	}
}