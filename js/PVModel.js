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

        this.maxBlue = 400000;
        this.maxRed = 400000;
        this.maxGreen = 400000;
    }

    setStyleHemilight(){     
        require(['pv'], function(PV) {
            viewer.options('style', 'hemilight');
        });
    }

 
    rotate(xDegree, yDegree, zDegree) {
        //var myPV = require(['pv']);
        // var pvNew = window.pv;
        // var v = myPV.viewer;
        // this.currentRotation = rotateZ(rotateY(rotateX(this.currentRotation, xDegree), yDegree), zDegree);
        // console.log('current rotation');
        // console.log(this.currentRotation);
        // v.setRotation(this.currentRotation, 0);

        this.currentRotation = rotateZ(rotateY(rotateX(this.currentRotation, xDegree), yDegree), zDegree);
        this.move(this.currentRotation);
        
        return this.currentRotation;
    }
    
    move(cr) {
        var myPV;
        require(['pv'], function(PV) {
            myPV = PV;
            viewer.setRotation(cr, 0);
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

    calculateValue() {
        var canvas = this.extractCanvas();
        var pixels = this.processData(canvas);
        return this.extractColours(pixels);
    }

    saveToFile(protein) {
        console.log('saveing '+protein);
        var canvas = this.extractCanvas();
        var dataURL = canvas.toDataURL();
        //console.log(dataURL);
        //saveAs(dataURL, )
        var filename = "/Users/sircrashalot/Documents/school/thesis/proteins"+protein+".png";
        var proteinFile = new File(filename);
        new File()
        proteinFile.open("w");
        proteinFile.write( this.dataURLtoBlob(dataURL));
        proteinFile.close();
    }

    sendToServer(protein) {
        console.log('saveing '+protein);
        var canvas = this.extractCanvas();
        var dataURL = canvas.toDataURL('image/jpg');

        //$.post('http://localhost:8000/?protein='+protein, dataURL, function(data) {console.log(data);});
        
        $.ajax({
            type: "POST",
            url:'http://localhost:8000/?protein='+protein,
            contentType: "image/png",
            data: dataURL
        });

    }

    getNextProtein( successFunction ){
        $.ajax({
            type: "GET",
            url:'http://localhost:8000/nextProtein',
            sucess: function(data) {
                onsole.log(data);
                successFunction(data);
            }
        });
    }
    dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    }

    extractCanvas() {
        var canvas = document.getElementsByTagName("canvas");

        var arrayLength = canvas.arraylength;
        for (var c of canvas) {
            var webglContext = c.getContext('webgl');
            var twoDContext = c.getContext('2d');
            if (webglContext !== null) {
                return c;
            }
        }
    }

    processData (canvas) {
        var width = canvas.width;
        var height = canvas.height;
        var webGLContext = canvas.getContext('webgl');
        var pixels = new Uint8Array(width * height * 4);
        console.log('reading pixels');
        webGLContext.readPixels(0, 0, width, height, webGLContext.RGBA, webGLContext.UNSIGNED_BYTE, pixels);
        return pixels;
    }

 

    extractColours(pixels) {
        var hexColour = 0;
        var colour = "";
        var redCount = 0;
        var blueCount = 0;
        var greenCount = 0;
        var noColourCount = 0;
        for (i = 0; i < pixels.length; i = i + 4) { 
            colour = colourName(pixels[i], pixels[i+1], pixels[i+2]);
            
            if (colour == 'red') {
                redCount++;
            }
            if (colour == 'blue') {
                blueCount++;
            }
            if (colour == 'green') {
                greenCount++;
            }
            if (!colour) {
                noColourCount++;
            }
        }
        console.log('=================');
        console.log('blue# '+blueCount+' red# '+ redCount+' green# ' 
                    + greenCount + ' no# '+ noColourCount);
        var total = blueCount + redCount + greenCount;
        console.log('the total is ' +total);

        //console.log('the total average colour count is '+totalAvgColour);
        if (blueCount === 0) blueCount = 1;
        if (redCount === 0) redCount = 1;
        if (greenCount === 0) greenCount = 1;
        var tCount = blueCount * greenCount * redCount;
        console.log('total count is '+tCount);
        console.log('=================');
        //return totalAvgColour;


	    return tCount;
    }

    colourName(r, g, b) {
        var colour = false;

        if (r == 0 & g == 0 & b == 0) {
            colour = 'black';
        } else if (r == 255 & g == 255 & b == 255) {
            colour = 'white';
        } else if (r === g & b === g) {
            colour = 'gray';
        } else if (r > g & r > b) { 
            colour = 'red';
        }  else if (g > r & g > b) { 
            colour = 'green';
        }  else if (b > r & b > g) { 
            colour = 'blue';
        }
        return colour;
    }
    
}   

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Model;
  else
    window.Model = Model;
