
function gravitationalParameter(spaceShip, planet, gravitationalConstant) {
    return gravitationalConstant * spaceShip.mass * planet.mass;
}

function semiMajorAxis(spaceShip, planet, gravitationalConstant) {
    let distx = spaceShip.posx - planet.posx;
    let disty = spaceShip.posy - planet.posy;
    let dist = Math.sqrt(distx * distx + disty * disty);
    let velSqrd = spaceShip.velx * spaceShip.velx + spaceShip.vely * spaceShip.vely;
    let mu = gravitationalParameter(spaceShip, planet, gravitationalConstant);
    let result = 1.0 / (2.0 / dist - velSqrd / mu);
    return result;
}

function eccentricityVector(spaceShip, planet, gravitationalConstant) {
    let velocitySquared = spaceShip.velx * spaceShip.velx + spaceShip.vely * spaceShip.vely;
    let velocity = Math.sqrt(velocitySquared);
    let distx = spaceShip.posx - planet.posx;
    let disty = spaceShip.posy - planet.posy;
    let dist = Math.sqrt(distx * distx + disty * disty);
    let mu = gravitationalParameter(spaceShip, planet, gravitationalConstant);
    let specAngMom = (distx * spaceShip.velx + disty * spaceShip.vely);

    let e_x = (velocitySquared * distx - specAngMom * velocity) / mu - (distx / dist);
    let e_y = (velocitySquared * disty - specAngMom * velocity) / mu - (disty / dist);

    return [e_x, e_y];

    // m_EccentricityVector = (m_Velocity.LengthSquared() *
    // GetLengthVector() -
    // GetLengthVector().Dot(m_Velocity) *
    // m_Velocity) /
    // m_GravitationalParameter - GetAngleVector();
}

function eccentricity(spaceShip, planet, gravitationalConstant) {
    let e = eccentricityVector(spaceShip, planet, gravitationalConstant);
    return Math.sqrt(e[0] * e[0] + e[1] * e[1]);
}

function circularOrbitVelocityVector(spaceShip, gravitationalConstant) {
    let distx = spaceShip.posx - 400;
    let disty = spaceShip.posy - 400;
    let dist = Math.sqrt(distx * distx + disty * disty);
    let mu = 50000 * 2.0 * 1;
    let vel = Math.sqrt(mu / dist);
    let velx = -disty / dist * vel;
    let vely = distx / dist * vel;
    return [velx, vely];
}