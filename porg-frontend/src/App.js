import './App.css';

import React, { useState } from 'react';
import Webcam from 'react-webcam';

const App = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const webcamRef = React.useRef(null);

  const startCapture = () => {
    setIsCapturing(true);
  };

  const stopCapture = () => {
    setIsCapturing(false);
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
        {isCapturing ? (
          <button onClick={stopCapture}>Stop Capture</button>
        ) : (
          <button onClick={startCapture}>Start Capture</button>
        )}
      </div>
    </div>
  );
};

export default App;