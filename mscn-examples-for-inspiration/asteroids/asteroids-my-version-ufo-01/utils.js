
// function randomGaussian(mean, standardDeviation) {
//     mean = mean || 0;
//     standardDeviation = standardDeviation || 1;

//     let u = 0, v = 0;
//     while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
//     while(v === 0) v = Math.random();
//     let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );

//     num = num * standardDeviation + mean; // Translate to desired mean and standard deviation
//     return num;
// }

function randomGaussian(mean = 0, stdev = 1) {
    const u = 1 - Math.random(); // Converting [0,1) to (0,1]
    const v = Math.random();
    const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    // Transform to the desired mean and standard deviation:
    return z * stdev + mean;
}


function random(min, max) {
    return Math.random() * (max - min) + min;
}