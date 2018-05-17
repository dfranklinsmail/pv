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
    for (i = 0; i < pixels.length; i = i + 4) { 
        hexColour = rgbToHex(pixels[i], pixels[i+1], pixels[i+2]);
        // colour = colourNameToHex(hexColour);
        colour = colourName(pixels[i], pixels[i+1], pixels[i+2]);
        if (!colour) {
            console.log('the hex colour code is '+ hexColour);
            console.log('the alpha level is '+ pixels[i+3]);
            console.log('the colour is ' + colour);
        }
        if (colour == 'red') {
            redCount++;
        }
        if (colour == 'blue') {
            blueCount++;
        }
    }
    console.log('blue count is '+blueCount);
    console.log('red cound is '+ redCount);
};

function colourNameToHex(colour)
{
    

    var colours = {"#cccccc":"gray", "#000000":"black", 
                   "#ab2020":"red", "#db2929":"red", "#cf2626":"red", "#8a1a1a":"red", "#b52222":"red",
                   "#c42424": "red", "#c92525":"red", "#bb2323":"red", "#a11e1e":"red", "#aa1f1f":"red", "#7c1717":"red",
                   "#00aeff": "blue", "#00bcff": "blue", "#245d8a":"blue", "#245e8b":"blue", "#265e89":"blue", "#25567d":"blue",
                   "#1f547e": "blue"
                }

    if (typeof colours[colour.toLowerCase()] != 'undefined')
        return colours[colour.toLowerCase()];

    return false;
};

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
};

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

function colourName(r, g, b) {
    var colour = false;
    //if (r > 120 & g <= 60 & b <= 60) {
    //    colour = 'red';
    //} else  if (r <= 60 & g > 120 & b <= 60) {
    //    colour = 'green';
    //} else  if (r <= 60 & g <= 60 & b > 120) {
    //    colour = 'blue';
    //} 
    if (r > 1.5*g & r > 1.5*b) {
        colour = 'red';
    } else  if (g > 1.5*r & g > 1.5*b) {
        colour = 'green';
    } else  if (b > 1.5*r & b > 1.5*g) {
        colour = 'blue';
    } else  if (b > 2*r & b > g) {
        colour = 'blue';
    } else if (r > 240 & r > b & r > g) {
        colour = 'red';
    } else  if (g > 240 & g > r & g > b) {
        colour = 'green';
    } else  if (b > 240 & b > r & b > g) {
        colour = 'blue';
    } else if (r == 0 & g == 0 & b == 0) {
        colour = 'black';
    } else if (r == 255 & g == 255 & b == 255) {
        colour = 'white';
    } else if (r === g & b === g) {
        colour = 'gray';
    } else if (colourNameToHex(rgbToHex(r, g, b))) {
        colour = colourNameToHex(rgbToHex(r, g, b));
    }
    return colour;
};