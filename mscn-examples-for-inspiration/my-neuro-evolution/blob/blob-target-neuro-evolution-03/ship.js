"use strict";

let nnParams = {
	layers : [4, 32, 2],
	activation : {
		//func : ActivationFunctions.sigmoidLike2,
		func : ActivationFunctions.tanhLike2,
	},
}

class Ship {
    constructor(brain){
		this.pos = new Vector2();
        this.frc = new Vector2();
		this.vel = new Vector2();
		this.mass = 1;
		// this.maxThrust = 0.05;
		// this.thrust = 0;
		this.radius = 5;
        this.fitness = 0;
		this.ticksAlive = 0;
        
        if (brain) {
			this.brain = brain;
		} else {
			this.brain = new Network(null, nnParams);
		}

		//this.init();
		this.randomizePosition();
    }
	init() {
		// Rocket position
		// Circle
		let radius = 400 + Math.random() * 100;
		let angle = Math.random() * Math.PI * 2;
		this.pos = new Vector2(targets[0].pos.add(new Vector2(Math.cos(angle) * radius, Math.sin(angle) * radius)));
		// Square
		//let border = 100;
		//this.pos = new Vector2(border + Math.random() * (width - 2*border), border + Math.random() * (height - 2*border));
	}
	randomizePosition() {
		let border = 100;
		this.pos = new Vector2(border + Math.random() * (width - 2*border), border + Math.random() * (height - 2*border));
	}
    think() {
		let inputs = [];

		// Input version where all inputs are x, y pairs
		inputs[0] = this.pos.x - targets[0].pos.x;
		inputs[1] = this.pos.y - targets[0].pos.y;
		// non-normalized velocity vector
		inputs[2] = this.vel.x - targets[0].vel.x;
		inputs[3] = this.vel.y - targets[0].vel.y;

		// Input version where all inputs are angle, distance pairs
		// Converges very slowly 
		// let angle = Math.atan2(this.pos.y - targets[0].pos.y, this.pos.x - targets[0].pos.x);
		// inputs[0] = angle;
		// inputs[1] = Vector2.distance(this.pos, targets[0].pos);

		this.brain.setInput(inputs);
		this.brain.run();
		let output = this.brain.getOutput();

		for (let i = 0; i < output.length; i++) {
			if (isNaN(output[i]))
				output[i] = 0;
		}

		// Sigmoid like [0, 1]
		// this.step.x = (output[1] - 0.5) * 2.0;
		// this.step.y = (output[2] - 0.5) * 2.0;

		// Tanh like [-1, 1]
		this.frc.x = output[0] * 0.01;
		this.frc.y = output[1] * 0.01;
	}

    move(){
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
		const hitTargetModifier = 0.1;
		const ticksModifier = 10;
		const targetDistanceModifier = 1;
		const tooFarAwayFromTargetModifier = 10;
		const timeoutModifier = 1;

		let distanceToTarget = Vector2.distance(this.pos, targets[0].pos);
		
		// Base fitness
		//this.fitness = this.ticksAlive * ticksModifier + distanceToTarget * targetDistanceModifier;
		this.fitness = 1.0;
		
		this.fitness += this.ticksAlive * ticksModifier;

		this.fitness += distanceToTarget * targetDistanceModifier;

		// fitness modifier for hitting target
		if (this.hitsTarget()) {
			this.fitness *= hitTargetModifier;
		}

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
		return dist > 1200;
	}

	hitsTarget() {
		let distx = targets[0].pos.x - this.pos.x;
        let disty = targets[0].pos.y - this.pos.y;
        let dist = Math.sqrt(distx * distx + disty * disty);
        return dist < targets[0].radius + this.radius;
	}

	timeouts() {
		return this.ticksAlive > 500;
	}
}