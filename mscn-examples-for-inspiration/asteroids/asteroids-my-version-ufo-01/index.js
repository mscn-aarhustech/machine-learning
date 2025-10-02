// import { Vector2 } from './vector2.js';
// import { Ship } from './ship.js';
//import { Planet } from './planet.js';


// set up canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// set up canvas size
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

const NUM_SHIPS = 50;
const DT = 0.1; //1/60; // time step
const G = 8; // gravitational constant

let generation = 0;

let planets = []; // array to hold planets
let ships = []; // array to hold ships
let savedShips = []; // array to hold ships

// Plotly values
const xValues = []; // Generation
const yValues1 = []; // Average Points
const yValues2 = []; // Average Eccentricity

// Plotly Data
// let data = [{
//     x: xValues,
//     y: yValues1,
//     mode: 'lines',
//     line: {
//         color: '#FF00FF'  // set color to any RGB value
//     }
// }];

let trace1 = {
    x: xValues,
    y: yValues1,
    mode: 'lines',
    line: {
        color: '#0044CC'
    },
    yaxis: 'y'
};

let trace2 = {
    x: xValues,
    y: yValues2,
    mode: 'lines',
    line: {
        color: '#00CCCC'
    },
    yaxis: 'y2'
};

let data = [trace1, trace2];

// Plotly Layout
let layout = {
    title: {
        text: "UFO points",
        font: {
            color: '#ffffff'
        }
    },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    autosize: true,
    height: window.innerHeight,
    xaxis: {
        gridcolor: 'rgba(255,255,255,0.25)',
        zerolinecolor: 'rgba(255,255,255,0.25)',
        tickfont: {
            color: '#ffffff'
        },
        title: {
            text: 'Generation',
            font: {
                color: '#ffffff'
            }
        }
    },
    yaxis: {
        gridcolor: 'rgba(255,255,255,0.25)',
        zerolinecolor: 'rgba(255,255,255,0.25)',
        tickfont: {
            color: '#ffffff'
        },
        title: {
            text: 'Average score',
            font: {
                color: '#ffffff'
            }
        }
    },
    yaxis2: {
        overlaying: 'y',
        side: 'right',
        title: {
            text: 'Average orbital eccentricity',
            font: {
                color: '#ffffff'
            }
        },
        tickfont: {
            color: '#ffffff'
        },
        gridcolor: 'rgba(255,255,255,0.25)',
        zerolinecolor: 'rgba(255,255,255,0.25)'
    }
};


// Display using Plotly
Plotly.newPlot("myPlot", data, layout);
// Plotly test end

function InitSimulation() { 

    tf.setBackend('cpu');

    // create planet
    let planet = new Planet();
    planet.pos = new Vector2(width * 0.5, height * 0.5);
    planet.mass = 1000;
    planet.radius = 120;
    planets.push(planet);

    // create ships
    setupShips();

}

function setupShips() {
    for (let i = 0; i < NUM_SHIPS; i++) {
        let ship = new Ufo();
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
            //ships[i].averageEccentricity += eccentricity(planets[0], ships[i], G)
        }
    }

    if (ships.length === 0) {
        
        generation++;

        //calculateScore();

        // Calculate average eccentricity
        let averageEccentricity = 0.0;
        for (let i = 0; i < savedShips.length; i++) {
            averageEccentricity += savedShips[i].averageEccentricity;
        }
        averageEccentricity /= savedShips.length;

        // calculate average score
        let averageScore = 0;
        for (let i = 0; i < savedShips.length; i++) {
            averageScore += savedShips[i].score;
        }
        averageScore /= savedShips.length;

        // Plotly graph
        xValues.push(generation);
        yValues1.push(averageScore);
        yValues2.push(averageEccentricity);

        Plotly.newPlot("myPlot", data, layout);

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
    // for (let i = 0; i < ships.length; i++) {
    //     let ship = ships[i];
    //     if (ship.thrust > 0.0) {
    //         ctx.save();
    //         ctx.translate(ship.pos.x, ship.pos.y);
    //         ctx.rotate(ship.angle + Math.PI * 0.5);
    //         ctx.beginPath();
    //         ctx.moveTo(0, ship.radius);
    //         ctx.lineTo(0, ship.radius * 2 + ship.thrust * 200);
    //        //ctx.strokeStyle = "rgb(255, 0, 0, ship.thrust * 255)";
    //         ctx.stroke();
    //         ctx.restore();
    //     }
    // }

    ctx.strokeStyle = 'rgb(255, 192, 128)';
    ctx.lineWidth = 4;

    // render ufo thrust
    for (let i = 0; i < ships.length; i++) {
        let ship = ships[i];
        if (ship.thrust.x > 0.0 || ship.thrust.y > 0.0) {
            ctx.save();
            ctx.translate(ship.pos.x, ship.pos.y);
            //ctx.rotate(ship.angle + Math.PI * 0.5);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-ship.thrust.x * 300, -ship.thrust.y * 300);
           //ctx.strokeStyle = "rgb(255, 0, 0, ship.thrust * 255)";
            ctx.stroke();
            ctx.restore();
        }
    }


    ctx.strokeStyle = 'rgb(0, 0, 0)';
    ctx.lineWidth = 1;

    // render ufo's as gray circles with black borders
    for (let i = 0; i < ships.length; i++) {
        let ship = ships[i];
        ctx.beginPath();
        ctx.arc(ship.pos.x, ship.pos.y, ship.radius, 0, 2 * Math.PI);
        ctx.fillStyle = "rgb(128, 128, 128)";
        ctx.fill();
        ctx.stroke();
    }

    ctx.strokeStyle = 'rgb(0, 0, 0)';
    ctx.lineWidth = 1;

    // Render ships as green triangles with black borders
    // for (let i = 0; i < ships.length; i++) {
    //     let ship = ships[i];
    //     ctx.save();
    //     ctx.translate(ship.pos.x, ship.pos.y);
    //     ctx.rotate(ship.angle + Math.PI * 0.5);
    //     ctx.beginPath();
    //     ctx.moveTo(0, -ship.radius * 2);
    //     ctx.lineTo(-ship.radius, ship.radius * 2);
    //     ctx.lineTo(ship.radius, ship.radius * 2);
    //     ctx.lineTo(0, -ship.radius * 2);
    //     ctx.fillStyle = "rgb(32, 266, 64)";
    //     ctx.fill();
    //     ctx.stroke();
    //     ctx.restore();

    //     //console.log(semimajorAxis(ship, planets[0]))
    //     //console.log(eccentricity(ship, planets[0]));
    // }

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

