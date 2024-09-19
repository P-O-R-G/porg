import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import './App.css';

const App = () => {
  // initial values
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureInterval, setCaptureInterval] = useState(1);
  const [processedFrames, setProcessedFrames] = useState(0);
  const webcamRef = useRef(null);
  const captureIntervalRef = useRef(null);

  // function to POST screenshots
  const sendFrame = async (imageSrc) => {
    try {
      const response = await fetch('/api/process-frame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ frame: imageSrc }),
      });
      
      // screenshot posted successfully
      if (response.ok) {
        setProcessedFrames(prev => prev + 1);
      } 
      // screenshot post failed
      else {
        console.error('Failed to process frame');
      }
    } catch (error) {
      console.error('Error sending frame to backend:', error);
    }
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    sendFrame(imageSrc);
  }, [webcamRef]);

  // start capture
  const startCapture = useCallback(() => {
    setIsCapturing(true);
    captureIntervalRef.current = setInterval(capture, captureInterval * 1000);
  }, [capture, captureInterval]);

  // stop capture 
  const stopCapture = useCallback(() => {
    setIsCapturing(false);
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
  );
};

export default App;