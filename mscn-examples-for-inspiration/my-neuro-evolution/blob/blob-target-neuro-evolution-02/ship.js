"use strict";

let nnParams = {
	layers : [4, 16, 3],
	activation : {
		func : ActivationFunctions.sigmoidLike2,
	},
}

class Ship {
    constructor(brain){
		this.pos = new Vector2();
		this.step = new Vector2();
		this.radius = 5;
        this.speed = 0;
        this.fitness = 0;
		this.ticksAlive = 0;
        
        if (brain) {
			this.brain = brain;
		} else {
			this.brain = new Network(null, nnParams);
		}

		this.init();
    }
	init() {
		// Rocket position
		let radius = 400 + Math.random() * 100;
		let angle = Math.random() * Math.PI * 2;
		//this.pos = new Vector2(targets[0].pos.add(new Vector2(Math.cos(angle) * radius, Math.sin(angle) * radius)));
		let border = 100;
		this.pos = new Vector2(border + Math.random() * (width - 2*border), border + Math.random() * (height - 2*border));
	}
    think() {
		let inputs = [];

		// Input version where all inputs are x, y pairs
		// non-normalized distance vector to checkpoint
		inputs[0] = this.pos.x - targets[0].pos.x;
		inputs[1] = this.pos.y - targets[0].pos.y;

		// non-normalized distance vector to obstacle
		inputs[2] = this.pos.x - obstacles[0].pos.x;
		inputs[3] = this.pos.y - obstacles[0].pos.y;

		this.brain.setInput(inputs);
		this.brain.run();
		let output = this.brain.getOutput();

		for (let i = 0; i < output.length; i++) {
			if (isNaN(output[i]))
				output[i] = 0;
		}

		this.speed = output[0] * 20.0;

		this.step.x = (output[1] - 0.5) * 2.0;
		this.step.y = (output[2] - 0.5) * 2.0;

		this.step.mul(this.speed);
	}

    move(){
    }

    update(){
        this.pos = Vector2.add(this.pos, this.step);
    }

    calculateFitness() {

		// fitness modifiers (lower is better)
		const hitTargetModifier = 0.1;
		const hitObstacleModifier = 100;
		const ticksModifier = 0;
		const targetDistanceModifier = 1;
		const obstacleDistanceModifier = 100000000;
		const tooFarAwayFromTargetModifier = 10;
		const timeoutModifier = 1;

		let distanceToTarget = Vector2.distance(this.pos, targets[0].pos);
		let invDistanceToObstacle = 1 / Vector2.distanceSquared(this.pos, obstacles[0].pos);
		
		// Base fitness
		//this.fitness = this.ticksAlive * ticksModifier + distanceToTarget * targetDistanceModifier + invDistanceToObstacle * obstacleDistanceModifier;
		this.fitness = 1.0;
		
		//this.fitness += this.ticksAlive * ticksModifier;

		this.fitness += distanceToTarget * targetDistanceModifier;

		//this.fitness += invDistanceToObstacle * obstacleDistanceModifier;

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

		// // fitness modifier for timing out
		// if (this.timeouts()) {
		// 	this.fitness *= timeoutModifier;
		// }

		console.log("fitness: ", this.fitness);
    }

    outsideScreen() {
		return this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height;
	}

	tooFarAwayFromTarget() {
		let distx = targets[0].pos.x - this.pos.x;
		let disty = targets[0].pos.y - this.pos.y;
		let dist = Math.sqrt(distx * distx + disty * disty);
		return dist > 600;
	}

	hitsTarget() {
		let distx = targets[0].pos.x - this.pos.x;
        let disty = targets[0].pos.y - this.pos.y;
        let dist = Math.sqrt(distx * distx + disty * disty);
        return dist < targets[0].radius + this.radius;
	}

	hitsObstacle() {
		let distx = obstacles[0].pos.x - this.pos.x;
		let disty = obstacles[0].pos.y - this.pos.y;
		let dist = Math.sqrt(distx * distx + disty * disty);
		return dist < obstacles[0].radius + this.radius;
	}

	timeouts() {
		return this.ticksAlive > 500;
	}
}