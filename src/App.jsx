import { useState, useRef, useCallback, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Webcam from 'react-webcam'
import doPreProcessing from './preprocessing.js'

function App() {
  const [count, setCount] = useState(0)

  const [isCapturing, setIsCapturing] = useState(false)
  const [captureInterval, setCaptureInterval] = useState(1);
  const [processedFrames, setProcessedFrames] = useState(0);
  const webcamRef = useRef(null);
  const captureIntervalRef = useRef(null);

  // send the image (encoded in base 64) to our processing backend API
  const sendFrame = async (imageSrc) => {
    try {
      // send the image to the API
      const response = await fetch('/api/process-frame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ frame: imageSrc }),
      });
  
      // screenshot posted successfully
      if (response.ok) {
        setProcessedFrames((prev) => prev + 1);
      } 
      // screenshot post failed
      else {
        console.error('Failed to process frame');
      }
    } catch (error) {
      console.error('Error sending frame to backend:', error);
    }
  };

  // gets a screenshot from the webcam then sends it to the backend
  const capture = useCallback(() => {
    // get image from webcam
    const imageSrc = webcamRef.current.getScreenshot();

    // do preprocessing
    const processedFrame = doPreProcessing(imageSrc);

    // send preprocessed frame to backend
    sendFrame(processedFrame);
  }, [webcamRef])

    // start capture
  const startCapture = useCallback(() => {
    setIsCapturing(true);
    captureIntervalRef.current = setInterval(capture, captureInterval * 1000);
  }, [capture, captureInterval])

  // stop capture
  const stopCapture = useCallback(() => {
    clearInterval(captureIntervalRef.current);
  }, []);
  useEffect(() => {
    return () => {
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
      }
    };
  }, []);

  const handleIntervalChange = (e) => {
    setCaptureInterval(Number(e.target.value));
  };

  return (
    <>
    <div className="App">
        <h1>PORG - Processing Of Real-time Gestures</h1>
        <h3>the most beautiful website u have ever seen</h3>
        <div>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            style={{ width: '512px', height: 'auto' }}
          />
        </div>
        {/* DEBUG: this is to see a preview of the image after preprocessing.
        This canvas needs to exist for the preprocessing to work, but it can be hidden once we no longer need it for debugging*/}
        <div>
          <canvas id="preProcessing_preview" width="256" height="auto"></canvas>
        </div>
        <div>
          <label htmlFor="captureInterval">Capture Interval (seconds): </label>
          <input
            type="number"
            id="captureInterval"
            value={captureInterval}
            onChange={handleIntervalChange}
            min="0.1"
            step="0.1"
          />
        </div>
        <div>
          {isCapturing ? (
            <button onClick={stopCapture}>Stop Capture</button>
          ) : (
            <button onClick={startCapture}>Start Capture</button>
          )}
        </div>
        <div>
          <p>Frames processed: {processedFrames}</p>
        </div>
      </div>
    </>
  )
}

export default App
