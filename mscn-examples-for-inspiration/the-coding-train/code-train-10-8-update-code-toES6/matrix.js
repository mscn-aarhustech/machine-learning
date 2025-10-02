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
            // hadamard product
            for(let i = 0; i < this.rows; i++) {
                for(let j = 0; j < this.cols; j++) {
                    this.matrix[i][j] *= n.matrix[i][j];
                }
            }
        } else {
            for(let i = 0; i < this.rows; i++) {
                for(let j = 0; j < this.cols; j++) {
                    this.matrix[i][j] *= n;
                }
            }
        }
    }

}
