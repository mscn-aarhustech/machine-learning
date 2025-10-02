// Valid Genes
const GENES = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890, .-;:_!\"#%&/()=?@${[]}";

// Target string to be generated
const TARGET = "To be or not to be.";

// Function to calculate the total number of combinations
function calculateTotalCombinations() {
  return Math.pow(GENES.length, TARGET.length);
}

// Function to convert an index to a string with GENES characters
function indexToString(index, length) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result = GENES.charAt(index % GENES.length) + result;
    index = Math.floor(index / GENES.length);
  }
  return result;
}

// Function to update the progress information in the HTML DOM
function updateProgressInfo(currentResult, iterationCount, progress) {
  const progressInfo = document.getElementById("progress-info");
  progressInfo.innerHTML = `Result: ${currentResult}, Iteration: ${iterationCount}, Progress: ${progress.toFixed(32)}%`;
}

// Main function for brute-force search
function bruteForceSearch() {
  let currentResult = GENES[0].repeat(TARGET.length); // Start with the first character of GENES
  let iterationCount = 0;
  const totalCombinations = calculateTotalCombinations();

  const search = () => {
    const progress = (iterationCount / totalCombinations) * 100;

    // Update progress information in the HTML DOM
    updateProgressInfo(currentResult, iterationCount, progress);

    if (currentResult === TARGET) {
      console.log(`Target found: ${currentResult}`);
      return;
    }

    currentResult = indexToString(iterationCount, TARGET.length);
    iterationCount++;

    if (currentResult !== TARGET) {
      setTimeout(search, 0); // Schedule the next iteration
    }
  };

  search(); // Start the first iteration
}

// Start the brute-force search
bruteForceSearch();
