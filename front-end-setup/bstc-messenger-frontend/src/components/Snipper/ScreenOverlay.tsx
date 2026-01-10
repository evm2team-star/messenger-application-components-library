import React, { useRef, useState, MouseEvent } from "react";
import "./styles.css";

interface Point {
  x: number;
  y: number;
}

interface ScreenOverlayProps {
  imageURL?: string; // base64 screenshot
  onNewSnip?: () => void;
  onClose?: () => void;
}

const copy = async (imageURL: string) => {
  await window.electronAPI.copyToClipboard(imageURL);
  };

const save = async (imageURL: string) => {
  await window.electronAPI.saveImage(imageURL);
};

const ScreenOverlay: React.FC<ScreenOverlayProps> = ({
  imageURL,
  onNewSnip,
  onClose
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [selection, setSelection] = useState<{ top: number; left: number; width: number; height: number }>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [endPoint, setEndPoint] = useState<Point | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const ResetStates = () => {
    setStartPoint(null);
    setEndPoint(null);
    setSelection({ top: 0, left: 0, width: 0, height: 0 });
  }

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if(e.button === 2)
    {
      ResetStates();
      return;
    }
    if(e.button !== 0) return;
    setIsDragging(true);
    setStartPoint({ x: e.clientX, y: e.clientY });
    setEndPoint({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setEndPoint({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    if (!startPoint || !endPoint) return;
    if(startPoint === endPoint)
    {
      ResetStates();
      return;
    }
    setIsDragging(false);
    cropImage();
  };

  const cropImage = () => {
    if (!startPoint || !endPoint || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();

    const x = Math.min(startPoint.x, endPoint.x);
    const y = Math.min(startPoint.y, endPoint.y);
    const width = Math.abs(endPoint.x - startPoint.x);
    const height = Math.abs(endPoint.y - startPoint.y);

    img.onload = () => {
      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

      // const croppedImage = canvas.toDataURL("image/png");
      // onNewSnip?.(croppedImage);
    };

    img.src = imageURL? imageURL : '';
  };

  React.useEffect(() => {
    if (startPoint && endPoint) {
      const top = Math.min(startPoint.y, endPoint.y);
      const left = Math.min(startPoint.x, endPoint.x);
      const width = Math.abs(endPoint.x - startPoint.x);
      const height = Math.abs(endPoint.y - startPoint.y);
      setSelection({ top, left, width, height });
    }
  }, [startPoint, endPoint]);

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="overlay-container"
    >
      {/* Frozen Screenshot */}
      <img
        className="overlay-background"
        src={imageURL}
        alt="Screenshot"
        draggable={false}
      />

      {/* Selection Rectangle */}
      {startPoint && endPoint && (
        <div
          style={{
            position: "fixed",
            left: Math.min(startPoint.x, endPoint.x),
            top: Math.min(startPoint.y, endPoint.y),
            width: Math.abs(endPoint.x - startPoint.x),
            height: Math.abs(endPoint.y - startPoint.y),
            border: "2px dashed #4A90E2",
            backgroundColor: "rgba(0, 0, 0, 0.15)",
            pointerEvents: "none",
          }}
        />
      )}

      <div style={{ marginTop: 10, position: "absolute", bottom: 10, left: 10, zIndex: 1001}}>
        <div style={{ display: "flex", gap: "1.2rem" }}>
          <button className='overlay-btn' onClick={() => {if (!imageURL) return; copy(imageURL);}}>Copy to Clipboard</button>
          <button className='overlay-btn' onClick={() => {if (!imageURL) return; save(imageURL);}}>Save</button>
          <button className='overlay-btn' onClick={() => {onNewSnip?.()}}>New</button>
          <button className='overlay-btn' onClick={() => {onClose?.();}}>Close</button>
        </div>
      </div>

      {/* Hidden canvas for cropping */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Top */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: selection.top,
          background: "rgba(0,0,0,0.5)",
          pointerEvents: "none",
          zIndex: 1000
        }}
      />

      {/* Bottom */}
      <div
        style={{
          position: "fixed",
          top: selection.top + selection.height,
          left: 0,
          width: "100%",
          height: `calc(100% - ${
            selection.top + selection.height
          }px)`,
          background: "rgba(0,0,0,0.5)",
          pointerEvents: "none",
          zIndex: 1000
        }}
      />

      {/* Left */}
      <div
        style={{
          position: "fixed",
          top: selection.top,
          left: 0,
          width: selection.left,
          height: selection.height,
          background: "rgba(0,0,0,0.5)",
          pointerEvents: "none",
          zIndex: 1000
        }}
      />

      {/* Right */}
      <div
        style={{
          position: "fixed",
          top: selection.top,
          left: selection.left + selection.width,
          width: `calc(100% - ${
            selection.left + selection.width
          }px)`,
          height: selection.height,
          background: "rgba(0,0,0,0.5)",
          pointerEvents: "none",
          zIndex: 1000
        }}
      />
      </div>
  );
};

export default ScreenOverlay;
