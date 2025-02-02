import { useState } from "react";
import {Button } from "@heroui/button";
import { FiMaximize, FiMinimize } from "react-icons/fi";

function FullScreenToggle() {

    const [fullscreen, setFullscreen] = useState(false);
  const handleFullScreen = () => {
    //toggle fullscreen
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setFullscreen(!fullscreen); 
  };

  return (
    <div>
      <Button
        onPress={handleFullScreen}
        isIconOnly
        className='hover:-translate-y-1 transition-all duration-300'
        >
        {fullscreen ? <FiMinimize size={20} /> : <FiMaximize  size={20}/>}
        </Button>
    </div>
  );
}

export default FullScreenToggle;