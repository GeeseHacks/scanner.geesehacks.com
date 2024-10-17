"use client";

import React, { useRef, useCallback, useEffect } from 'react';
import jsQR from 'jsqr';

interface QRCodeScannerProps {
  setScannedData: (data: string) => void; // Function to update the scanned data in the parent component
  title: string
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ setScannedData, title }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const init = async () => {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            requestAnimationFrame(tick);
          }
        }
        init();
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    }
  }, []);

  const tick = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            setScannedData(code.data); // Write the scanned data to the parent state with any data
            return; // Stop scanning after successful read
          }
        }
      }
      requestAnimationFrame(tick);
    }
  }, [setScannedData]);

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <p className="text-center w-full py-3">{title}</p>

      {/* <h2 className="text-xl font-semibold mb-2">Scan QR Code</h2> */}
      <div className="h-full flex justify-center overflow-x-hidden">
        <video ref={videoRef} className="hidden" />
        <canvas ref={canvasRef} className="h-full" />
      </div>
    </div>
  );
};

export default QRCodeScanner;
