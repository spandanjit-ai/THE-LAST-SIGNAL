import React, { useState, useEffect } from 'react';
import { SoundFX } from '../../utils/audio';

interface TerminalTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  playAudio?: boolean;
  onComplete?: () => void;
}

export const TerminalText: React.FC<TerminalTextProps> = ({
  text,
  speed = 25,
  delay = 0,
  className = '',
  playAudio = false,
  onComplete,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;
    setDisplayedText('');

    timeoutId = setTimeout(() => {
      setIsTyping(true);
      let currentIndex = 0;

      intervalId = setInterval(() => {
        if (currentIndex < text.length) {
          currentIndex++;
          setDisplayedText(text.slice(0, currentIndex));
          if (playAudio && currentIndex % 3 === 0) {
            SoundFX.playTick();
          }
        } else {
          clearInterval(intervalId);
          setIsTyping(false);
          if (onComplete) onComplete();
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [text, speed, delay, playAudio, onComplete]);

  return (
    <span className={`inline font-mono ${className}`}>
      {displayedText}
      {isTyping && (
        <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-pulse align-middle" />
      )}
    </span>
  );
};
