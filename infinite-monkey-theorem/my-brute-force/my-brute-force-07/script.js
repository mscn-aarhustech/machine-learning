// Valid Genes
// Original
//const GENES = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890,.-;:!?&'/()";

// Stripped-down
const GENES = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .";

// Minimal
//const GENES = "abcdefghijklmnopqrstT .";

// Target string to be generated
const TARGET = "To be or not to be.";

const totalCombinations = Math.pow(GENES.length, TARGET.length);
let iterationCount = 0;

const targetElement = document.getElementById('target');
const resultElement = document.getElementById('result');
const countElement = document.getElementById('count');
const totalCombinationsElement = document.getElementById('totalCombinations');
const progressElement = document.getElementById('progress');
const alphabetElement = document.getElementById('alphabet');
const completionTimeElement = document.getElementById('completionTime');

//
targetElement.innerHTML = `Target: ${TARGET}`;
totalCombinationsElement.innerHTML = `Total number of combinations: ${totalCombinations.toLocaleString('da-DK')}`;
alphabetElement.innerHTML = `Alphabet: ${GENES}`;
completionTimeElement.innerHTML = `Completion time in years:`;

const startTime = performance.now();

function calculateRunTimeSeconds() {
  const currentTime = performance.now();
  const runTimeMs = currentTime - startTime;
  const runTimeSecs = runTimeMs / 1000;
  return runTimeSecs;
}

function calculateExecutionTime() {
  const runTimeSecs = calculateRunTimeSeconds();
  const combinationsPerSecond = Math.floor(iterationCount / runTimeSecs);
  //console.log(`Combinations per second: ${combinationsPerSecond.toLocaleString('da-DK')}`);
  const totalTimeSecs = totalCombinations / combinationsPerSecond;
  const totalTimeMins = Math.floor(totalTimeSecs / 60);
  const totalTimeHrs = Math.floor(totalTimeMins / 60);
  const totalTimeDays = Math.floor(totalTimeHrs / 24);
  const totalTimeYrs = Math.floor(totalTimeDays / 365);
  //console.log(totalTimeSecs / 60 / 60 / 24 / 365);
  completionTimeElement.innerHTML = `Completion time in years: ${totalTimeYrs.toLocaleString('da-DK')}`;
}

function indexToString(index, length) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result = GENES.charAt(index % GENES.length) + result;
    index = Math.floor(index / GENES.length);
  }
  return result;
}

function bruteForceSearch() {

  let found = false;
  const batchSize = 100_000;

  const searchBatch = () => {
    if (found) {
      return;
    }

    let currentResult = '';

    for (let i = 0; i < batchSize && iterationCount < totalCombinations; i++) {
      currentResult = indexToString(iterationCount, TARGET.length);

      if (currentResult === TARGET) {
        console.log(`Target found: ${currentResult}`);
        found = true;
        break;
      }

      iterationCount++;
    }

    const progress = (iterationCount / totalCombinations) * 100;
    resultElement.innerHTML = `Result: ${currentResult}`;
    countElement.innerHTML = `Tested combinations: ${iterationCount.toLocaleString('da-DK')}`;
    progressElement.innerHTML = `Progress: ${progress.toFixed(32)}%`;

    if (!found) {
      setTimeout(searchBatch, 0);
    }
  };

  searchBatch();
}

setInterval(calculateExecutionTime, 1000);
bruteForceSearch();
