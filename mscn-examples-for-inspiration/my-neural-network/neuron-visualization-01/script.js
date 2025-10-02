// Neuron with single input and single output
// rendering with Chart.js

const ctx = document.getElementById('myChart');

// Activation functions
function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

function sigmoidLike(x) {
    return 0.5 + 0.5 * x / (1 + Math.abs(x));
}

// lower n gives a steeper sigmoid
// n = 0 equals binary perceptron / Heaviside step function behavior
function sigmoidLike2(x, n) {
    return 0.5 + 0.5 * x / (n + Math.abs(x));
}

// Neuron
function NAND_sigmoid_neuron(input1, weight1, bias) {
    return sigmoidLike2(input1 * weight1 + bias, 1.0)
}

// Test
let data = [];

for (let i = -100; i < 100; i++) {
    let x = i / 10;
    let y = NAND_sigmoid_neuron(x, 1, 1);
    data.push({x: x, y: y});
}

const chart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [{
            label: 'NAND Neuron Simulation',
            data: data,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false
        }],
        labels: data.map(item => item.x)
    },
    options: {
        responsive: true,
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Input'
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Output'
                }
            }
        }
    }
});

