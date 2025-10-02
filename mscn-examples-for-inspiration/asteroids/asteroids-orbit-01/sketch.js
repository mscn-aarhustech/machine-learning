
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

	for (let wall of walls) {
		wall.draw();
	}

	for (let checkpoint of checkpoints) {
		checkpoint.draw();
	}

	for (let planet of planets) {
		planet.draw();
	}

	for (let n = 0; n < UPDATES_PER_FRAME; n++) {
		for (let i = spaceShips.length - 1; i >= 0; i--) {
			if (
					spaceShips[i].toNeptune() || 
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

function handleMapEditor() {
	if (keyIsDown(17)) {

		fill(0, 255, 0, 50);
		ellipse(mouseX, mouseY, 100);
	}

	if (keyIsDown(16)) {
		let closestDist = Infinity;
		for (let wall of walls) {
			let dist1 = dist(mouseX, mouseY, wall.x1, wall.y1);
			let dist2 = dist(mouseX, mouseY, wall.x2, wall.y2);
			if (dist1 < closestDist) {
				closestDist = dist1;
				closestX = wall.x1;
				closestY = wall.y1;
			}
			if (dist2 < closestDist) {
				closestDist = dist2;
				closestX = wall.x2;
				closestY = wall.y2;
			}

		}
		fill(255, 0, 0);
		ellipse(closestX, closestY, 20);
	} else {
		closestX = mouseX;
		closestY = mouseY;
	}

	if (startX !== null) {
		fill(255, 0, 0);
		line(startX, startY, closestX, closestY);
	}
}