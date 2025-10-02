// import { Vector2 } from "./vector2.js";
// import { NeuralNetwork } from "./neuralNetwork.js";

class Ufo {
    constructor(brain){
        //his.pos = new Vector2(planets[0].pos.add(new Vector2(-300, -300.0)))
		let radius = 350;
		let angle = Math.random() * Math.PI * 2;
        this.pos = new Vector2(planets[0].pos.add(new Vector2(Math.cos(angle) * radius, Math.sin(angle) * radius)));
        this.frc = new Vector2();
        this.thrust = new Vector2();
		this.thrustAngle = 0;
        this.mass = 1;
		//this.vel = circularOrbitVelocityVector(planets[0], this, G);
		this.vel = new Vector2();
		this.radius = 8;
        this.maxThrust = 0.03;

        this.mutationRate = 0.1;
        this.fitness = 0;
        this.score = 0;
		this.ticksAlive = 0;
		this.averageEccentricity = 0;

        if (brain) {
			this.brain = brain.copy();
		} else {
			this.brain = new NeuralNetwork(5, 24, 2);
		}
    }

	// setup() {
	// 	this.mass = 1; //random(1, 5); 
    //     //ship.pos = new Vector2(random(0, width), random(0, height));
    //     this.pos = new Vector2(planets[0].pos.add(new Vector2(-300, -300.0)))
    //     //ship.vel = circularOrbitVelocityVector(planets[0], ship).mul(1);
    //     //this.vel = new Vector2();
    //     this.radius = 5; //random(1, 5);
	// 	console.log("setup: ", this);
	// }

    think() {
		
		let inputs = [];

		// Input version where all inputs are x, y pairs
		// non-normalized distance vector to checkpoint
		inputs[0] = this.pos.x - planets[0].pos.x; //console.log(inputs[0]);
		inputs[1] = this.pos.y - planets[0].pos.y; //console.log(inputs[1]);
		// non-normalized velocity vector
		inputs[2] = this.vel.x; //console.log(inputs[2]);
		inputs[3] = this.vel.y; //console.log(inputs[3]);
		
		let e = eccentricity(planets[0], this, G)
		this.averageEccentricity += e;
		
		inputs[4] = e;

		let output = this.brain.predict(inputs);

		for (let i = 0; i < output.length; i++) {
			if (isNaN(output[i]))
				output[i] = 0;
		}

		let thrustVector = new Vector2(output[0], output[1]);
		// let thrustMagnitude = Math.sqrt(thrustVector.x * thrustVector.x + thrustVector.y * thrustVector.y);

		// thrustVector = Vector2.div(thrustVector, thrustMagnitude);	
		
        this.thrust.x = (thrustVector.x - 0.5) * 2.0 * this.maxThrust;
        this.thrust.y = (thrustVector.y - 0.5) * 2.0 * this.maxThrust;

		//this.thrust = this.thrust.unit().mul(this.maxThrust);

		this.thrustAngle = Math.atan2(this.thrust.y, this.thrust.x);

        // console.log("inputs: ", inputs);
        // console.log("output: ", output);
	}

    move(){
        //this.frc = this.frc.add(this.angleVector.mul(this.thrust));
        this.frc = Vector2.add(this.frc, this.thrust);
    }

    update(){
        //this.vel = this.vel.add(this.frc.div(this.mass));
        this.vel = Vector2.add(this.vel, Vector2.div(this.frc, this.mass));
        //this.pos = this.pos.add(this.vel);
        this.pos = Vector2.add(this.pos, this.vel);
        this.frc = Vector2.mul(this.frc, 0);
    }

    calculateScore() {

		//this.score += this.ticksAlive;
		this.averageEccentricity = Math.abs(this.averageEccentricity/this.ticksAlive);
		this.score = 1.0 * (1.0 / this.averageEccentricity) + 0.0 * this.ticksAlive;
		console.log("average ecc: ", this.averageEccentricity, "score: ", this.score);

		// if(this.crashlandsOnPlanet() || this.outsideScreen()) {
		// 	this.score -= 1000;
		// }

		// this.score += 10;

		// if(this.crashlandsOnPlanet() || this.outsideScreen() ) {
		// 	//this.score -= 1000;
		// 	this.score = (Math.abs(this.averageEccentricity/this.ticksAlive) - 0.0) * this.ticksAlive;
		// 	console.log("score: ", this.score);
		// 	// this.averageEccentricity /= this.ticksAlive;
		// 	// this.score += Math.abs(1.0 - this.averageEccentricity) * 1000;
		// } else {
		// this.ticksAlive++;
		// // 	this.score += 100;
		// this.averageEccentricity += eccentricity(planets[0], this, G)
		// }
    }

    dispose() {
		this.brain.dispose();
	}

	mutate() {
		this.brain.mutate(this.mutationRate);
	}

    outsideScreen() {
		return this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height;
	}

	// toNeptune() {
	// 	let distx = planets[0].posx - this.posx;
	// 	let disty = planets[0].posy - this.posy;
	// 	let dist = Math.sqrt(distx * distx + disty * disty);
	// 	return dist > Math.sqrt(height * height + width * width) * 0.5;
	// }

	crashlandsOnPlanet() {
		let distx = planets[0].pos.x - this.pos.x;
        let disty = planets[0].pos.y - this.pos.y;
        let dist = Math.sqrt(distx * distx + disty * disty);
        return dist < planets[0].radius;
	}
}