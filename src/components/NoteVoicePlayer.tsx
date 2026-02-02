import { useState, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VoicePlaybackSheet } from './VoicePlaybackSheet';

interface NoteVoicePlayerProps {
  audioUrl: string;
  duration: number;
  onDelete: () => void;
  className?: string;
}

export const NoteVoicePlayer = ({ 
  audioUrl, 
  duration, 
  onDelete,
  className 
}: NoteVoicePlayerProps) => {
  const [isPlaybackOpen, setIsPlaybackOpen] = useState(false);
  const [waveformBars, setWaveformBars] = useState<number[]>([]);
  
  // Generate random waveform on mount
  useEffect(() => {
    const bars: number[] = [];
    for (let i = 0; i < 40; i++) {
      bars.push(0.2 + Math.random() * 0.8);
    }
    setWaveformBars(bars);
  }, []);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Inline Player Display */}
      <div 
        className={cn(
          "flex items-center gap-3 p-3 rounded-xl bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors",
          className
        )}
        onClick={() => setIsPlaybackOpen(true)}
      >
        {/* Play Button */}
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Play className="w-5 h-5 text-primary ml-0.5" />
        </div>
        
        {/* Waveform */}
        <div className="flex-1 flex items-center gap-[2px] h-8 overflow-hidden">
          {waveformBars.map((value, index) => (
            <div
              key={index}
              className="bg-muted-foreground/40 rounded-full"
              style={{
                width: '2px',
                height: `${Math.max(4, value * 24)}px`,
              }}
            />
          ))}
        </div>
        
        {/* Duration */}
        <span className="text-sm font-medium text-muted-foreground shrink-0">
          {formatTime(duration)}
        </span>
      </div>
      
      {/* Playback Sheet */}
      <VoicePlaybackSheet
        isOpen={isPlaybackOpen}
        onClose={() => setIsPlaybackOpen(false)}
        audioUrl={audioUrl}
        duration={duration}
        onDelete={onDelete}
      />
    </>
  );
};
