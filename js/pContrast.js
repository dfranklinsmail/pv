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

        var canvas = $('#canvas');
        var jCanvas = canvas.getContext('2d');
        console.log('jCanvas context');
        console.log(jCanvas);
        var textureCanvas = $(document).getElementById('canvas');
        var context = textureCanvas.getContext('2');
        console.log('canvas context')
        console.log(context);
    });

});