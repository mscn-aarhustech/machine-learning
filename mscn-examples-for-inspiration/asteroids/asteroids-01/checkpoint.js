class Checkpoint {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.d = 160;
	}

	draw() {
		stroke(0, 0, 0);
		fill(0, 255, 0, 50);
		ellipse(this.x, this.y, this.d);
	}

	hits(spaceShip) {
		return dist(this.x, this.y, spaceShip.posx, spaceShip.posy) < this.d / 2;
	}
}