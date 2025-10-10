"use strict";

import { ObservationType, ActionNames, SnakeApiV1 } from "./snake-api-toolbox.js"

const Seeds = [0];
const NumGames = 5000;
const Session = "Test4";
const Observation = ObservationType.RawState;

const gameNumCols = 30;
const gameNumRows = 30;
const gameCellSizePx = 5;
const border = 10;

let canvas = null;
let ctx = null;
let gameState = null;

// Add canvas tags to HTML
const content = document.createElement('div');
document.body.appendChild(content);
content.innerHTML = '<canvas id="gameCanvas"></canvas>';

// canvas
canvas = document.querySelector("#gameCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// context
ctx = canvas.getContext("2d");
ctx.resetTransform();

// Call the function to execute the request
//const data = await spec();

const init = await SnakeApiV1.reset_many_combo(Seeds, Observation, NumGames, Session);
console.log(init);

// Set up snake game renderer in canvas
function renderSnakes() {
	
    // Clear screen
	ctx.resetTransform();
	ctx.fillStyle = "rgb(32,36,40)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Iterate through envs
    if(!gameState) { return; }

    // Render game borders
    for(let i = 0; i < gameState.envs.length ; i++) {
        
        const env = gameState.envs[i];
        const raw = env.rawForRender;

        //if(env.done) { continue; }

        const gameSizeX = gameNumRows * gameCellSizePx;
        const gameSizeY = gameNumCols * gameCellSizePx;

        const gamePosX = border + (gameSizeX + border) * i;
        const gamePosY = border;

        ctx.fillStyle = env.done ? rgbToGrayscale(32, 48, 56) : "rgb(32,48,56)";

        ctx.fillRect(gamePosX, gamePosY, gameSizeX, gameSizeY);

        // Render apples
        const apple = raw.food;

        const applePosX = border + (gameSizeX + border) * i + apple.x * gameCellSizePx;
        const applePosY = border + apple.y * gameCellSizePx;

        ctx.fillStyle = env.done ? rgbToGrayscale(255, 64, 32) : "rgb(255,64,32)";

        ctx.fillRect(applePosX, applePosY, gameCellSizePx, gameCellSizePx);

        // Render bodys
        const body = raw.body;

        ctx.fillStyle = env.done ? rgbToGrayscale(96, 192, 32) : "rgb(96,192,32)";

        for(let j = 0; j < body.length ; j++) {
            const bodyPart = body[j];

            const gameSizeX = gameNumRows * gameCellSizePx;
            const gameSizeY = gameNumCols * gameCellSizePx;

            const bodyPosX = border + (gameSizeX + border) * i + bodyPart.x * gameCellSizePx;
            const bodyPosY = border + bodyPart.y * gameCellSizePx;

            ctx.fillRect(bodyPosX, bodyPosY, gameCellSizePx, gameCellSizePx);
        }

        // Render heads
        const head = raw.head;

        const headPosX = border + (gameSizeX + border) * i + head.x * gameCellSizePx;
        const headPosY = border + head.y * gameCellSizePx;

        ctx.fillStyle = env.done ? rgbToGrayscale(128, 255, 64) : "rgb(128,255,64)";

        ctx.fillRect(headPosX, headPosY, gameCellSizePx, gameCellSizePx);
    }
}

function rgbToGrayscale(r, g, b) {
    //const gray = 0.299 * r + 0.587 * g + 0.587 * b;
    const gray = (r + g + b) * 0.33;
    return `rgb(${gray}, ${gray}, ${gray})`;
}

function randomElementFromArray(array) {
    let i = Math.floor(Math.random() * array.length);
    return array[i];
}

async function gameLoop() {

    const possibleActions = [0, 1, 2];
    const actions = []

    for(let i = 0 ; i < NumGames ; i++) {
        const action = randomElementFromArray(possibleActions);
        actions.push(action);
    }

    gameState = await SnakeApiV1.step_many_combo(actions, Session);

    requestAnimationFrame(renderSnakes);
}

// Run simulation
setInterval(gameLoop, 100);

// Set up genetic algorithm

// Set up population of neural networks

// Set up fitness function

