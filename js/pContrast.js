$(document).ready(function () {

    $('#calculate-contrast').click(function (event) {
        // console.log("calculate contrast clicked!");

        // console.log($('canvas elements '));
        // var arrayOfCanvas = $('div#viewer canvas')
        // console.log(arrayOfCanvas);
        // console.log('first element ');
        // var firstElement = arrayOfCanvas[0];
        // console.log(firstElement);
        // console.log('context');
        // var context = firstElement.getContext('2d');
        // console.log(context);
        // console.log('imagedata ');
        // var imageData = firstElement.imageData;
        // console.log(imageData);
       
        // $('div#viewer canvas').forEach(element => {
            
        //    var context =  element.getContext("2d");
        //    console.log(context);
        // });
        var canvas = document.getElementsByTagName("canvas");
        //var canvas = $('#canvas');
        var arrayLength = canvas.arraylength;
        for (var c of canvas) {
            //var c = canvas[i];
            var jCanvas = c.getContext('2d');
            if (jCanvas !== null) {
                console.log('the length of the canvas');
                var cWidth = c.width;
                console.log(cWidth);
                console.log('the height of the canvas');
                var cHeight = c.height;
                console.log(cHeight);
                console.log('jCanvas context');
                console.log(jCanvas);
                //console.log(jCanvas.getImageData());
                var imgData = jCanvas.getImageData(0,0,cWidth, cHeight);
                console.log(imgData);

            }
        }
       
    });

});