// import { Vector2 } from './vector2.js';
// import { Ship } from './ship.js';
//import { Planet } from './planet.js';


// set up canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// set up canvas size
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

const NUM_SHIPS = 100;
const DT = 0.1; //1/60; // time step
const G = 10; // gravitational constant

let generation = 0;

let planets = []; // array to hold planets
let ships = []; // array to hold ships
let savedShips = []; // array to hold ships

function InitSimulation() { 

    tf.setBackend('cpu');

    // create planet
    let planet = new Planet();
    planet.pos = new Vector2(width * 0.5, height * 0.5);
    planet.mass = 1000;
    planet.radius = 100;
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
            savedShips.push(ships.splice(i, 1)[0]);
        } else {
            // The ship is still alive
            // increment ticks alive and add to average eccentricity
            ships[i].ticksAlive++;
            ships[i].averageEccentricity += eccentricity(planets[0], ships[i], G)
        }
    }

    if (ships.length === 0) {
        generation++;
        nextGeneration();
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
    
    think(); // ship decides what to do
    move(); // ship acts on decision
    update(); // update physics
    evaluate(); // evaluate if ships are alive or dead, and give score
    render(); // render the scene

    requestAnimationFrame(gameLoop);
}

InitSimulation();
gameLoop();

