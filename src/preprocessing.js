import {redrawCanvas} from 'lena.js';
import {grayscale} from 'lena.js';

// does preprocessing for the diagnostic box to show off what the model is processing
var  doPreProcessing = (function(imageSrc) {
    // get & load the canvas
    var previewCanvas = document.getElementById('preProcessing_preview');
    // force canvas to be square
    previewCanvas.width = previewCanvas.height;
    var previewContext = previewCanvas.getContext("2d");
    var previewIm = new Image();

    // wait for the image to be ready
    previewIm.onload = function() {
        //console.log("im: " + previewIm.width + " " + previewIm.height);
        // downscale the image
        var targetRes = 224;
        previewIm.height = previewIm.height / previewIm.width * targetRes;
        previewIm.width = targetRes;
        
        // fill the background of the image with black
        previewContext.fillRect(0, 0, previewCanvas.width, previewCanvas.width);
        // draw the original image to the canvas when ready
        var imHei = previewIm.height / previewIm.width * previewCanvas.height;
        previewContext.drawImage(previewIm, 0, (previewCanvas.height - imHei)/2, previewCanvas.width, imHei);

        // turn the image back to a JPEG & return the src
        var newSrc = previewCanvas.toDataURL("image/jpeg");
        return newSrc;
    };

    // set the source of the preview image (technically runs before the block above, since the block waits for the image to be ready)
    previewIm.src = imageSrc;
});

export default doPreProcessing;