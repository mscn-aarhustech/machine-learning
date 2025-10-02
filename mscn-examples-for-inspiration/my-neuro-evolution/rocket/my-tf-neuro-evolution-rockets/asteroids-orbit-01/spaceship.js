class Spaceship {
	constructor(brain) {
		this.posx = SCREEN_HEIGHT / 8;
		this.posy = SCREEN_WIDTH / 2;
		this.velx = 0;
		this.vely = 0;
		this.angle = 0;
		this.anglex = Math.cos(this.angle);
		this.angley = Math.sin(this.angle);
		this.maxThrust = 1;
		this.thrust = 0;
		this.score = 0;
		this.fitness = 0;
		this.turningSpeed = 0.1; // Math.PI * 1.5;
		this.mass = 1;
		this.ticksAlive = 0;
		this.updates = 0;
		this.mutationRate = 0.1;

		if (brain) {
			this.brain = brain.copy();
		} else {
			this.brain = new NeuralNetwork(6, 32, 3);
		}
	}

	dispose() {
		this.brain.dispose();
	}

	mutate() {
		this.brain.mutate(this.mutationRate);
	}

	think() {
		
		let inputs = [];

		// Input version where all inputs are x, y pairs
		// non-normalized distance vector to checkpoint
		inputs[0] = planets[0].posx - this.posx;
		inputs[1] = planets[0].posy - this.posy;
		// non-normalized velocity vector
		inputs[2] = this.velx;
		inputs[3] = this.vely;
		// non-normalized spaceship angle vector
		inputs[4] = this.anglex;
		inputs[5] = this.angley;

		// Input version where all inputs are split into angle and distance/magnitude
		// angle to checkpoint
		// inputs[0] = Math.atan2(checkpoints[this.currentCheckpoint].y - this.posy, checkpoints[this.currentCheckpoint].x - this.posx);
		// distance to checkpoint
		// inputs[1] = dist(this.posx, this.posy, checkpoints[this.currentCheckpoint].x, checkpoints[this.currentCheckpoint].y);
		// angle to velocity
		// inputs[2] = Math.atan2(this.vely, this.velx);
		// magnitude of velocity
		// inputs[3] = dist(0, 0, this.velx, this.vely);
		// angle to spaceship
		// inputs[4] = this.angle;

		let output = this.brain.predict(inputs);

		if (isNaN(output[0]))
			output[0] = 0;
		if (isNaN(output[1]))
			output[1] = 0;
		if (isNaN(output[2]))
			output[2] = 0;

		// this.angle = output[0] * Math.PI * 2;

		// this.anglex = Math.cos(this.angle);
		// this.angley = Math.sin(this.angle);
		this.anglex = (output[0] - 0.5) * 2.0;
		this.angley = (output[1] - 0.5) * 2.0;

		this.angle = Math.atan2(this.angley, this.anglex);
		//this.angle = output[0] * Math.PI * 2;
		//this.thrust = this.maxThrust * output[1];
		this.thrust = output[2] * this.maxThrust;
	}

	draw() {
		
		fill(0, 255, 0);
		//stroke(255, 0, 0, 64);
		//line(this.posx, this.posy, checkpoints[this.currentCheckpoint].x, checkpoints[this.currentCheckpoint].y);
		push()
		stroke(0, 0, 0);
		translate(this.posx, this.posy);
		angleMode(RADIANS);
		rotate(this.angle - Math.PI * 0.5);
		//rectMode(CENTER);
		//rect(0, 0, 20, 10);
		//triangle(30, 75, 58, 20, 86, 75);
		triangle(-5, -5, 5, -5, 0, 15);
		// fill(255, 128, 0);
		// ellipse(0, this.thrust * -10, 5, this.thrust * 10);
		// line between ship and current checkpoint
		pop();
		// a red line between ship and current checkpoint
		
	}

	move() {

		this.velx += this.thrust * this.anglex * DT;
		this.vely += this.thrust * this.angley * DT;

		this.posx += this.velx * DT;
		this.posy += this.vely * DT;

		if(this.crashlandsOnPlanet() || this.toNeptune()) {
			this.score -= 1000;
		}

		this.score += 10;

		// if (this.hitsCheckpoint()) {
		// 	this.currentCheckpoint++;
		// 	this.score += 1000; //+ (100 - this.updatesSinceLastCheckpoint) * 3;
		// 	if (this.currentCheckpoint === checkpoints.length) {
		// 		this.currentCheckpoint = 0;
		// 		this.rounds++;
		// 	}
		// 	this.updatesSinceLastCheckpoint = 0;
		// } else {
		// 	this.updatesSinceLastCheckpoint++;
		// }

		// console.log(this.thrust)
	}

	// raycast(walls, angle) {
	// 	let closestDist = Infinity;
	// 	let closestWall = null;
	// 	let closestIntersectPoint = null;

	// 	let straightX = cos(this.angle + angle) * this.rayLength;
	// 	let straightY = sin(this.angle + angle) * this.rayLength;

	// 	// fill(0, 0, 0, 50);
	// 	// line(this.x, this.y, this.x + straightX, this.y + straightY);

	// 	for (let wall of walls) {
	// 		const intersectPoint = lineIntersect(this.x, this.y, this.x + straightX, this.y + straightY, wall.x1, wall.y1, wall.x2, wall.y2);

	// 		if (!intersectPoint) { continue; }

	// 		const { x, y } = intersectPoint;


	// 		const dist1 = dist(this.x, this.y, x, y);

	// 		if (dist1 < closestDist) {
	// 			closestDist = dist1;
	// 			closestWall = wall;
	// 			closestIntersectPoint = intersectPoint;
	// 		}
	// 	}

	// 	if (closestIntersectPoint !== null) {
	// 		// fill(0, 255, 0);
	// 		// ellipse(closestIntersectPoint.x, closestIntersectPoint.y, 5);
	// 	}

	// 	return closestDist;
	// }

	// hits() {
	// 	for (let wall of walls) {
	// 		const interceptPoints = inteceptCircleLineSeg(this.x, this.y, 10, wall.x1, wall.y1, wall.x2, wall.y2);

	// 		if (interceptPoints.length === 0) { continue; }

	// 		return true;
	// 	}
	// 	return false;
	// }

	// hitsCheckpoint() {
	// 	return checkpoints[this.currentCheckpoint].hits(this);
	// }

	outsideScreen() {
		return this.posx < 0 || this.posx > width || this.posy < 0 || this.posy > height;
	}

	toNeptune() {
		let distx = planets[0].posx - this.posx;
		let disty = planets[0].posy - this.posy;
		let dist = Math.sqrt(distx * distx + disty * disty);
		return dist > Math.sqrt(height * height + width * width) * 0.5;
	}

	crashlandsOnPlanet() {
		return dist(this.posx, this.posy, planets[0].posx, planets[0].posy) < planets[0].radius;
	}
}