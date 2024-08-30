"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import jsQR from 'jsqr';

const QRCodeScanner: React.FC = () => {
  const [scannedUserId, setScannedUserId] = useState('');
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
  }, [])

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
          if (code) {
            const match = code.data.match(/https:\/\/somesite\.com\/user\/(\w+)/);
            if (match && match[1]) {
              setScannedUserId(match[1]);
              return; // Stop scanning after successful read
            }
          }
        }
      }
      requestAnimationFrame(tick);
    }
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Scan QR Code</h2>
      <div>
        <video ref={videoRef} className="hidden" />
        <canvas ref={canvasRef} className="border" />
      </div>
      {scannedUserId && (
        <p className="mt-4">
          Scanned User ID: <strong>{scannedUserId}</strong>
        </p>
      )}
    </div>
  );
};

export default QRCodeScanner;