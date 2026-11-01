"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Film } from "@/content/films";
import {
  CloseIcon,
  FullscreenIcon,
  PauseIcon,
  PlayIcon,
  VolumeIcon,
} from "@/components/ui/Icons";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const whole = Math.floor(seconds);
  const minutes = Math.floor(whole / 60);
  const remainder = whole % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

export function VideoPlayer({ film, onClose }: { film: Film; onClose?: () => void }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const togglePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    setError(null);
    if (video.paused) {
      try {
        await video.play();
      } catch {
        setError("This film could not begin playing. Please try again.");
      }
    } else {
      video.pause();
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }, []);

  const handleVolume = (value: number) => {
    const video = videoRef.current;
    setVolume(value);
    if (!video) return;
    video.volume = value;
    if (value === 0) {
      video.muted = true;
      setMuted(true);
    } else if (video.muted) {
      video.muted = false;
      setMuted(false);
    }
  };

  const handleScrub = (value: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = value;
    setTime(value);
  };

  const toggleFullscreen = useCallback(async () => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await wrapper.requestFullscreen();
      }
    } catch {
      setError("Fullscreen is not available in this browser.");
    }
  }, []);

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    setVolume(video.volume);
    setMuted(video.muted);
    return () => {
      video.pause();
    };
  }, []);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (["INPUT", "BUTTON", "A"].includes(target.tagName)) return;
    const video = videoRef.current;
    if (!video) return;
    if (event.key === " " || event.key.toLowerCase() === "k") {
      event.preventDefault();
      void togglePlay();
    } else if (event.key.toLowerCase() === "m") {
      event.preventDefault();
      toggleMute();
    } else if (event.key.toLowerCase() === "f") {
      event.preventDefault();
      void toggleFullscreen();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      handleScrub(Math.max(0, video.currentTime - 5));
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      handleScrub(Math.min(video.duration || 0, video.currentTime + 5));
    }
  };

  const percent = duration > 0 ? (time / duration) * 100 : 0;

  return (
    <div
      ref={wrapperRef}
      className={`video-player video-player--${film.aspect}`}
      onKeyDown={onKeyDown}
      tabIndex={0}
      aria-label={`Video player: ${film.title}`}
    >
      <div className="video-surface">
        <video
          ref={videoRef}
          src={film.src}
          poster={film.poster.src}
          preload="metadata"
          playsInline
          onClick={() => void togglePlay()}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
          onLoadedMetadata={(event) => {
            setDuration(event.currentTarget.duration || 0);
            setError(null);
          }}
          onError={() => setError("This film could not be loaded. Please try again later.")}
        >
          {film.captions?.map((track) => (
            <track
              key={track.src}
              kind="captions"
              src={track.src}
              srcLang={track.lang}
              label={track.label}
              default={track.default}
            />
          ))}
        </video>

        {!playing ? (
          <button
            type="button"
            className="video-center-play"
            onClick={() => void togglePlay()}
            aria-label={`Play ${film.title}`}
          >
            <span className="video-center-play-ring">
              <PlayIcon size={22} />
            </span>
            <span className="video-center-play-label">Play study</span>
          </button>
        ) : null}

        <div className="video-topline">
          <span className="video-topline-title">{film.title}</span>
          <span className="video-topline-meta">
            {film.typeLabel} · {film.duration}
            {film.silent ? " · Silent" : ""}
          </span>
        </div>

        <div className="video-controls">
          <button
            type="button"
            className="video-control"
            onClick={() => void togglePlay()}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
          </button>

          <span className="video-time">{formatTime(time)}</span>

          <div className="video-progress">
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={Math.min(time, duration || 0)}
              onChange={(event) => handleScrub(Number(event.target.value))}
              aria-label="Seek through the film"
              style={{ "--progress": `${percent}%` } as React.CSSProperties}
            />
          </div>

          <span className="video-time video-time--duration">{formatTime(duration)}</span>

          {film.silent ? (
            <span className="video-silent-label">Silent</span>
          ) : (
            <div className="video-volume">
              <button
                type="button"
                className="video-control"
                onClick={toggleMute}
                aria-label={muted ? "Unmute" : "Mute"}
              >
                <VolumeIcon muted={muted} />
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                onChange={(event) => handleVolume(Number(event.target.value))}
                aria-label="Volume"
              />
            </div>
          )}

          <button
            type="button"
            className="video-control"
            onClick={() => void toggleFullscreen()}
            aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            <FullscreenIcon />
          </button>

          {onClose ? (
            <button type="button" className="video-control video-close" onClick={onClose} aria-label="Close player">
              <CloseIcon />
            </button>
          ) : null}
        </div>
      </div>

      {error ? (
        <p className="video-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
