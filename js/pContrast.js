$(document).ready(function () {

    $('#calculate-contrast').click(function (event) {

        var canvas = document.getElementsByTagName("canvas");
        var viewer = document.getElementById('viewer');
        //console.log(viewer.getImageData());
        //var canvas = $('#canvas');
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
                var pixels = processData(0, 0, cWidth, cHeight, webglContext);
                extractColours(pixels);
            }
        }
    });
});

function processData (x, y, width, height, webGlContext) {
    var pixels = new Uint8Array(width * height * 4);
    console.log('reading pixels');
    webGlContext.readPixels(0, 0, width, height, webGlContext.RGBA, webGlContext.UNSIGNED_BYTE, pixels);
    return pixels;
};

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