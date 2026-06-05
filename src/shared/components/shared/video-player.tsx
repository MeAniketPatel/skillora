"use client";

import { useEffect, useRef, useState } from "react";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  RotateCcw, 
  Settings 
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { updateVideoProgress, toggleLessonCompletion } from "@/features/enrollment/actions/enrollment.actions";

interface VideoPlayerProps {
  courseId: string;
  lessonId: string;
  videoUrl: string;
  initialPosition?: number;
  onComplete?: () => void;
}

export function VideoPlayer({
  courseId,
  lessonId,
  videoUrl,
  initialPosition = 0,
  onComplete,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      if (initialPosition > 0 && initialPosition < video.duration) {
        video.currentTime = initialPosition;
      }
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [initialPosition]);

  // Save progress periodically (throttled)
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (videoRef.current && currentTime > 0) {
        updateVideoProgress(courseId, lessonId, Math.floor(currentTime));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, currentTime, courseId, lessonId]);

  // Controls visibility timeout on mouse idle
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
      clearTimeout(timeoutId);
    };
  }, [isPlaying]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput = activeEl?.tagName === "INPUT" || activeEl?.tagName === "TEXTAREA";
      if (isInput) return;

      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        skip(10);
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        skip(-10);
      } else if (e.code === "KeyM") {
        e.preventDefault();
        toggleMute();
      } else if (e.code === "KeyF") {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPlaying]);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
      updateVideoProgress(courseId, lessonId, Math.floor(video.currentTime));
    } else {
      video.play().catch(() => {});
      setIsPlaying(true);
    }
  }

  function handleTimeUpdate() {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  }

  function skip(amount: number) {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        Math.max(0, videoRef.current.currentTime + amount),
        duration
      );
    }
  };

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.muted = false;
      setIsMuted(false);
      if (volume === 0) setVolume(0.5);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  function handleSpeedChange(rate: number) {
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  }

  function toggleFullscreen() {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }

  async function handleVideoEnded() {
    setIsPlaying(false);
    if (videoRef.current) {
      await updateVideoProgress(courseId, lessonId, Math.floor(videoRef.current.duration));
      await toggleLessonCompletion(courseId, lessonId, true);
      if (onComplete) onComplete();
    }
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div 
      ref={containerRef}
      className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-950 shadow-2xl group select-none"
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="h-full w-full object-contain cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnded}
        playsInline
      />

      {/* Glassmorphic Play/Pause Center Indicator */}
      {!isPlaying && (
        <div 
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] transition-opacity cursor-pointer"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md border border-white/30 shadow-lg hover:scale-110 hover:bg-white/30 transition-all duration-300">
            <Play className="h-8 w-8 fill-current ml-1 text-white" />
          </div>
        </div>
      )}

      {/* Control Overlay */}
      <div 
        className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent transition-opacity duration-300 flex flex-col gap-3 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Progress Bar */}
        <div className="flex items-center gap-3 w-full">
          <span className="text-xs text-slate-200 min-w-[35px]">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-slate-700/60 accent-primary focus:outline-none"
            style={{
              background: `linear-gradient(to right, oklch(0.645 0.246 16.08) ${(currentTime / (duration || 1)) * 100}%, rgba(51, 65, 85, 0.6) ${(currentTime / (duration || 1)) * 100}%)`
            }}
          />
          <span className="text-xs text-slate-200 min-w-[35px]">
            {formatTime(duration)}
          </span>
        </div>

        {/* Bottom Control Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 h-9 w-9 rounded-lg"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 h-9 w-9 rounded-lg"
              onClick={() => skip(-10)}
              title="Rewind 10s"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2 group/volume">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 h-9 w-9 rounded-lg"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-0 overflow-hidden group-hover/volume:w-20 transition-all duration-300 h-1 rounded bg-slate-700 accent-white cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Playback Rate Control */}
            <div className="relative">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20 text-xs px-2 h-9 gap-1 rounded-lg"
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              >
                <Settings className="h-4 w-4" />
                {playbackRate}x
              </Button>

              {showSpeedMenu && (
                <div className="absolute bottom-11 right-0 bg-slate-900/95 border border-slate-800 rounded-lg shadow-xl py-1 w-20 flex flex-col backdrop-blur-md">
                  {[0.5, 1, 1.25, 1.5, 2].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handleSpeedChange(rate)}
                      className={`text-xs text-left px-3 py-1.5 hover:bg-white/10 transition-colors ${
                        playbackRate === rate ? "text-primary font-medium" : "text-white"
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 h-9 w-9 rounded-lg"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
