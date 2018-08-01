'use strict';

class Model {
    constructor(){
        this.currentRotation = new Float32Array(9);
        this. currentRotation[0] = 1;
        this.currentRotation[1] = 0;
        this.currentRotation[2] = 0;
        this.currentRotation[3] = 0;
        this.currentRotation[4] = 1;
        this.currentRotation[5] = 0;
        this.currentRotation[6] = 0;
        this. currentRotation[7] = 0;
        this. currentRotation[8] = 1;
    }

    rotate(xDegree, yDegree, zDegree) {
        require(['pv'], function(PV) {
            pv = PV;
            viwer = pv.viewer;
            this.currentRotation = rotateZ(rotateY(rotateX(this.currentRotation, xDegree), yDegree), zDegree);
            viewer.setRotation(this.currentRotation, 0);
        })
    }

    //initialize to a 3x3 identiy matric, represented as a array of length 9
    rotateX(rotation, degrees) {
        if ( degrees != 0 ) {
            var radians = degrees * Math.PI /180;
            var cosX = Math.cos(radians);
            var sinX = Math.sin(radians);
        
            var transformationMatrix = new Float32Array(9);
            transformationMatrix[0] = 1;
            transformationMatrix[1] = 0;
            transformationMatrix[2] = 0;
            transformationMatrix[3] = 0;
            transformationMatrix[4] = cosX;
            transformationMatrix[5] = -1*sinX;
            transformationMatrix[6] = 0;
            transformationMatrix[7] = sinX;
            transformationMatrix[8] = cosX;

            rotation = multiplyMatrix(rotation, transformationMatrix);
        }
        xDegree, yDegree, zDegree 
        return rotation;
    }

    rotateY(rotation, degrees) {
        if ( degrees != 0 ) {
            var radians = degrees * Math.PI /180;
            var cosX = Math.cos(radians);
            var sinX = Math.sin(radians);

            var transformationMatrix = new Float32Array(9);
            transformationMatrix[0] = cosX;
            transformationMatrix[1] = 0;
            transformationMatrix[2] = sinX;
            transformationMatrix[3] = 0;
            transformationMatrix[4] = 1;
            transformationMatrix[5] = 0;
            transformationMatrix[6] = -sinX;
            transformationMatrix[7] = 0;
            transformationMatrix[8] = cosX;

            rotation = multiplyMatrix(rotation, transformationMatrix);
        }
        return rotation;
    }

    rotateZ(rotation, degrees) {
        if (degrees != 0 ) {
            var radians = degrees * Math.PI /180;
            var cosX = Math.cos(radians);
            var sinX = Math.sin(radians);
            var transformationMatrix = new Float32Array(9);
            transformationMatrix[0] = cosX;
            transformationMatrix[1] = -sinX;
            transformationMatrix[2] = 0;
            transformationMatrix[3] = sinX;
            transformationMatrix[4] = cosX;
            transformationMatrix[5] = 0;
            transformationMatrix[6] = 0;
            transformationMatrix[7] = 0;
            transformationMatrix[8] = 1;

            rotation = multiplyMatrix(rotation, transformationMatrix);
        }
        return rotation;
    }

    //multiple the two 3x3 matrices
    multiplyMatrix(mA, mB) {
        
        var result = new Float32Array(9);
        result[0] = mA[0] * mB[0] + mA[1] * mB[3] + mA[2] * mB[6];
        result[1] = mA[0] * mB[1] + mA[1] * mB[4] + mA[2] * mB[7];
        result[2] = mA[0] * mB[2] + mA[1] * mB[5] + mA[2] * mB[8];
        result[3] = mA[3] * mB[0] + mA[4] * mB[3] + mA[5] * mB[6];
        result[4] = mA[3] * mB[1] + mA[4] * mB[4] + mA[5] * mB[7];
        result[5] = mA[3] * mB[2] + mA[4] * mB[5] + mA[5] * mB[8];
        result[6] = mA[6] * mB[0] + mA[7] * mB[3] + mA[8] * mB[6];
        result[7] = mA[6] * mB[1] + mA[7] * mB[4] + mA[8] * mB[7];
        result[8] = mA[6] * mB[2] + mA[7] * mB[5] + mA[8] * mB[8];

        return result;
    }
};

module.exports = Model;