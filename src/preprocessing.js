import {redrawCanvas} from 'lena.js';
import {grayscale} from 'lena.js';

// prepares the image for the actual processing
// right now, it just turns the image to grayscale to show that something is happening at all
// additionally, this writes the image to the preview canvas (which needs to exist for this function to work)
var  doPreProcessing = (function(imageSrc) {
    // get & load the canvas
    var previewCanvas = document.getElementById('preProcessing_preview');
    var previewContext = previewCanvas.getContext("2d");
    var previewIm = new Image();

    // wait for the image to be ready
    previewIm.onload = function() {
        // draw the original image to the canvas when ready
        previewContext.drawImage(previewIm, 0, 0, previewCanvas.width, previewCanvas.height);

        // apply the filter using Lena.js
        redrawCanvas(previewCanvas, grayscale);

        // turn the image back to a JPEG & return the src
        var newSrc = previewCanvas.toDataURL("image/jpeg");
        return newSrc;
    };

    // set the source of the preview image (technically runs before the block above, since the block waits for the image to be ready)
    previewIm.src = imageSrc;
});

export default doPreProcessing;