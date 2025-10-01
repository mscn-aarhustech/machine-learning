// Valid Genes
// Original
//const GENES = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890,.-;:!?&'/()";

// Stripped-down
//const GENES = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .";

// Minimal
const GENES = "abcdefghijklmnopqrstT .";

// Target string to be generated
const TARGET = "To be or not to be.";
//console.log(TARGET.length);

const totalCombinations = Math.pow(GENES.length, TARGET.length);
//console.log(totalCombinations);

const targetElement = document.getElementById('target');
const resultElement = document.getElementById('result');
const countElement = document.getElementById('count');
const totalCombinationsElement = document.getElementById('totalCombinations');
const progressElement = document.getElementById('progress');
const alphabetElement = document.getElementById('alphabet');

//
targetElement.innerHTML = `Target: ${TARGET}`;
totalCombinationsElement.innerHTML = `Total number of combinations: ${totalCombinations.toLocaleString('da-DK')}`;
alphabetElement.innerHTML = `Alphabet: ${GENES}`;

// Function to convert an index to a string with GENES characters
function indexToString(index, length) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result = GENES.charAt(index % GENES.length) + result;
    index = Math.floor(index / GENES.length);
  }
  return result;
}

// Main function for brute-force search
function bruteForceSearch() {
  let iterationCount = 0;
  let found = false;
  const batchSize = 100_000; // Process 100.000 iterations per batch

  const searchBatch = () => {
    // If the target has been found in a previous batch, stop.
    if (found) {
      return;
    }

    let currentResult = '';

    // Process a whole batch of iterations in a tight loop
    for (let i = 0; i < batchSize && iterationCount < totalCombinations; i++) {
      currentResult = indexToString(iterationCount, TARGET.length);

      if (currentResult === TARGET) {
        console.log(`Target found: ${currentResult}`);
        found = true;
        break; // Exit the loop as soon as we find it
      }

      iterationCount++;
    }

    // Update the UI only ONCE per batch with the latest information
    const progress = (iterationCount / totalCombinations) * 100;
    resultElement.innerHTML = `Result: ${currentResult}`;
    countElement.innerHTML = `Tested combinations: ${iterationCount.toLocaleString('da-DK')}`;
    progressElement.innerHTML = `Progress: ${progress.toFixed(32)}%`;

    // If the target wasn't found in this batch, schedule the next one.
    if (!found) {
      setTimeout(searchBatch, 0); // Yield to the browser before the next batch
    }
  };

  searchBatch(); // Start the first batch
}

// Start the brute-force search
bruteForceSearch();
