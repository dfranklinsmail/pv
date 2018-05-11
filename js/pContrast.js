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
    for (i = 0; i < pixels.length; i = i + 3) { 
        hexColour = rgbToHex(pixels[i], pixels[i+1], pixels[i+2]);
        console.log('the hex colour code is '+hexColour);
        console.log(colourNameToHex(hexColour));
    }
};

function colourNameToHex(colour)
{
    var colours = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
    "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
    "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
    "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
    "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
    "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
    "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
    "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
    "honeydew":"#f0fff0","hotpink":"#ff69b4",
    "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
    "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
    "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
    "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
    "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
    "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
    "navajowhite":"#ffdead","navy":"#000080",
    "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
    "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
    "rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
    "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
    "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
    "violet":"#ee82ee",
    "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
    "yellow":"#ffff00","yellowgreen":"#9acd32"};

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