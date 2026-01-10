import { useEffect, useState } from 'react';
import './styles.css';
import ScreenOverlay from './ScreenOverlay';

function SnipperTool() {
  const [imageURL, setImageURL] = useState<string | null>(null);

  const captureScreen = async () => {
    const img = await window.electronAPI.getScreenshot();
    setImageURL(img);
  };

  const onCloseOverlay = () => {
    setImageURL(null);
    window.close();
  }

  const onNewCapture = () => {
    setImageURL(null);
    captureScreen();
  }

  useEffect(()=>{
    captureScreen();
  },[])

  return (
    <>
      {
        imageURL && 
        <ScreenOverlay
          imageURL={imageURL}
          onNewSnip={onNewCapture}
          onClose={onCloseOverlay}
        />
      }
    </>
  );
}

export default SnipperTool;