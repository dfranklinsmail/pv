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

                console.log('data url');
                console.log(c.toDataURL());

                pngToCanvas(c.toDataURL("image/png"));
                
                var cHeight = c.height;
                console.log(cHeight);
                console.log('jCanvas context');
                console.log(webglContext);
                
                var imageData = getImageData(c)

                var pixels = processData(0, 0, cWidth, cHeight, webglContext);

                var colourNumbersCount = countColours(pixels);
                displayColourNumbercount(colourNumbersCount, cWidth * cHeight);

                extractColours(pixels);
            }
        }
       
    });






});


function processData (x, y, width, height, webGlContext) {
    var pixels = new Uint8Array(width * height * 4);
    console.log('reading pixels');
    console.log(width);
    console.log(height);
    webGlContext.readPixels(0, 0, width, height, webGlContext.RGBA, webGlContext.UNSIGNED_BYTE, pixels);
    console.log(pixels);

    return pixels;
};

function countColours (unit8Array) {
    var counts = new Array(255);
    for (var i in unit8Array) {
        if (isNaN(counts[unit8Array[i]])) {
            counts[unit8Array[i]] = 1;
        } else {
            counts[unit8Array[i]] = counts[unit8Array[i]] + 1;
        }
    }

    return counts;
};

function displayColourNumbercount (colourCounts, total) {
    colourCounts[204] = 0;
    colourCounts[255] = 0;
    console.log('The colour counts are :');
    for(var i = 0; i < colourCounts.length; i++) {
        var percentage = Math.floor(colourCounts[i]/total * 100); 
        str = i + ' : ' + colourCounts[i] + ' with ' + percentage + '%';
        console.log(str);
    }
};

function getImageData(webglCanvas) { 
    var offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = webglCanvas.width;
    offscreenCanvas.height = webglCanvas.height;
    var ctx = offscreenCanvas.getContext("2d");
    
    ctx.drawImage(webglCanvas,0,0);
    var imageData = ctx.getImageData(0,0, offscreenCanvas.width, offscreenCanvas.height);
    
    console.log(imageData.data);

    return imageData.data;
};


function pngToCanvas(srcImage) {
    var image = new Image();
    image.onload = function() {
        pngToCanvasCallback(image);
    }
    image.src = srcImage;
};

function pngToCanvasCallback(image) {
    var canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    var context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);

    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    // Now you can access pixel data from imageData.data.
    // It's a one-dimensional array of RGBA values.
    // Here's an example of how to get a pixel's color at (x,y)
    var x = 900;
    var y = 1000;
    var index = (y*imageData.width + x) * 4;
    var red = imageData.data[index];
    var green = imageData.data[index + 1];
    var blue = imageData.data[index + 2];
    var alpha = imageData.data[index + 3];
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