"use strict";

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

// function eccentricityVector(spaceShip, planet, gravitationalConstant) {
//     let velocitySquared = spaceShip.velx * spaceShip.velx + spaceShip.vely * spaceShip.vely;
//     let velocity = Math.sqrt(velocitySquared);
//     let distx = spaceShip.posx - planet.posx;
//     let disty = spaceShip.posy - planet.posy;
//     let dist = Math.sqrt(distx * distx + disty * disty);
//     let mu = gravitationalParameter(spaceShip, planet, gravitationalConstant);
//     let specAngMom = (distx * spaceShip.velx + disty * spaceShip.vely);

//     let e_x = (velocitySquared * distx - specAngMom * velocity) / mu - (distx / dist);
//     let e_y = (velocitySquared * disty - specAngMom * velocity) / mu - (disty / dist);

//     return [e_x, e_y];

//     // m_EccentricityVector = (m_Velocity.LengthSquared() *
//     // GetLengthVector() -
//     // GetLengthVector().Dot(m_Velocity) *
//     // m_Velocity) /
//     // m_GravitationalParameter - GetAngleVector();
// }

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