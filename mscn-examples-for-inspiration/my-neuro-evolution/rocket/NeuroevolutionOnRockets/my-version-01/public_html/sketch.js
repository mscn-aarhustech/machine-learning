// Define the canvas and context globally
let canvas;
let ctx;

Rockets = []
matingPool = []
graveyard = []
let popSize = 500
let startX = 50
let startY = 580
let endX = 550
let endY = 100
let raySize = 120

class Wall {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2
  }
}

class Ray {
  constructor(rocket, v) {
    this.x1 = rocket.position[0]
    this.y1 = rocket.position[1]
    this.ov = v
    this.v = v
    this.intercepts = []
  }
}

walls = [
new Wall(107, 601, 110, 117),
new Wall(428, 120, 521, 119), 
new Wall(521, 119, 520, 159), 
new Wall(520, 159, 329, 150), 
new Wall(329, 150, 331, 289), 
new Wall(331, 289, 510, 288), 
new Wall(510, 288, 507, 338), 
new Wall(507, 338, 328, 338), 
new Wall(328, 338, 328, 469), 
new Wall(328, 469, 434, 469), 
new Wall(434, 469, 458, 441), 
new Wall(458, 441, 490, 470), 
new Wall(490, 470, 491, 507), 
new Wall(491, 507, 325, 502), 
new Wall(325, 502, 325, 602), 
new Wall(325, 602, 600, 602), 
new Wall(600, 602, 601, 414), 
new Wall(601, 414, 411, 398),
new Wall(411, 398, 599, 412), 
new Wall(599, 412, 601, 216), 
new Wall(601, 216, 422, 216), 
new Wall(422, 219, 599, 216), 
new Wall(599, 216, 599, 31), 
new Wall(598, 30, 460, 30), 
new Wall(0, 0, 0, 600),
new Wall(600, 0, 600, 600),
new Wall(0, 600, 600, 600),
new Wall(0, 0, 209, 85), 
new Wall(209, 85, 298, 28), 
new Wall(298, 28, 388, 83), 
new Wall(388, 83, 465, 27), 
new Wall(471, 90, 387, 151), 
new Wall(387, 151, 299, 100), 
new Wall(299, 100, 206, 151),
new Wall(206, 151, 110, 117) ]

function setup() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  for (let i = 0; i < popSize; i++)
    Rockets.push(new Rocket());
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgb(215, 215, 215)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.fillStyle = 'rgb(255, 0, 0)';
  ctx.arc(endX, endY, 5, 0, 2 * Math.PI);
  ctx.fill();
  calculateMovement();
  collisionCheck();
  updatePositions();
  updateRays();
  updateFitness();
  updateSensors();
  show();
  if (Rockets.length < 15)
    updateGen();
  //if (mouseIsPressed)
  //  walls.push(new Wall(pmouseX, pmouseY, mouseX, mouseY));
}

function keyTyped() {
  if (keyCode == 13)
    updateGen()
}

function calculateMovement() {
  //noStroke()
  for (let rocket of Rockets) {
    let output = rocket.brain.predict(rocket.sensors)
    if (output[0] == 1) {
      rocket.velocity = rotation(rocket.velocity, 10)
    }
    if (output[1] == 1)
      rocket.velocity = rotation(rocket.velocity, -10)
  }
}

function collisionCheck() {
  for (let rocket of Rockets) {
    if (wallCollision(rocket)) {
      rocket.die()
    }
  }
}

function wallCollision(rocket) {
  let vertices = [
    [rocket.position[0] - (rocket.size / 2), rocket.position[1] - (rocket.size / 2)],
    [rocket.position[0] + (rocket.size / 2), rocket.position[1] - (rocket.size / 2)],
    [rocket.position[0] + (rocket.size / 2), rocket.position[1] + (rocket.size / 2)],
    [rocket.position[0] - (rocket.size / 2), rocket.position[1] + (rocket.size / 2)]
  ]
  for (let w of walls) {
    for (let i = 0; i < 4; i++) {
      let j = (i + 1) % 4
      if (lineLine(vertices[i][0], vertices[i][1], vertices[j][0], vertices[j][1], w.x1, w.y1, w.x2, w.y2)) return true
    }
  }
  return false
}

function updatePositions() {
  for (let rocket of Rockets) {
    rocket.position = vectorSum(rocket.position, vectorScalar(rocket.velocity, 4))
  }
}

function updateRays() {
  for (let rocket of Rockets) {
    rocket.rays = []
    let v = rotation(vectorScalar(rocket.velocity, raySize), 270)
    for (let i = 0; i < 180; i = i + 7.5) {
      v = rotation(v, 7.5)
      let ray = new Ray(rocket, v)
      rocket.rays.push(ray)
    }
  }
}

function updateSensors() {
  for (let rocket of Rockets) {
    rocket.sensors = []
    for (let r of rocket.rays) {
      r.intercepts = []
      let collides = false
      for (let w of walls) {
        let intersection = lineLineIntersection(r.x1, r.y1, r.x1 + r.ov[0], r.y1 + r.ov[1], w.x1, w.y1, w.x2, w.y2)
        if (intersection != false)
          r.intercepts.push(vectorNorm(vectorDiff(intersection, rocket.position)))
      }
      if (r.intercepts.length > 0) {
        let u = Math.min.apply(null, (r.intercepts))
        for (let i of r.intercepts) {
          r.v = vectorScalar(r.v, u / vectorNorm(r.v))
        }
      } else {
        r.v = r.ov
      }
      rocket.sensors.push(vectorNorm(r.v))
    }
  }
}

function updateGen() {
  matingPool = Rockets.sort(compareFitness).slice(0, 15)
  matingPool = generateWeighedList(matingPool)
  Rockets = []
  for (let i = 0; i < popSize; i++) {
    let rocket = new Rocket(getRandomElementFromArray(matingPool), getRandomElementFromArray(matingPool))
    Rockets.push(rocket)
  }
}

function getRandomElementFromArray(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function updateFitness() {
  for (let rocket of Rockets) {
    rocket.fitness = rocket.getFitness()
    if(rocket.fitness>600){
      endY = 300;
    }
  }
}

function compareFitness(a, b) {
  if (a.fitness > b.fitness) {
    return 1;
  }
  if (a.fitness < b.fitness)
    return -1;
  return 0;
}

function generateWeighedList(list) {
  var weighed_list = [];

  // Loop over weights
  for (var i = 0; i < list.length; i++) {
    var multiples = list[i].fitness;

    // Loop over the list of items
    for (var j = 0; j < multiples; j++) {
      weighed_list.push(list[i]);
    }
  }
  return weighed_list;
}

function show() {
  if (Rockets.length < 100) drawRays();
  drawWalls();
  drawRocket();
  drawInfo();
}

function drawRocket() {
  for (let rocket of Rockets) {
    ctx.beginPath();
    if (rocket.fitness > 200)
      ctx.fillStyle = 'rgb(0, 255, 0)';
    else if (rocket.fitness < 50)
      ctx.fillStyle = 'rgb(255, 0, 0)';
    else
      ctx.fillStyle = 'rgb(110, 110, 110)';
    ctx.rect(rocket.position[0]-rocket.size*0.5, rocket.position[1]-rocket.size*0.5, rocket.size, rocket.size);
    ctx.fill();
  }
}

function drawWalls() {
  for (let w of walls) {
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(60, 60, 60)';
    ctx.lineWidth = 3;
    ctx.moveTo(w.x1, w.y1);
    ctx.lineTo(w.x2, w.y2);
    ctx.stroke();
  }
}

function drawRays() {
  for (let rocket of Rockets) {
    for (let r of rocket.rays) {
      ctx.beginPath();
      ctx.lineWidth = 0.2;
      if (vectorNorm(r.v) < raySize)
        ctx.strokeStyle = 'rgb(255, 50, 0)';
      else
        ctx.strokeStyle = 'rgb(0, 125, 0)';
      ctx.moveTo(r.x1, r.y1);
      ctx.lineTo(r.x1 + r.v[0], r.y1 + r.v[1]);
      ctx.stroke();
    }
  }
}

function drawInfo() {
  ctx.font = '32px Arial';
  ctx.fillStyle = 'rgb(255, 0, 0)';
  ctx.fillText(Rockets.length, 500, 60);
  ctx.font = '12px Arial';
  ctx.fillStyle = 'rgb(255, 255, 255)';
  for (let rocket of Rockets)
    ctx.fillText(Math.round(rocket.fitness), rocket.position[0] + 50, rocket.position[1] - 50);
}

// Call the setup function when the window loads
window.onload = setup;

// Call the draw function every frame
setInterval(draw, 1000 / 60);