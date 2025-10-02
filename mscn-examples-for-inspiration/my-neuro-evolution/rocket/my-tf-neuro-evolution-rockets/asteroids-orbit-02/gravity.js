

// newtonian gravity betweeen planets and spaceships
function applyGravity() {
    for (planet of planets) {
        for (let car of spaceShips) {
            
            let distx = planet.posx - car.posx;
            let disty = planet.posy - car.posy;
            let distance = Math.sqrt(distx * distx + disty * disty);
            let force = (G * car.mass * planet.mass) / (distance * distance);
            
            let frcx = force * (planet.posx - car.posx) / distance;
            let frcy = force * (planet.posy - car.posy) / distance;
        
            car.velx += frcx / car.mass * DT;
            car.vely += frcy / car.mass * DT;
        }
    }
}