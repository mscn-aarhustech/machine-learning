
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
            //console.log('Matrix addition');
            for(let i = 0; i < this.rows; i++) {
                for(let j = 0; j < this.cols; j++) {
                    this.data[i][j] += n.data[i][j];
                }
            }
        } else {
            //console.log('Scalar addition');
            for(let i = 0; i < this.rows; i++) {
                for(let j = 0; j < this.cols; j++) {
                    this.data[i][j] += n;
                }
            }
        }
    }

    static subtract(a, b) {
        if(a instanceof Matrix && b instanceof Matrix) {
            if(a.rows !== b.rows || a.cols !== b.cols) {
                console.log('Columns and Rows of A must match Columns and Rows of B.');
                return undefined;
            }
            let result = new Matrix(a.rows, a.cols);
            for(let i = 0; i < result.rows; i++) {
                for(let j = 0; j < result.cols; j++) {
                    result.data[i][j] = a.data[i][j] - b.data[i][j];
                }
            }
            return result;
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

    static map(matrix, fn) {  
        // apply a function to every element of matrix
        var result = new Matrix(matrix.rows, matrix.cols);
        for(let i = 0; i < matrix.rows; i++) {
            for(let j = 0; j < matrix.cols; j++) {
                result.data[i][j] = fn(matrix.data[i][j]);
            }
        }
        return result;
    }

    static transpose(m) {
        let result = new Matrix(m.cols, m.rows);
        for(let i = 0; i < m.rows; i++) {
            for(let j = 0; j < m.cols; j++) {
                result.data[j][i] = m.data[i][j];
            }
        }
        return result;
    }

    print() {
        console.table(this.data);
    }
}
