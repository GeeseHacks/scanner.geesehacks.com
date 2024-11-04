"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import jsQR from "jsqr";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface QRCodeScannerProps {
  setScannedData: (data: string) => void; // Function to update the scanned data in the parent component
  title: string;
  isCheckIn?: boolean;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ setScannedData, title, isCheckIn = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null); // To store the media stream
  const [manualEntry, setManualEntry] = useState(false);
  const [manualData, setManualData] = useState("");

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          frameRate: { ideal: 30, max: 60 }, // Set ideal and maximum frame rates
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        requestAnimationFrame(tick);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    if (!manualEntry) {
      initializeCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera(); // Clean up on component unmount
    };
  }, [manualEntry]);

  const tick = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            setScannedData(code.data); // Write the scanned data to the parent state
            return; // Stop scanning after successful read
          }
        }
      }
      requestAnimationFrame(tick);
    }
  }, [setScannedData]);

  const handleManualEntryToggle = () => {
    setManualEntry((prev) => !prev);
  };

  const handleManualDataSubmit = () => {
    if (manualData.trim() !== "") {
      // Add the prefix to the manualData
      const prefixedData = !isCheckIn
      ? `https://portal.geesehacks.com/user/${manualData}`
      : manualData;
      setScannedData(prefixedData);
      setManualEntry(false);
      setManualData("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isCheckIn) {
      // Allow only valid email characters
      const emailRegex = /^[a-zA-Z0-9@._-]*$/;
      if (emailRegex.test(value)) {
        setManualData(value);
      }
    } else {
      // Allow only lowercase letters and dashes
      const qrCodeRegex = /^[a-z-]*$/;
      if (qrCodeRegex.test(value)) {
        setManualData(value);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleManualDataSubmit();
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <p className="text-center w-full py-3">
        {!manualEntry ? title : (isCheckIn ? "Enter Email Manually" : "Enter QR Code Manually")}
      </p>

      {!manualEntry && 
        <div className="h-full flex justify-center items-center overflow-hidden rounded-xl">
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover"
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          </div>
        </div>
      }


      {!manualEntry && <Button
        className="mt-4 p-2 bg-blue-500 text-white rounded"
        onClick={handleManualEntryToggle}
      >Enter QR Code Manually
      </Button> }
      

      {manualEntry && (
        <div className="flex flex-col items-center h-full justify-between">
          <Input
            type="text"
            value={manualData}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="p-2 mt-6 border border-gray-300 rounded w-3/4"
            placeholder={isCheckIn ? "mr.goose@geesehacks.com" : "joyful-goose"}
          />
            <div className="flex flex-row gap-4 w-full justify-center mt-4">
              <Button
                className="w-full h-12 bg-[#dc3545] text-lg"
                onClick={handleManualEntryToggle}
              >
                Back to Scanner
              </Button>
              <Button
                className="w-full h-12 bg-[#28a745] text-lg"
                onClick={handleManualDataSubmit}
              >
                Submit
              </Button>
            </div>


        </div>
      )}
    </div>
  );
};

export default QRCodeScanner;
