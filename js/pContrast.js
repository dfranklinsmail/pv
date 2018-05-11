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
}

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
}