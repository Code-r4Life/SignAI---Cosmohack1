import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Play,
  Square,
  Loader2,
  Volume2,
  Video,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import clsx from "clsx";

const Detection = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [uploadFile, setUploadFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Refs for state that needs to be accessed in closures
  const isDetectingRef = useRef(false);

  useEffect(() => {
    return () => {
      // Cleanup preview URL on unmount
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      // Reset state on new file
      setResult(null);
      setIsDetecting(false);
      isDetectingRef.current = false;
    }
  };

  const startDetection = () => {
    setIsDetecting(true);
    isDetectingRef.current = true;
    processUpload();
  };

  const stopDetection = () => {
    setIsDetecting(false);
    isDetectingRef.current = false;
    setIsLoading(false);
    setResult(null);
  };

  const processUpload = async () => {
    if (!uploadFile) return;
    setIsLoading(true);
    await sendToBackend(uploadFile);
    setIsDetecting(false); // One-off for upload
    isDetectingRef.current = false;
    setIsLoading(false);
  };

  const sendToBackend = async (blob) => {
    const formData = new FormData();
    formData.append("video", blob, "video.webm");

    try {
      const response = await axios.post(
        "http://localhost:5000/predict",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Ignore response if detection stopped
      if (!isDetectingRef.current) {
        return;
      }

      if (response.data.error) {
        console.error("Backend Error:", response.data.error);
      }

      console.log(response.data);
      setResult(response.data);
      if (
        response.data.prediction &&
        response.data.confidence > 0.6 &&
        response.data.prediction !== "No Motion"
      ) {
        setHistory((prev) => [...prev, response.data.prediction]);
      }
    } catch (error) {
      if (!isDetectingRef.current) return;
      console.error(error);
      const msg = error.response?.data?.error || error.message;
      alert(
        `Backend Error: ${msg}. If this persists, please restart the backend server.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = () => {
    const text = history.join(" ");
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Sign Language Detection</h1>
          <p className="text-gray-400 mt-2">Upload a video to get sign predictions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column: Input */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Viewport */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden relative border border-white/10 shadow-lg">
              {previewUrl ? (
                <video
                  src={previewUrl}
                  controls
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Upload size={48} className="mb-4" />
                  <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors">
                    Choose File
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleUpload}
                    />
                  </label>
                </div>
              )}

              {/* Overlay */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10"
                  >
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-2" />
                    <p className="text-white font-medium">Processing...</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex justify-center mt-4">
               {!isDetecting ? (
                <button
                  onClick={startDetection}
                  disabled={!uploadFile}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 shadow-lg transition-all hover:scale-105"
                >
                  <Play size={20} /> Start Detection
                </button>
              ) : (
                <button
                  onClick={stopDetection}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 shadow-lg transition-all hover:scale-105"
                >
                  <Square size={20} /> Stop Detection
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Results Only (Viewport removed) */}
          <div className="space-y-6">
            {/* Current Result */}
            <div className="bg-surface border border-white/10 rounded-xl p-6 h-full flex flex-col justify-center">
              <h3 className="text-lg font-semibold mb-6 text-center border-b border-white/10 pb-2">
                Detection Result
              </h3>
              {result ? (
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2 animate-pulse">
                    {result.prediction}
                  </div>
                  <div className="text-sm text-gray-400 mb-6">
                    Confidence: {(result.confidence * 100).toFixed(1)}%
                  </div>
                  <div className="space-y-3">
                    {result.all_predictions?.slice(0, 3).map((p, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-sm bg-white/5 p-2 rounded"
                      >
                        <span>{p.sign}</span>
                        <span className="text-gray-400">
                          {(p.score * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <Loader2
                    className={clsx(
                      "w-12 h-12 text-blue-500 mx-auto mb-4",
                      isDetecting ? "animate-spin" : "opacity-20"
                    )}
                  />
                  <p className="text-gray-500 italic">
                    {isDetecting ? "Detecting..." : "Ready to detect"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom: Accumulated Text Report */}
        <div className="bg-surface border border-white/10 rounded-xl p-8 mb-20 relative">
          <h3 className="text-xl font-bold mb-4">Detection Report</h3>
          <div className="min-h-[100px] bg-black/30 rounded-lg p-6 font-mono text-lg text-gray-300">
            {history.length > 0
              ? history.join(" ")
              : "Predicted text will appear here..."}
          </div>

          <div className="absolute top-8 right-8 flex gap-2">
            <button
              onClick={speakText}
              className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors"
              title="Text to Speech"
            >
              <Volume2 size={20} />
            </button>
            <button
              onClick={() => setHistory([])}
              className="p-3 bg-red-600 hover:bg-red-700 rounded-full text-white transition-colors"
              title="Clear History"
            >
              <Square size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detection;
