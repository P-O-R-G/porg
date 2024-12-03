import { useState, useRef, useCallback, useEffect } from 'react'
//import { Route, Routes, useNavigate } from "react-router-dom";
import React from 'react'
import Webcam from 'react-webcam'
import Header from './components/Header.jsx';
import doPreProcessing from './preprocessing.js'
import askChat from './chat.js'
import './App.css'

function App() {
  const [isCapturing, setIsCapturing] = useState(false)
  const [captureInterval, setCaptureInterval] = useState(1);
  const [processedFrames, setProcessedFrames] = useState(0);
  const [prediction, setPrediction] = useState('');
  const [fullString, setFullString] = useState('');
  const [englishString, setEnglishString] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [chatGPTCounter, setChatGPTCounter] = useState(1);
  const webcamRef = useRef(null);
  const captureIntervalRef = useRef(null);
  //const navigate = useNavigate();

  const incrementChatGPTCount = () => {
    setChatGPTCounter(c => c + 1);
  }

  useEffect(() => {
    // Ask ChatGPT for best guess of English translation every 5 seconds (as a function of capture interval)
    if (chatGPTCounter >= (5 / captureInterval)) {
      setChatGPTCounter(0);
      askChatGPT();
    }
  }, [chatGPTCounter])

  const sendFrame = async (imageSrc) => {
    // Send image to model for inference
    try {
      var imageStr = imageSrc.replace(/^data:image\/(png|jpeg);base64,/, '');

      const json = fetch('http://127.0.0.1:8080/image_inference', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({ "image": imageStr }),
      }).then((response) => {
        if (!response.ok) {
          console.error('Failed to process frame');
        } else {
          setProcessedFrames((prev) => prev + 1);
          return response.json();
        }
      }).then((json) => {
        setPrediction(json.pred_class);
        setConfidence(json.prob);
        if (parseFloat(json.prob) > 0.85) {
          setFullString(prevMessage => prevMessage + json.pred_class);
        } else {
          setFullString(prevMessage => prevMessage + '?');
        }
        return json;
      }).then(() => {
        // Increment counter to check when we should ask ChatGPT for English translation
        incrementChatGPTCount();
      });
    } catch (error) {
      console.error('Error sending frame to backend:', error);
    }
  };

  const askChatGPT = async () => {
    try {
      const responseText = await askChat(fullString);
      console.log(responseText);
      setEnglishString(responseText);
    } catch(err) {
      console.log("Error: ", err)
    }    
  }

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    const processedFrame = doPreProcessing(imageSrc);
    sendFrame(imageSrc); // is there a reason we send the source image and not hte preprocessed image?

  }, [webcamRef])

  const startCapture = useCallback(() => {
    if (captureIntervalRef.current) { // fix issue with restarting capture not working
      clearInterval(captureIntervalRef.current);
    }
    setIsCapturing(true);
    captureIntervalRef.current = setInterval(capture, captureInterval * 1000);
  }, [capture, captureInterval])

  const stopCapture = useCallback(() => {
    if (captureIntervalRef.current) { // fix issue with restarting capture not working
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
    setIsCapturing(false);
  }, []);

  const resetMessage = useCallback(() => {
    setFullString("");
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
    <div className="app-container">
      <Header />
      
      <div className="main-content">
        <div className="webcam-container">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="webcam"
          />
          <button
            onClick={isCapturing ? stopCapture : startCapture}
            className={`capture-button ${isCapturing ? 'capturing' : ''}`}
          >
            {isCapturing ? 'Stop Capture' : 'Start Capture'}
          </button>
        </div>

        <div className="prediction-container">
          <h3>Translation</h3>
          <div className="prediction-display">
            {prediction || 'No translation yet'}
            {confidence == 0 ? "" : " (confidence " + confidence + ")"}
          </div>
          <div className="prediction-display">
            {"Message: " + fullString}
            <div>
            <button
                onClick={resetMessage}
                className={`capturing`}
              >
                {'Reset Message'}
              </button>
            </div>
          </div>
          <div className="prediction-display">
            {"English: " + englishString}
          </div>
          <div className="prediction-display">
            {"ChatGPT Counter: " + chatGPTCounter}
          </div>
        </div>
      </div>

      <div className="diagnostic-section">
        <div className="preview-container">
          <h3>Diagnostics</h3>
          <canvas id="preProcessing_preview" width="256" height="auto"></canvas>
        </div>
        <div className="controls">
          <div className="interval-control">
            <label htmlFor="captureInterval">Capture Interval (seconds):</label>
            <input
              type="number"
              id="captureInterval"
              value={captureInterval}
              onChange={handleIntervalChange}
              min="0.1"
              step="0.1"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App