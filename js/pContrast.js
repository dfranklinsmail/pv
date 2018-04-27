$(document).ready(function () {

    $('#calculate-contrast').click(function (event) {

        var canvas = document.getElementsByTagName("canvas");
        //var canvas = $('#canvas');
        var arrayLength = canvas.arraylength;
        for (var c of canvas) {
            //var c = canvas[i];
            var jCanvas = c.getContext('webgl');
            if (jCanvas !== null) {
                console.log('the length of the canvas');
                var cWidth = c.width;
                console.log(cWidth);
                console.log('the height of the canvas');
                var cHeight = c.height;
                console.log(cHeight);
                console.log('jCanvas context');
                console.log(jCanvas);

                var pixels = processData(0, 0, cWidth, cHeight, jCanvas);

                var colourNumbersCount = countColours(pixels);

                displayColourNumbercount(colourNumbersCount);
            }
        }
       
    });






});


function processData (x, y, width, height, webGlContext) {
    var pixels = new Uint8Array(width * height * 4);
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

function displayColourNumbercount (colourCounts) {
    console.log('The colour counts are :');
    for(var i = 0; i < colourCounts.arrayLength; i++) {

        str = i + ' : ' + colourcounts[i];
        console.log(str);
    }
};