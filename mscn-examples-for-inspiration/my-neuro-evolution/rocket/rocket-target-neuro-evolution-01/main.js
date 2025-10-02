"use strict";

// TODO:
// GA does not own population. Population is passed to GA.step() as an argument.
// Population is created outside GA, and passed to GA as an argument.
// GA receives and retuns a population of Individual class instances, containing genome and fitness.
// Encoding / Decoding from actual class to/from genome is done in actual class.
// Fitness function and fitness calculation os done in actual class, not in GA.
// GA does not own the main loop. Main loop is outside GA, and calls GA.step().

let gaParams = {

    // Genetic algorithm parameters
    gemmationRate : 0.0, // Fraction of next generation created through asexual reproduction.
    elitismRate : 0.1,  // Fraction of fittest individuals that will be cloned to next generation.

    // Genetic operators
    // Select individuals for mating.
    selection : {
        func : GenOps.randomWayTournamentSelection,
        params : {
            numParents : 2,
            maxContestants : 4,
        },
    }, 
    // Mate individuals.
    crossover : {
        func : GenOps.wholeArithmeticRecombination, //GenOps.uniformCrossover,
        params : {
            numChildren : 1,
        },
    }, 
    // Mutate individuals.
    mutation : {
        func : GenOps.randomizeMutation,
        params : {
            mutationChance : 0.02, 
            minValue : 0, 
            maxValue : 1
        },
    },
};

// Run genetic algorithm
let ga = new GeneticAlgorithm(gaParams);


// set up canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// set up canvas size
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

const NUM_SHIPS = 1000;
const DT = 0.1; //1/60; // time step
const G = 2; // gravitational constant

let generation = 0;
let generationNumTicks = 0;

let targets = []; // array to hold targets
let ships = []; // array to hold ships
let deadShips = []; // array to hold ships

function InitSimulation() { 
    setupTargets();
    setupShips();
}

function setupTargets() {
    for (let i = 0; i < 1; i++) {
        let target = new Target();
        targets.push(target);
    }
}

function setupShips() {
    for (let i = 0; i < NUM_SHIPS; i++) {
        let ship = new Ship();
        ships.push(ship);
    }
}

function think() { 
    for (let i = 0; i < ships.length; i++) {
        let ship = ships[i];
        ship.think();
    }
}

function move() {
    for (let i = 0; i < ships.length; i++) {
        let ship = ships[i];
        ship.move();
    }
}

function calculateFitness() {
    for (let i = 0; i < ships.length; i++) {
        let ship = ships[i];
        if (!ship.isAlive) {
            ship.calculateFitness();
        }
    }
}

function evaluate() {
    for (let i = ships.length - 1; i >= 0; i--) {
        if (ships[i].tooFarAwayFromTarget() || ships[i].hitsTarget() || ships[i].timeouts()) {
            // The ship has died
            // give fitness
            ships[i].calculateFitness();
            // Move ship from active ships to saved ships
            deadShips.push(ships.splice(i, 1)[0]);
        } else {
            // The ship is still alive
            // increment ticks alive and add to average eccentricity
            ships[i].ticksAlive++;
        }
    }

    if (ships.length === 0) {
        
        let deadIndividuals = [];

        for (let i = 0; i < deadShips.length; i++) {
            let genome = deadShips[i].brain.encode();
            let fitness = deadShips[i].fitness;
            let individual = new Individual(genome, fitness);
            deadIndividuals.push(individual);
        }

        let newIndividuals = ga.step(deadIndividuals);

        for (let i = 0; i < newIndividuals.length; i++) {
            let ship = new Ship();
            ship.brain.decode(newIndividuals[i].genome);
            ships.push(ship);
        }
        
        deadShips = [];

        targets[0].pos = new Vector2(200 + Math.random() * (width - 400 ), 200 + Math.random() * (height - 400 ));
        targets[0].vel = new Vector2(Math.random() * 2 - 1, Math.random() * 2 - 1).mul(0.5);

        for (let i = 0; i < ships.length; i++) {
            ships[i].pos = new Vector2(50 + Math.random() * (width - 100 ), 50 + Math.random() * (height - 100 ));
        }

        generationNumTicks = 0;
        generation++;
    }
}

function update() {

    // update ship physics
    for (let i = 0; i < ships.length; i++) {
        let ship = ships[i];
        ship.update();
    }

    // update target physics
    for (let i = 0; i < targets.length; i++) {
        let target = targets[i];
        target.update();
    }
}

function render() {

    // Clear screen
    ctx.fillStyle = 'rgb(64, 80, 96)';
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = 'rgb(255, 192, 128)';
    ctx.lineWidth = 4;

    // render ship thrust as a variable sized triangle behind the ship
    for (let i = 0; i < ships.length; i++) {
        let ship = ships[i];
        if (ship.thrust > 0.0) {
            ctx.save();
            ctx.translate(ship.pos.x, ship.pos.y);
            ctx.rotate(ship.angle + Math.PI * 0.5);
            ctx.beginPath();
            ctx.moveTo(0, ship.radius);
            ctx.lineTo(0, ship.radius * 2 + ship.thrust * 400);
           //ctx.strokeStyle = "rgb(255, 0, 0, ship.thrust * 255)";
            ctx.stroke();
            ctx.restore();
        }
    }

    ctx.strokeStyle = 'rgb(0, 0, 0)';
    ctx.lineWidth = 1;

    // Render ships as green triangles with black borders
    for (let i = 0; i < ships.length; i++) {
        let ship = ships[i];
        ctx.save();
        ctx.translate(ship.pos.x, ship.pos.y);
        ctx.rotate(ship.angle + Math.PI * 0.5);
        ctx.beginPath();
        ctx.moveTo(0, -ship.radius * 2);
        ctx.lineTo(-ship.radius, ship.radius * 2);
        ctx.lineTo(ship.radius, ship.radius * 2);
        ctx.lineTo(0, -ship.radius * 2);
        ctx.fillStyle = "rgb(32, 266, 64)";
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Write ship stuff
        ctx.font = "12px Arial";
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillText(round(ship.averageEccentricity / ship.ticksAlive, 2), ship.pos.x-12, ship.pos.y-16);
    }

    ctx.strokeStyle = 'rgb(0, 0, 0)'
    ctx.lineWidth = 2;

    // Render targets as brown circles with black borders
    for (let i = 0; i < targets.length; i++) {
        let target = targets[i];
        ctx.beginPath();
        ctx.arc(target.pos.x, target.pos.y, target.radius, 0, 2 * Math.PI);
        ctx.fillStyle = "rgb(192, 128, 64)";
        ctx.fill();
        ctx.stroke();
    }

    // Render info top-left corner of screen
    ctx.font = "20px Arial";
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillText("Generation: " + generation, 10, 30);
    ctx.fillText("Generation num ticks: " + generationNumTicks, 10, 60);
}

function gameLoop() {

    generationNumTicks++;

    //console.log("generation: ", generation, "generationNumTicks: ", generationNumTicks);

    think(); // ship decides what to do
    move(); // ship acts on decision
    update(); // update physics
    evaluate(); // evaluate if ships are alive or dead, and give fitness
    render(); // render the scene

    requestAnimationFrame(gameLoop);
}

InitSimulation();
gameLoop();

