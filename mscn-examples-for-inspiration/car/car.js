class Car {
	constructor(brain) {
		this.x = 650;
		this.y = 400;
		this.angle = 270;
		this.maxSpeed = 8;
		this.speed = this.maxSpeed;
		this.rayLength = 300;
		this.score = 0;
		this.fitness = 0;
		this.currentCheckpoint = 0;
		this.rounds = 0;

		this.turningSpeed = 12;

		this.updatesSinceLastCheckpoint = 0;

		if (brain) {
			this.brain = brain.copy();
		} else {
			this.brain = new NeuralNetwork(3, 24, 2);
		}
	}

	dispose() {
		this.brain.dispose();
	}

	mutate() {
		this.brain.mutate(0.1);
	}

	think() {
		let inputs = [];
		// inputs[0] = this.raycast(walls, -90);
		// inputs[1] = this.raycast(walls, -45);
		// inputs[2] = this.raycast(walls, -20);
		// inputs[3] = this.raycast(walls, 0);
		// inputs[4] = this.raycast(walls, 20);
		// inputs[5] = this.raycast(walls, 45);
		// inputs[6] = this.raycast(walls, 90);

		inputs[0] = this.raycast(walls, -45);
		inputs[1] = this.raycast(walls, 0);
		inputs[2] = this.raycast(walls, 45);

		let output = this.brain.predict(inputs);

		if (isNaN(output[0]))
			output[0] = 0;
		if (isNaN(output[1]))
			output[1] = 0;

		this.angle -= (output[0] - 0.5) * this.turningSpeed;
		this.speed = this.maxSpeed * output[1];
	}

	draw() {
		fill(0, 255, 0);
		push()
		translate(this.x, this.y);
		angleMode(DEGREES);
		rotate(this.angle);
		rectMode(CENTER);
		rect(0, 0, 20, 10);
		pop();
	}

	move() {
		this.x += cos(this.angle) * this.speed;
		this.y += sin(this.angle) * this.speed;

		if (this.hitsCheckpoint()) {
			this.currentCheckpoint++;
			this.score += 1000 + (100 - this.updatesSinceLastCheckpoint) * 3;
			if (this.currentCheckpoint === checkpoints.length) {
				this.currentCheckpoint = 0;
				this.rounds++;
			}
			this.updatesSinceLastCheckpoint = 0;
		} else {
			this.updatesSinceLastCheckpoint++;
		}

		// console.log(this.speed)
	}

	raycast(walls, angle) {
		let closestDist = Infinity;
		let closestWall = null;
		let closestIntersectPoint = null;

		let straightX = cos(this.angle + angle) * this.rayLength;
		let straightY = sin(this.angle + angle) * this.rayLength;

		// fill(0, 0, 0, 50);
		// line(this.x, this.y, this.x + straightX, this.y + straightY);

		for (let wall of walls) {
			const intersectPoint = lineIntersect(this.x, this.y, this.x + straightX, this.y + straightY, wall.x1, wall.y1, wall.x2, wall.y2);

			if (!intersectPoint) { continue; }

			const { x, y } = intersectPoint;


			const dist1 = dist(this.x, this.y, x, y);

			if (dist1 < closestDist) {
				closestDist = dist1;
				closestWall = wall;
				closestIntersectPoint = intersectPoint;
			}
		}

		if (closestIntersectPoint !== null) {
			// fill(0, 255, 0);
			// ellipse(closestIntersectPoint.x, closestIntersectPoint.y, 5);
		}

		return closestDist;
	}

	hits() {
		for (let wall of walls) {
			const interceptPoints = inteceptCircleLineSeg(this.x, this.y, 10, wall.x1, wall.y1, wall.x2, wall.y2);

			if (interceptPoints.length === 0) { continue; }

			return true;
		}
		return false;
	}

	hitsCheckpoint() {
		return checkpoints[this.currentCheckpoint].hits(this);
	}
}