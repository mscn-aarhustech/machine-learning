// Valid Genes
const GENES = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890, .-;:_!\"#%&/()=?@${[]}";

//console.log(GENES.length);
// Target string to be generated
const TARGET = "To be or not to be.";
//console.log(TARGET.length);

const totalCombinations = Math.pow(GENES.length, TARGET.length);
//console.log(totalCombinations);

const targetElement = document.getElementById('target');
const resultElement = document.getElementById('result');
const countElement = document.getElementById('count');
const progressElement = document.getElementById('progress');

targetElement.innerHTML = `Target: ${TARGET}`; 

console.log((5.74e22) / (1.4e10) )
console.log((5.74*10**22) / (1.4*10**10) )

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
  let currentResult = GENES[0].repeat(TARGET.length); // Start with the first character of GENES
  let iterationCount = 0;

  const search = () => {
    const progress = (iterationCount / totalCombinations) * 100;

    // Update progress information in the HTML DOM
    resultElement.innerHTML = `Result: ${currentResult}`; 
    countElement.innerHTML = `Iteration: ${iterationCount}`; 
    progressElement.innerHTML = `Progress: ${progress.toFixed(32)}%`;

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
