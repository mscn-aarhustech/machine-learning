// https://www.youtube.com/watch?v=puWqNBFDMMk&list=PLRqwX-V7Uu6Y7MdSCaIfsxc561QI0U0Tb&index=8
// js ES6 compliant Matrix class

class Matrix {
    
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.matrix = [];

        for(let i = 0; i < this.rows; i++) {
            this.matrix[i] = [];
            for(let j = 0; j < this.cols; j++) {
                this.matrix[i][j] = 0;
            }
        }
    }

    randomize() {
        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.cols; j++) {
                //this.matrix[i][j] = Math.random() * 2 - 1;
                this.matrix[i][j] = Math.floor(Math.random() * 10);
            }
        }
    }

    add(n) {
        if (n instanceof Matrix) {
            // check dimensions
            if(this.rows !== n.rows || this.cols !== n.cols) {
                console.log('Columns and Rows of A must match Columns and Rows of B.');
                return;
            }
            console.log('Matrix addition');
            for(let i = 0; i < this.rows; i++) {
                for(let j = 0; j < this.cols; j++) {
                    this.matrix[i][j] += n.matrix[i][j];
                }
            }
        } else {
            console.log('Scalar addition');
            for(let i = 0; i < this.rows; i++) {
                for(let j = 0; j < this.cols; j++) {
                    this.matrix[i][j] += n;
                }
            }
        }
    }

    multiply(n) {  
        if(n instanceof Matrix) {
            if(this.cols !== n.rows) {
                console.log('Columns of A must match rows of B.')
                return undefined;
            }
            let result = new Matrix(this.rows, n.cols);
            for(let i = 0; i < result.rows; i++) {
                for(let j = 0; j < result.cols; j++) {
                    let sum = 0;
                    for(let k = 0; k < this.cols; k++) {
                        sum += this.matrix[i][k] * n.matrix[k][j];
                    }
                    result.matrix[i][j] = sum;
                }
            }
            return result;
            
        } else if (typeof n === 'number'){
            // scalar product
            for(let i = 0; i < this.rows; i++) {
                for(let j = 0; j < this.cols; j++) {
                    this.matrix[i][j] *= n;
                }
            }
        }
    }

    transpose() {
        let result = new Matrix(this.cols, this.rows);
        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.cols; j++) {
                result.matrix[j][i] = this.matrix[i][j];
            }
        }
        return result;
    }
}
