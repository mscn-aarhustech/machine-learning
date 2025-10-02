// import { Vector2 } from "./vector2.js";

function applyGravity(a, b, g = 1.0) {
    //let distVec = new Vector2(b.pos.sub(a.pos));
    let distVec = Vector2.sub(b.pos, a.pos); //console.log(distVec);
    let distance = Vector2.length(distVec); //console.log(distance);
    let force = (g * a.mass * b.mass) / (distance * distance); //console.log(force);
    let unitVec = Vector2.div(distVec, distance);// console.log(unitVec);
    let forceVec = Vector2.mul(unitVec, force); //console.log(forceVec);

    a.frc = Vector2.add(a.frc, forceVec);// console.log(a.frc);
    b.frc = Vector2.sub(b.frc, forceVec);// console.log(b.frc);
}

function circularOrbitVelocityVector(a, b, g = 1.0) {
    //console.log(a.mass, b.mass, g);
    let distVec = Vector2.sub(b.pos, a.pos); //console.log(distVec);
    let distance = Vector2.length(distVec); //console.log(distance);
    let unitVec = Vector2.div(distVec, distance); //console.log(unitVec);
    let mu = g * (a.mass + b.mass); //console.log(mu);
    let vel = Math.sqrt(mu / distance);
    let velVector = new Vector2(-unitVec.y * vel, unitVec.x * vel); //console.log(velVector);
    return new Vector2(velVector.x, velVector.y);
}

function gravitationalParameter(a, b, g = 1.0) {
    return g * a.mass * b.mass;
}

function semimajorAxis(a, b, g = 1.0) {
    let distVec = Vector2.sub(b.pos, a.pos); //console.log(distVec);
    let distance = Vector2.length(distVec); //console.log(distance);
    let mu = g * (a.mass + b.mass); //console.log(mu);
    let result = 1.0 / (2.0 / distance - Vector2.lengthSquared(b.vel) / mu);
    return result;
}

function semiMinorAxis(semimajor, eccentricity) {
    return semimajor * Math.sqrt(1.0 - eccentricity * eccentricity);
}  

function eccentricityVector(a, b, g = 1.0) {
    let velVec = Vector2.sub(b.vel, a.vel); //console.log(velVec);
    let velSqd = Vector2.lengthSquared(velVec);
    //let velocity = Math.sqrt(velSqd);
    let distVec = Vector2.sub(b.pos, a.pos); //console.log(distVec);
    let dist = Vector2.length(distVec); //console.log(distance);
    //let unitVec = Vector2.div(distVec, dist); //console.log(unitVec);
    let mu = g * a.mass * b.mass; //console.log(mu);
    //let specAngMom = Vector2.perpDot(distVec, velVec); //console.log(specAngMom);
    let scalar1 = velSqd/mu - 1.0/dist; //console.log(scalar1);
    let scalar2 = Vector2.dot(distVec, velVec)/mu; //console.log(scalar2);
    let vector1 = Vector2.mul(distVec, scalar1); //console.log(vector1);
    let vector2 = Vector2.mul(velVec, scalar2);
    let e = Vector2.sub(vector1, vector2); //console.log(e);

    return new Vector2(e);
}

function eccentricity(a, b, g = 1.0) {
    let e = eccentricityVector(a, b, g);
    return Vector2.length(e);
}

function orbitalPeriod(a, b, g = 1.0) {
    let gm = g * (a.mass + b.mass);
    let smaj = semimajorAxis(a, b, g);
    return 2.0 * Math.PI * Math.sqrt((smaj * smaj * smaj) / gm);
}

// vis viva equation
function orbitalVelocity(a, b, g = 1.0) {
    let sm = semimajorAxis(a, b, g);
    let r = Vector2.length(Vector2.sub(b.pos, a.pos));
    let gm = g * (a.mass + b.mass);
    return Math.sqrt(gm * ((2.0 / r) - (1.0 / sm)));
}

