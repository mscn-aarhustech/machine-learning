"use strict";

let nnParams = {
	layers : [6, 16, 3],
	activation : {
		//func : ActivationFunctions.sigmoidLike2,
		func : ActivationFunctions.tanhLike2,
	},
}

class Ship {
    constructor(brain){
		this.pos = new Vector2();
        this.frc = new Vector2();
        this.angle = 0.0;
		this.angleVector = new Vector2();
        this.mass = 1;
		//this.vel = circularOrbitVelocityVector(targets[0], this, G);
		this.vel = new Vector2();
		this.radius = 5;
        this.maxThrust = 0.05;
		this.thrust = 0;
        this.fitness = 0;
		this.ticksAlive = 0;
        
        if (brain) {
			this.brain = brain;
		} else {
			this.brain = new Network(null, nnParams);
		}

		this.init();
    }
	randomizePosition() {
		let border = 100;
		this.pos = new Vector2(border + Math.random() * (width - 2*border), border + Math.random() * (height - 2*border));
	}
	init() {
		// Rocket position
		// let radius = 400 + Math.random() * 100;
		// let angle = Math.random() * Math.PI * 2;
		// this.pos = new Vector2(targets[0].pos.add(new Vector2(Math.cos(angle) * radius, Math.sin(angle) * radius)));
		
		// // Rocket velocity
		// let direction = Math.random() < 0.5 ? 1 : -1;
		// let velocity = 2;
		// let normalizedPerp = this.pos.sub(targets[0].pos).perp().normalize();
		// this.vel = new Vector2(normalizedPerp).mul(velocity * direction);

		this.randomizePosition();

		// Rocket angle
		this.angle = Math.random() * Math.PI * 2;
		this.angleVector = new Vector2(Math.cos(this.angle), Math.sin(this.angle));
	}
    think() {
		let inputs = [];

		// Input version where all inputs are x, y pairs
		// non-normalized distance vector to checkpoint
		inputs[0] = this.pos.x - targets[0].pos.x;
		inputs[1] = this.pos.y - targets[0].pos.y;
		// non-normalized velocity vector
		inputs[2] = this.vel.x - targets[0].vel.x;
		inputs[3] = this.vel.y - targets[0].vel.y;

		// inputs[4] = this.pos.x - obstacles[0].pos.x;
		// inputs[5] = this.pos.y - obstacles[0].pos.y;

		// non-normalized spaceship angle vector
		inputs[4] = this.angleVector.x;
		inputs[5] = this.angleVector.y;

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

		this.brain.setInput(inputs);
		this.brain.run();
		let output = this.brain.getOutput();

		for (let i = 0; i < output.length; i++) {
			if (isNaN(output[i]))
				output[i] = 0;
		}

		// this.angle = output[0] * Math.PI * 2;

		// this.anglex = Math.cos(this.angle);
		// this.angley = Math.sin(this.angle);
		
		// Sigmoid like [0, 1]
		// this.angleVector.x = (output[0] - 0.5) * 2.0;
		// this.angleVector.y = (output[1] - 0.5) * 2.0;
		//this.thrust = output[2] * this.maxThrust;

		// Tanh like [-1, 1]
		this.angleVector.x = output[0];
		this.angleVector.y = output[1];
		this.thrust = (output[2] + 1) * 0.5 * this.maxThrust;

		this.angle = Math.atan2(this.angleVector.y, this.angleVector.x);
		//this.angle = output[0] * Math.PI * 2;
		//this.thrust = this.maxThrust * output[1];
		//this.thrust = output[2] * this.maxThrust;
	}

    move(){
        //this.frc = this.frc.add(this.angleVector.mul(this.thrust));
        this.frc = Vector2.add(this.frc, Vector2.mul(this.angleVector, this.thrust));
    }

    update(){
        //this.vel = this.vel.add(this.frc.div(this.mass));
        this.vel = Vector2.add(this.vel, Vector2.div(this.frc, this.mass));
        //this.pos = this.pos.add(this.vel);
        this.pos = Vector2.add(this.pos, this.vel);
        this.frc = Vector2.mul(this.frc, 0);
    }

    calculateFitness() {

		// fitness modifiers (lower is better)
		const hitTargetModifier = 0.01;
		//const hitObstacleModifier = 1000;
		const ticksModifier = 1;
		const targetDistanceModifier = 1;
		//const obstacleDistanceModifier = 100;
		const tooFarAwayFromTargetModifier = 100;
		const timeoutModifier = 100;

		let distanceToTarget = Vector2.distance(this.pos, targets[0].pos);
		//let invDistanceToObstacle = 1 / Vector2.distance(this.pos, obstacles[0].pos);
		
		// Base fitness
		//this.fitness = this.ticksAlive * ticksModifier + distanceToTarget * targetDistanceModifier + invDistanceToObstacle * obstacleDistanceModifier;
		this.fitness = 1.0;
		
		this.fitness += this.ticksAlive * ticksModifier;

		this.fitness += distanceToTarget * targetDistanceModifier;

		// fitness modifier for hitting target
		if (this.hitsTarget()) {
			this.fitness *= hitTargetModifier;
		}

		// fitness modifier for hitting obstacle
		// if (this.hitsObstacle()) {
		// 	this.fitness *= hitObstacleModifier;
		// }

		// fitness modifier for being too far away from target
		if (this.tooFarAwayFromTarget()) {
			this.fitness *= tooFarAwayFromTargetModifier;
		}

		// fitness modifier for timing out
		if (this.timeouts()) {
			this.fitness *= timeoutModifier;
		}

		console.log("fitness: ", this.fitness);
    }

    outsideScreen() {
		return this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height;
	}

	tooFarAwayFromTarget() {
		let distx = targets[0].pos.x - this.pos.x;
		let disty = targets[0].pos.y - this.pos.y;
		let dist = Math.sqrt(distx * distx + disty * disty);
		return dist > 1000;
	}

	hitsTarget() {
		let distx = targets[0].pos.x - this.pos.x;
        let disty = targets[0].pos.y - this.pos.y;
        let dist = Math.sqrt(distx * distx + disty * disty);
        return dist < targets[0].radius + this.radius;
	}

	// hitsObstacle() {
	// 	let distx = obstacles[0].pos.x - this.pos.x;
	// 	let disty = obstacles[0].pos.y - this.pos.y;
	// 	let dist = Math.sqrt(distx * distx + disty * disty);
	// 	return dist < obstacles[0].radius + this.radius;
	// }

	timeouts() {
		return this.ticksAlive > 500;
	}
}