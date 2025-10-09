"use strict";

class ActivationFunctions {

    static identity(z) {
        return z;
    }
    
    static didentity(y) {
        return 1;
    }

    static step(z) {
        return z >= 0 ? 1 : 0;
    }

    static dstep(y) {
        return 0;
    }

    static sigmoid(z) {
        return 1 / (1 + Math.exp(-z));
    }
    
    static dsigmoid(y) {
        return y * (1 - y);
    }
    
    static tanh(z) {
        return Math.tanh(z);
    }
    
    static dtanh(y) {
        return 1 - y * y;
    }
    
    static relu(z) {
        return Math.max(0, z);
    }
    
    static drelu(y) {
        if (y >= 0) return 1;
        return 0;
    }

    static leakyRelu(z) {
        return Math.max(0.01 * z, z);
    }

    static dleakyRelu(y) {
        if (y >= 0) return 1;
        return 0.01;
    }
    
    // SoftSign static: z is the input
    static softSign(z) {
        return z / (1 + Math.abs(z));
    }
    
    // Derivative of SoftSign: y is the output of softSign(z)
    // static dSoftSign(y) {
    //     return Math.pow(1 - Math.abs(y), 2);
    // }
    
    // static softSign(x) {
    //     return x / (1 + Math.abs(x));
    // }
    
    static dSoftSign(y) {
        return 1 / Math.pow(1 + Math.abs(y), 2);
        //return 1 / (1 + Math.abs(y)) ** 2;
    }
    
    static softSigmoid(z) {
        return (z / (2 * (1 + Math.abs(z)))) + 0.5;
    }
    
    static dSoftSigmoid(y) {
        return 0.5 * Math.pow(1 - Math.abs(2 * y - 1), 2);
    }
}

Object.freeze(ActivationFunctions);