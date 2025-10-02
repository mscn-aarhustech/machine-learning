// https://www.youtube.com/watch?v=HuZbYEn8AvY&list=PLRqwX-V7Uu6Y7MdSCaIfsxc561QI0U0Tb&index=11
// js ES6 compliant Matrix class

class Matrix {
    
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.data = [];

        for(let i = 0; i < this.rows; i++) {
            this.data[i] = [];
            for(let j = 0; j < this.cols; j++) {
                this.data[i][j] = 0;
            }
        }
    }

    static fromArray(arr) {
        let m = new Matrix(arr.length, 1);
        for(let i = 0; i < arr.length; i++) {
            m.data[i][0] = arr[i];
        }
        return m;
    }

    toArray() {
        let arr = [];
        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.cols; j++) {
                arr.push(this.data[i][j]);
            }
        }
        return arr;
    }

    randomize() {
        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.cols; j++) {
                this.data[i][j] = Math.random() * 2 - 1;
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
                    this.data[i][j] += n.data[i][j];
                }
            }
        } else {
            console.log('Scalar addition');
            for(let i = 0; i < this.rows; i++) {
                for(let j = 0; j < this.cols; j++) {
                    this.data[i][j] += n;
                }
            }
        }
    }

    static multiply(a, b) {
        if(a instanceof Matrix && b instanceof Matrix) {
            if(a.cols !== b.rows) {
                console.log('Columns of A must match rows of B.')
                return undefined;
            }
            let result = new Matrix(a.rows, b.cols);
            for(let i = 0; i < result.rows; i++) {
                for(let j = 0; j < result.cols; j++) {
                    let sum = 0;
                    for(let k = 0; k < a.cols; k++) {
                        sum += a.data[i][k] * b.data[k][j];
                    }
                    result.data[i][j] = sum;
                }
            }
            return result;
        }
    }

    multiply(n) {  
        if (typeof n === 'number') {
            // scalar product
            for(let i = 0; i < this.rows; i++) {
                for(let j = 0; j < this.cols; j++) {
                    this.data[i][j] *= n;
                }
            }
        }
    }

    map(fn) {  
        // apply a function to every element of matrix
        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.cols; j++) {
                let val = this.data[i][j];
                this.data[i][j] = fn(val);
            }
        }
    }

    transpose() {
        let result = new Matrix(this.cols, this.rows);
        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.cols; j++) {
                result.data[j][i] = this.data[i][j];
            }
        }
        return result;
    }

    print() {
        console.table(this.data);
    }
}
