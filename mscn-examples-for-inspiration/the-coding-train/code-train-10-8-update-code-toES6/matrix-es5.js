
function Matrix(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.matrix = [];

    for(var i = 0; i < this.rows; i++) {
        this.matrix[i] = [];
        for(var j = 0; j < this.cols; j++) {
            this.matrix[i][j] = 0;
        }
    }
}

Matrix.prototype.randomize = function() {
    for(var i = 0; i < this.rows; i++) {
        for(var j = 0; j < this.cols; j++) {
            //this.matrix[i][j] = Math.random() * 2 - 1;
            this.matrix[i][j] = Math.floor(Math.random() * 10);
        }
    }
}

Matrix.prototype.add = function(n) {
    if (n instanceof Matrix) {
        // check dimensions
        if(this.rows !== n.rows || this.cols !== n.cols) {
            console.log('Columns and Rows of A must match Columns and Rows of B.');
            return;
        }
        console.log('Matrix addition');
        for(var i = 0; i < this.rows; i++) {
            for(var j = 0; j < this.cols; j++) {
                this.matrix[i][j] += n.matrix[i][j];
            }
        }
    } else {
        console.log('Scalar addition');
        for(var i = 0; i < this.rows; i++) {
            for(var j = 0; j < this.cols; j++) {
                this.matrix[i][j] += n;
            }
        }
    }
}

Matrix.prototype.multiply = function(n) {
    if(n instanceof Matrix) {
        // hadamard product
        for(var i = 0; i < this.rows; i++) {
            for(var j = 0; j < this.cols; j++) {
                this.matrix[i][j] *= n.matrix[i][j];
            }
        }
    } else {
        for(var i = 0; i < this.rows; i++) {
            for(var j = 0; j < this.cols; j++) {
                this.matrix[i][j] *= n;
            }
        }
    }
}



