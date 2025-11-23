import React, { useEffect, useRef, useState } from 'react';
import { processScan } from '../services/storage';
import { Member, Staff } from '../types';
import { CheckCircle, XCircle, Camera } from 'lucide-react';

const Scanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    member?: Member;
    staff?: Staff;
  } | null>(null);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    let animationFrameId: number;
    
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          videoRef.current.play();
          requestAnimationFrame(tick);
        }
      } catch (err) {
        console.error("Error accessing camera", err);
      }
    };

    const tick = () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && scanning) {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.height = videoRef.current.videoHeight;
            canvas.width = videoRef.current.videoWidth;
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            // @ts-ignore
            const code = window.jsQR ? window.jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" }) : null;

            if (code) {
              handleScan(code.data);
              return; // Stop tick until reset
            }
          }
        }
      }
      if(scanning) animationFrameId = requestAnimationFrame(tick);
    };

    if (scanning) startCamera();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (videoRef.current && videoRef.current.srcObject) {
         // @ts-ignore
         const tracks = videoRef.current.srcObject.getTracks();
         tracks.forEach((track: any) => track.stop());
      }
    };
  }, [scanning]);

  const handleScan = (data: string) => {
    setScanning(false);
    const result = processScan(data);
    setScanResult(result);

    // Auto reset after 3 seconds
    setTimeout(() => {
      setScanResult(null);
      setScanning(true);
    }, 3000);
  };

  const simulateScan = () => {
     // Simulating a scan for testing without camera
     const id = prompt("Enter Member UUID (Check LocalStorage or Member List URL):", "MEMBER:...");
     if(id) handleScan(id);
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-4 relative">
      <div className="absolute top-0 left-0 right-0 p-4 bg-dark/80 text-white text-center z-10">
        <h2 className="text-xl font-bold text-primary">ENTRANCE SCANNER</h2>
        <p className="text-xs text-gray-400">Point camera at member QR Code</p>
      </div>

      <div className="relative w-full max-w-md aspect-square bg-black rounded-3xl overflow-hidden border-4 border-gray-800 shadow-2xl">
        {!scanResult && (
           <>
            <video ref={videoRef} className="w-full h-full object-cover opacity-80" />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 border-4 border-primary/50 rounded-lg relative">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-primary"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-primary"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-primary"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-primary"></div>
              </div>
            </div>
           </>
        )}

        {scanResult && (
          <div className={`absolute inset-0 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-300 ${scanResult.success ? 'bg-green-500' : 'bg-red-500'}`}>
            {scanResult.success ? <CheckCircle size={80} className="text-white mb-4" /> : <XCircle size={80} className="text-white mb-4" />}
            <h2 className="text-3xl font-bold text-white mb-2">{scanResult.success ? 'ACCESS GRANTED' : 'ACCESS DENIED'}</h2>
            <p className="text-white text-lg font-medium">{scanResult.message}</p>
            {scanResult.member && (
              <div className="mt-6 bg-white/20 p-4 rounded-xl text-white">
                <p className="text-sm opacity-80">Sessions Left</p>
                <p className="text-2xl font-bold">{scanResult.member.remainingSessions ?? 'Unlimited'}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-8">
        <button onClick={simulateScan} className="text-gray-500 text-xs underline hover:text-white">
          Problems with camera? Simulate Scan
        </button>
      </div>
    </div>
  );
};

export default Scanner;