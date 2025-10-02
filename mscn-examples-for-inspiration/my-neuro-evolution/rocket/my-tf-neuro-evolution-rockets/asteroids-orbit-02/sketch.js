
// Gravitational constalt
const G = 2.0;

// Time step
const DT = 0.1;
const TOTAL = 100;
let UPDATES_PER_FRAME = 4;

const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 800;
const BORDER = 400;

let spaceShips = [];
let savedSpaceShips = [];

let generation = 0;

function setup() {
	createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);

	tf.setBackend('cpu');

	for (let i = 0; i < TOTAL; i++) {
		spaceShips[i] = new Spaceship();
	}
}

function draw() {
	background(64, 64+16, 64+32);

	for (let car of spaceShips) {
		car.draw();
	}

	for (let planet of planets) {
		planet.draw();
	}

	for (let n = 0; n < UPDATES_PER_FRAME; n++) {
		for (let i = spaceShips.length - 1; i >= 0; i--) {
			if (
					spaceShips[i].outsideScreen() || 
					spaceShips[i].crashlandsOnPlanet() ) 
				{
				
				savedSpaceShips.push(spaceShips.splice(i, 1)[0]);
			}
		}

		applyGravity();

		for (let car of spaceShips) {
			car.think();
			car.move();
		}

		if (spaceShips.length === 0) {
			nextGeneration();
			generation++;
		}
	}
}
