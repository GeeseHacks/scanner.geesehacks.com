"use client";

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

const profileUrl = 'https://geesehacks.com/user';

const QRCodeGenerator: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');

  useEffect(() => {
    if (userId) {
      generateQRCode();
    }
  }, [userId]);

  const generateQRCode = async () => {
    try {
      const url = `${profileUrl}/${userId}`;
      const dataURL = await QRCode.toDataURL(url);
      setQrCodeDataURL(dataURL);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-2">Generate QR Code</h2>
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="Enter user ID"
        className="border p-2 mr-2 text-black"
      />
      {qrCodeDataURL && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Generated QR Code:</h3>
          <img src={qrCodeDataURL} alt="QR Code" />
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;