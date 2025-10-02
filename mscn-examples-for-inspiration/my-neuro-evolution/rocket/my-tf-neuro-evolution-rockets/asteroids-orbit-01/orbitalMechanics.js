
function gravitationalParameter(spaceShip, planet, gravitationalConstant) {
    return gravitationalConstant * spaceShip.mass * planet.mass;
}

function semiMajorAxis(spaceShip, planet) {
    let distsquared = spaceShip.posx * spaceShip.posx + spaceShip.posy * spaceShip.posy
    let mu = gravitationalParameter(spaceShip, planet, G);
    return distsquared / (2 * mu);
}

function relativeVelocity(spaceShip, planet) {
    
    let mu = gravitationalParameter(spaceShip, planet, G);
    
    let distancex = spaceShip.posx - planet.posx;
    let distancey = spaceShip.posy - planet.posy;
    let distance = Math.sqrt(distancex * distancex + distancey * distancey);
    let semiMajorAxis = semiMajorAxis(spaceShip, planet);
    
    return  Math.Sqrt(mu*((2.0/distance)-(1.0/semiMajorAxis)));
}

function relativeVelocityVector(spaceShip, planet) {
    return [spaceShip.velx - planet.velx, spaceShip.vely - planet.vely];
}

function distanceVector(spaceShip, planet) {
    return [spaceShip.posx - planet.posx, spaceShip.posy - planet.posy];
}