// Valid Genes
const GENES = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890, .-;:_!\"#%&/()=?@${[]}";

// Target string to be generated
const TARGET = "To be or not to be.";

// Function to calculate the total number of combinations
function calculateTotalCombinations() {
  return Math.pow(GENES.length, TARGET.length);
}

// Function to generate a random character from GENES
function getRandomCharacter() {
  const randomIndex = Math.floor(Math.random() * GENES.length);
  return GENES.charAt(randomIndex);
}

// Main function for brute-force search
function bruteForceSearch() {
  let currentResult = '';
  let iterationCount = 0;
  const totalCombinations = calculateTotalCombinations();

  const search = () => {
    currentResult = '';
    for (let i = 0; i < TARGET.length; i++) {
      currentResult += getRandomCharacter();
    }

    const progress = (iterationCount / totalCombinations) * 100;

    // Log current result, iteration count, and progress percent
    console.log(`Result: ${currentResult}, Iteration: ${iterationCount}, Progress: ${progress.toFixed(32)}%`);

    iterationCount++;

    if (currentResult !== TARGET) {
      setTimeout(search, 0); // Schedule the next iteration
    }
  };

  search(); // Start the first iteration
}

// Start the brute-force search
bruteForceSearch();
