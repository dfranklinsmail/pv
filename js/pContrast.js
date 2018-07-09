$(document).ready(function () {

    /** button handlers */
    $('#calculate-contrast').click(function () {
        calculateContrast();
    });

    $('#rotateX').click(function () {
        drawAndRotated(30, 0, 0);
    });

    $('#rotateY').click(function () {
       drawAndRotated(0, 30, 0);
    });

    $('#rotateZ').click(function () {
        drawAndRotated(0, 0, 30);
    });

    $('#hillClimb').click(function () {
        hillClimb();
    });
});


function calculateContrast() {
    var canvas = extractCanvas();
    var pixels = processData(canvas);
    currentStateValue  = extractColours(pixels);

    
    // for (var i = 0; i < 12; ++i) {
    rotate(30, canvas.getContext('webgl'), canvas);
    //setInterval(drawRotated(30, canvas.getContext('webgl'), canvas), 1000.0);

};

function extractCanvas() {
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
function processData (canvas) {
    var width = canvas.width;
    var height = canvas.height;
    var webGLContext = canvas.getContext('webgl');
    var pixels = new Uint8Array(width * height * 4);
    console.log('reading pixels');
    webGLContext.readPixels(0, 0, width, height, webGLContext.RGBA, webGLContext.UNSIGNED_BYTE, pixels);
    return pixels;
};

var maxBlue = 400000;
var maxRed = 400000;
var maxGreen = 400000;

function extractColours(pixels) {
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
    console.log('blue count is '+blueCount);
    console.log(blueCount);
    console.log('red count is '+ redCount);
    console.log(redCount);
    console.log('green count is '+greenCount);
    console.log(greenCount);
    console.log('no Colour count is '+ noColourCount);
    console.log(noColourCount);

    var total = blueCount + redCount + greenCount;
    console.log('the total is ' +total);
    console.log(total);

    //TODO max average count
    var maxAvgBlue = blueCount/maxBlue;
    console.log('max average blue count is '+maxAvgBlue);
    console.log(maxAvgBlue);
    var maxAvgGreen = greenCount/maxGreen;
    console.log('max average green count is '+maxAvgGreen);
    console.log(maxAvgGreen);
    var maxAvgRed = redCount/maxRed;
    console.log('max average red count is '+maxAvgRed);
    console.log(maxAvgRed);
    var totalAvgColour = maxAvgBlue + maxAvgGreen + maxAvgRed;

    console.log('the total average colour count is '+totalAvgColour);
    console.log(totalAvgColour);
    return totalAvgColour;
};

function colourName(r, g, b) {
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
};

function setStyleHemilight(){     
        require(['pv'], function(PV) {
            pv = PV;
            viwer = pv.viewer;
            viewer.options('style', 'hemilight');
        });
};

var pid = 0;
function drawAndRotated(xDegree, yDegree, zDegree){     
    var currentRotation = new Float32Array(9);
    currentRotation[0] = 1;
    currentRotation[1] = 0;
    currentRotation[2] = 0;
    currentRotation[3] = 0;
    currentRotation[4] = 1;
    currentRotation[5] = 0;
    currentRotation[6] = 0;
    currentRotation[7] = 0;
    currentRotation[8] = 1;
    
    if (pid == 0) {
        setStyleHemilight();
        var rotateFunction = function() {
            require(['pv'], function(PV) {
                pv = PV;
                viwer = pv.viewer;
                currentRotation = rotateZ(rotateY(rotateX(currentRotation, xDegree), yDegree), zDegree);
                viewer.setRotation(currentRotation, 0);
            })
        };
        pid = setInterval( rotateFunction, 1000/30);
    } else {
        clearInterval(pid);
        pid = 0;
    }
};

function drawRotated(degrees, context, canvas){     

    if (i<10) {
        require(['pv'], function(PV) {
            pv = PV;
            viwer = pv.viewer;
            viewer.setRotation(rotateY(degrees), 0);
	    i++;
            //viewer._cam.setRotation(rotateX(degrees));
            //viewr.requestAnimFrame(viewer._boundDraw);
          });
    }	else {
 	clearInterval(drawIntervalProcessId);
   }
};

var i = 0;
var drawIntervalProcessId;
function rotate(degrees, context, canvas) { 
    setStyleHemilight();   
    var drawFunc = function() {drawRotated(degrees, context, canvas);};
    i =0;
    drawIntervalProcessId = setInterval(drawFunc, 1000.0/15.0);
    //var logHelloWorld = console.log("hello world");
    //setInterval(logHelloWorld, 1000.0/15.0);
    //drawRotated(degrees, context, canvas);
};

function rotate2(currRotation, x, y , z) {
    var calculateValue = 0;
    var pv = require(['pv']);
  
    viwer = pv.viewer;

    currRotation = rotateX(currRotation, x);
    currRotation = rotateY(currRotation, y);
    currRotation = rotateZ(currRotation, z);

    viewer.setRotation(currRotation);

    var canvas = extractCanvas();
    var pixels = processData(canvas);
    calculateValue  = extractColours(pixels);


    rotateX(-x);
    rotateY(-y);
    rotateZ(-z);

    
    return calculateValue;
}

function hillClimb() {
    var currentRotation = new Float32Array(9);
    currentRotation[0] = 1;
    currentRotation[1] = 0;
    currentRotation[2] = 0;
    currentRotation[3] = 0;
    currentRotation[4] = 1;
    currentRotation[5] = 0;
    currentRotation[6] = 0;
    currentRotation[7] = 0;
    currentRotation[8] = 1;

    hillClimbingStep(currentRotation);
}

var currentStateValue = 0;
var minRotation = 10; 
function hillClimbingStep(currentRotation) {
    
    var xNeighbourStateValue = rotate2(currentRotation, minRotation, 0, 0);
    var yNeighbourStateValue = rotate2(currentRotation, 0, minRotation, 0);
    var zNeighbourStateValue = rotate2(currentRotation, 0, 0, minRotation);

    var biggest = 0;

    if (xNeighbourStateValue > currentStateValue) {
	    currentStateValue = xNeighbourStateValue;
	    biggest = 1;
    } else if (yNeighbourStateValue > currentStateValue) {
	    currentStateValue = yNeighbourStateValue;
	    biggest = 2;
    } else if (zNeighbourStateValue > currentStateValue) {
	    currentStateValue = zNeighbourStateValue;
	    biggest = 3;
    }
    
    if (biggest == 1) {
	    currentRotation = rotateX(minRotation)
    } else if (biggest == 2) {
	    currentRotation = rotateY(minRotation)
    } else if(biggest == 3) {
	    currentRotation= rotateZ(minRotation)
    } else {
	    stop();
    }

    return currentStateValue;
}

function stop() {
    clearInterval(drawIntervalProcessId);
}
function printHello() {
    console.log('hello')
}


function maximize() {
    
}

function drawRotateX(degrees) {

}

//initialize to a 3x3 identiy matric, represented as a array of length 9
function rotateX(currentRotation, degrees) {
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

        currentRotation = multiplyMatrix(currentRotation, transformationMatrix);
    }
    return currentRotation;
};

function rotateY(currentRotation, degrees) {
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

        currentRotation = multiplyMatrix(currentRotation, transformationMatrix);
    }
    return currentRotation;
};

function rotateZ(currentRotation, degrees) {
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

        currentRotation = multiplyMatrix(currentRotation, transformationMatrix);
    }
    return currentRotation;
};

//multiple the two 3x3 matrices
function multiplyMatrix(mA, mB) {
    
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
