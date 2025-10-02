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
    elitismRate : 0.05,  // Fraction of fittest individuals that will be cloned to next generation.

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

let planets = []; // array to hold planets
let ships = []; // array to hold ships
let deadShips = []; // array to hold ships

function InitSimulation() { 

    //tf.setBackend('cpu');

    // create planet
    let planet = new Planet();
    planet.pos = new Vector2(width * 0.5, height * 0.5);
    planet.mass = 1000;
    planet.radius = 80;
    planets.push(planet);

    // create ships
    setupShips();

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

function calculateScore() {
    for (let i = 0; i < ships.length; i++) {
        let ship = ships[i];
        if (!ship.isAlive) {
            ship.calculateScore();
        }
        
    }
}

function evaluate() {
    for (let i = ships.length - 1; i >= 0; i--) {
        if (ships[i].outsideScreen() || ships[i].crashlandsOnPlanet()) {
            // The ship has died
            // give score
            ships[i].calculateScore();
            // Move ship from active ships to saved ships
            deadShips.push(ships.splice(i, 1)[0]);
        } else {
            // The ship is still alive
            // increment ticks alive and add to average eccentricity
            ships[i].ticksAlive++;
            ships[i].averageEccentricity += eccentricity(planets[0], ships[i], G)
            //console.log("eccentricity: ", eccentricity(planets[0], ships[i], G));
        }
    }

    //console.log("ships: ", ships.length, "deadShips: ", deadShips.length);

    if (ships.length === 0) {
        
        let deadIndividuals = [];

        for (let i = 0; i < deadShips.length; i++) {
            let genome = deadShips[i].brain.encode();
            let fitness = deadShips[i].score;
            let individual = new Individual(genome, fitness);
            deadIndividuals.push(individual);
        }

        //console.log("deadIndividuals: ", deadIndividuals);

        //console.log("newIndividuals: ", ga.step(deadIndividuals));

        let newIndividuals = ga.step(deadIndividuals);

        for (let i = 0; i < newIndividuals.length; i++) {
            let ship = new Ship();
            ship.brain.decode(newIndividuals[i].genome);
            ships.push(ship);
        }
        
        deadShips = [];

        generationNumTicks = 0;
        generation++;
    }
}

function update() {

    // apply gravity between planets and ships
    for (let i = 0; i < planets.length; i++) {
        let planet = planets[i];
        for (let j = 0; j < ships.length; j++) {
            let ship = ships[j];
            applyGravity(planet, ship, G);
        }
    }

    // update ship physics
    for (let i = 0; i < ships.length; i++) {
        let ship = ships[i];
        ship.update();
    }

    // update planet physics
    // for (let i = 0; i < planets.length; i++) {
    //     let planet = planets[i];
    //     planet.update();
    // }
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
            ctx.lineTo(0, ship.radius * 2 + ship.thrust * 200);
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

        // Write ship's averageEccentricity / ticksAlive
        ctx.font = "12px Arial";
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillText(round(ship.averageEccentricity / ship.ticksAlive, 2), ship.pos.x-12, ship.pos.y-16);


        //console.log(semimajorAxis(ship, planets[0]))
        //console.log(eccentricity(ship, planets[0]));
    }

    ctx.strokeStyle = 'rgb(0, 0, 0)'
    ctx.lineWidth = 2;

    // Render planets as brown circles with black borders
    for (let i = 0; i < planets.length; i++) {
        let planet = planets[i];
        ctx.beginPath();
        ctx.arc(planet.pos.x, planet.pos.y, planet.radius, 0, 2 * Math.PI);
        ctx.fillStyle = "rgb(192, 128, 64)";
        ctx.fill();
        ctx.stroke();
    }
}

function gameLoop() {

    generationNumTicks++;

    //console.log("generation: ", generation, "generationNumTicks: ", generationNumTicks);

    think(); // ship decides what to do
    move(); // ship acts on decision
    update(); // update physics
    evaluate(); // evaluate if ships are alive or dead, and give score
    render(); // render the scene

    requestAnimationFrame(gameLoop);
}

InitSimulation();
gameLoop();

