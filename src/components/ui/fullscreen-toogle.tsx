import React from 'react';
import {Button, ButtonGroup} from "@heroui/button";

function FullScreenToggle() {
  const handleFullScreen = () => {
    //toggle fullscreen
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        }
    } 
  };

  return (
    <div>
      <Button
        onPress={handleFullScreen}
        isIconOnly
        className='hover:-translate-y-2 transition-all duration-300'
        >
        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 4h4m0 0v4m0-4-5 5M8 20H4m0 0v-4m0 4 5-5"/>
        </svg>
        </Button>
    </div>
  );
}

export default FullScreenToggle;