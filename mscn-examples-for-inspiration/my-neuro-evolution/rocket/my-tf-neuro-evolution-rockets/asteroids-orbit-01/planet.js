class Planet {
    constructor(posx, posy, radius, mass) {
        this.posx = posx;
        this.posy = posy;
        this.velx = 0;
        this.vely = 0;
        this.radius = radius;
        this.mass = mass;
    }

    draw() {
        fill(192, 128, 64);
        circle(this.posx, this.posy, this.radius * 2);
    }
}