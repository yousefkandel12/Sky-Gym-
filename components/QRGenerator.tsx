import React, { useEffect, useRef } from 'react';

interface Props {
  value: string;
  size?: number;
}

const QRGenerator: React.FC<Props> = ({ value, size = 128 }) => {
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (qrRef.current) {
      qrRef.current.innerHTML = '';
      // Use the global QRCode library loaded in index.html
      // @ts-ignore
      new window.QRCode(qrRef.current, {
        text: value,
        width: size,
        height: size,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : 0 // L
      });
    }
  }, [value, size]);

  return <div ref={qrRef} className="bg-white p-2 rounded-lg shadow-inner inline-block" />;
};

export default QRGenerator;