function nextGeneration() {
	console.log('next generation');
	calculateFitness();
	for (let i = 0; i < TOTAL; i++) {
		cars[i] = pickOne();
	}
	for (let i = 0; i < TOTAL; i++) {
		savedCars[i].dispose();
	}
	savedCars = [];
}

function pickOne() {
	let index = 0;
	let r = random(1);
	while (r > 0) {
		r = r - savedCars[index].fitness;
		index++;
	}
	index--;
	let car = savedCars[index];
	let child = new Car(car.brain);
	child.mutate();
	return child;
}

function calculateFitness() {
	let sum = 0;
	for (let car of savedCars) {
		sum += car.score;
	}
	for (let car of savedCars) {
		car.fitness = car.score / sum;
	}
}