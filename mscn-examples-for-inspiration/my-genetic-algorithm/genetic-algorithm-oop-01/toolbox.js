// Utility library  


// Array functions
function randomElementFromArray(array) {
    var randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// function shuffleArray(array) {
//     // Loop through array starting at the last index
//     for (let i = array.length - 1; i > 0; i--) {
//       // Generate a random index from 0 to i
//       const j = Math.floor(Math.random() * (i + 1));
  
//       // Swap elements at indexes i and j
//       const temp = array[i];
//       array[i] = array[j];
//       array[j] = temp;
//     }
//     return array;
// }


// Randomizing functions
function randomIntBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloatBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function randomGaussian(mean = 0, stdev = 1) {
    const u = 1 - Math.random(); // Converting [0,1) to (0,1]
    const v = Math.random();
    const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    // Transform to the desired mean and standard deviation:
    return z * stdev + mean;
}


// String and Character functions
function charToAscii(char) {
    return char.charCodeAt(0);
}

function asciiToChar(ascii) {
    return String.fromCharCode(ascii);
}

function randomChar() {
    // Daniel Shiffman's approach
    let c = Math.floor(randomIntBetween(63, 122));
    if (c === 63) c = 32; // space instead of question mark
    if (c === 64) c = 46; // period instead of @ sign

    return String.fromCharCode(c);
}

function randomPrintableAsciiChar() {
    var asciiCode = randomIntBetween(32, 126);
    return String.fromCharCode(asciiCode);
}

function randomAsciiLetter() {
    var asciiCode = randomIntBetween(65, 122);
    while(asciiCode > 90 && asciiCode < 97) {
        asciiCode = randomIntBetween(65, 122);
    }
    return String.fromCharCode(asciiCode);
}

function randomCharFromString(string) {
    var randomIndex = Math.floor(Math.random() * string.length);
    return string.charAt(randomIndex);
}


// Misc functions
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
