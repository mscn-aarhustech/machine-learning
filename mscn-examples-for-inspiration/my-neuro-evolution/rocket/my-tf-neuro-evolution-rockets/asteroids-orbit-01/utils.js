function lineIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
	var x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
	var y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
	if (isNaN(x) || isNaN(y)) {
		return false;
	} else {
		if (x1 >= x2) {
			if (!(x2 <= x && x <= x1)) { return false; }
		} else {
			if (!(x1 <= x && x <= x2)) { return false; }
		}
		if (y1 >= y2) {
			if (!(y2 <= y && y <= y1)) { return false; }
		} else {
			if (!(y1 <= y && y <= y2)) { return false; }
		}
		if (x3 >= x4) {
			if (!(x4 <= x && x <= x3)) { return false; }
		} else {
			if (!(x3 <= x && x <= x4)) { return false; }
		}
		if (y3 >= y4) {
			if (!(y4 <= y && y <= y3)) { return false; }
		} else {
			if (!(y3 <= y && y <= y4)) { return false; }
		}
	}
	return { x, y };
}

function inteceptCircleLineSeg(cx, cy, cr, x1, y1, x2, y2) {
    var a, b, c, d, u1, u2, ret, retP1, retP2, v1, v2;
    v1 = {};
    v2 = {};
    v1.x = x2 - x1;
    v1.y = y2 - y1;
    v2.x = x1 - cx;
    v2.y = y1 - cy;
    b = (v1.x * v2.x + v1.y * v2.y);
    c = 2 * (v1.x * v1.x + v1.y * v1.y);
    b *= -2;
    d = Math.sqrt(b * b - 2 * c * (v2.x * v2.x + v2.y * v2.y - cr * cr));
    if(isNaN(d)){ // no intercept
        return [];
    }
    u1 = (b - d) / c;  // these represent the unit distance of point one and two on the line
    u2 = (b + d) / c;    
    retP1 = {};   // return points
    retP2 = {}  
    ret = []; // return array
    if(u1 <= 1 && u1 >= 0){  // add point if on the line segment
        retP1.x = x1 + v1.x * u1;
        retP1.y = y1 + v1.y * u1;
        ret[0] = retP1;
    }
    if(u2 <= 1 && u2 >= 0){  // second add point if on the line segment
        retP2.x = x1 + v1.x * u2;
        retP2.y = y1 + v1.y * u2;
        ret[ret.length] = retP2;
    }       
    return ret;
}

function randomGaussian2(mean, standardDeviation) {
    mean = mean || 0;
    standardDeviation = standardDeviation || 1;

    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );

    num = num * standardDeviation + mean; // Translate to desired mean and standard deviation
    return num;
}