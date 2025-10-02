// const car = new Car(650, 400, 270);

let startX = null;
let startY = null;
let endX = null;
let endY = null;

let closestX;
let closestY;

const DT = 0.1;
const TOTAL = 50;
let UPDATES_PER_FRAME = 4;

let spaceShip = [];
let savedSpaceShips = [];

let generation = 0;

function setup() {
	createCanvas(800, 800);

	tf.setBackend('cpu');

	for (let i = 0; i < TOTAL; i++) {
		spaceShip[i] = new Spaceship();
	}
}

function draw() {
	background(220);

	for (let car of spaceShip) {
		car.draw();
	}

	for (let wall of walls) {
		wall.draw();
	}

	for (let checkpoint of checkpoints) {
		checkpoint.draw();
	}

	handleMapEditor();

	for (let n = 0; n < UPDATES_PER_FRAME; n++) {
		for (let i = spaceShip.length - 1; i >= 0; i--) {
			if (
					spaceShip[i].outsideScreen() || 
					spaceShip[i].updatesSinceLastCheckpoint > 500 || 
					spaceShip[i].rounds > 3) {

				savedSpaceShips.push(spaceShip.splice(i, 1)[0]);
			}
		}

		for (let car of spaceShip) {
			car.think();
			car.move();
		}

		if (spaceShip.length === 0) {
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

function mousePressed() {
	if (keyIsDown(17)) {

		console.log(mouseX, mouseY);

		checkpoints.push(new Checkpoint(mouseX, mouseY));

		return;
	}
	if (startX === null) {
		startX = closestX;
		startY = closestY;
	} else {
		endX = closestX;
		endY = closestY;

		console.log(startX, startY, endX, endY);

		walls.push(new Wall(startX, startY, endX, endY));

		startX = null;
		startY = null;
		endX = null;
		endY = null;
	}
}