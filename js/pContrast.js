$(document).ready(function () {

    $('#calculate-contrast').click(function (event) {
        var canvas = extractCanvas();
        var pixels = processData(canvas);
        extractColours(pixels);

        drawRotated(20, canvas.getContext('webgl'), canvas)
        
    });
});

function extractCanvas() {
    var canvas = document.getElementsByTagName("canvas");

    var arrayLength = canvas.arraylength;
    for (var c of canvas) {
        //var c = canvas[i];
        var webglContext = c.getContext('webgl');
        var twoDContext = c.getContext('2d');
        if (webglContext !== null) {
            console.log('the length of the canvas');
            var cWidth = c.width;
            console.log(cWidth);
            console.log('the height of the canvas');
            var cHeight = c.height;
            console.log(cHeight);

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


function drawRotated(degrees, context, canvas){

 console.log('in draw rotated');
     
        require(['pv'], function(PV) {
            
            pv = PV;
            //viewer = pv.Viewer(document.getElementById('viewer'), { 
            //    width : 'auto', height: 'auto', antialias : true, fog : true,
            //    outline : true, quality : 'high', style : 'phong',
            //    selectionColor : 'white', transparency : 'screendoor', 
            //    background : '#ccc', animateTime: 500, doubleClick : null
            //});
            viwer = pv.viewer;
            console.log('set style to hemilight');
            viewer.options('style', 'hemilight');
            //viewer.requestRedraw();
            //console.log('trying the change the shading to hemilight');

            console.log('rotating');
            viewer.setRotation(rotateX(10), 0);
        });
       
    /** 
    context.clearRect(0,0,canvas.width,canvas.height);

    // save the unrotated context of the canvas so we can restore it later
    // the alternative is to untranslate & unrotate after drawing
    context.save();

    // move to the center of the canvas
    context.translate(canvas.width/2,canvas.height/2);

    // rotate the canvas to the specified degrees
    context.rotate(degrees*Math.PI/180);

    // draw the image
    // since the context is rotated, the image will be rotated also
    context.drawImage(image,-image.width/2,-image.width/2);

    // we’re done with the rotating so restore the unrotated context
    context.restore();
    **/
};

//initialize to a 4X4 identiy matric, represented as a array of length 16
//var currentRotation = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
var currentRotation = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

function rotateX(degrees) {
    var cosX = Math.cos(degrees);
    var sinX = Math.sin(degrees);
    var transformationMatrix = [1, 0, 0, 0, 0, cosX, -1*sinX, 0, 0, sinX, cosX, 0, 0, 0, 0, 1];

    currentrotation = multiplyMatrix(currentRotation, transformationMatrix);
    return currentRotation;
};

function rotateY(degrees) {

};

function rotateZ(degrees) {

};

//multiple the two 4x4 matrices
function multiplyMatrix(matrixA, matrixB) {
    
    var rowSize = 4;
    var colmSize = 4;
    var matrixSize = rowSize * colmSize;

    var result = [];
    for (var i = 0; i < matrixSize; i++) {
        result[i] = 0;
        for (var c = i; c < 4; c=c+4) {
            var cIndex = c;
            var rowMax = c+4;
            for (var r = c; r < rowMax; ++r) {
                //result[i] = (matrixA[r] * matrixB[c]) + (matrixA[r] * matrixB[c]) + (matrixA[r] * matrixB[c]) + (matrixA[r] * matrixB[c]);
                console.log('i is '+i);
                console.log('c is '+c);
                console.log('cIndex is '+cIndex);
                console.log('r is '+r);
                result[i] += (matrixA[r] * matrixB[cIndex]);
                cIndex += 4;
            }
        }
        console.log('next i');
    }

    return result;
}