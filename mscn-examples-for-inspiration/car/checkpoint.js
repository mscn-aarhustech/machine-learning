class Checkpoint {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.d = 100;
	}

	draw() {
		fill(0, 255, 0, 50);
		ellipse(this.x, this.y, this.d);
	}

	hits(car) {
		return dist(this.x, this.y, car.x, car.y) < this.d / 2;
	}
}