"use client";

import { useEffect, useRef } from "react";

interface SplashScreenProps {
  onComplete: () => void;
  fadeOut?: boolean;
}

export function SplashScreen({ onComplete, fadeOut }: SplashScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Forzar reproducción automática en iOS
    const forcePlay = async () => {
      try {
        video.muted = true;
        video.playsInline = true;
        video.preload = 'auto';
        
        // Intentar reproducir inmediatamente
        await video.play();
      } catch (error) {
        // Si falla el autoplay, intentar de nuevo después de un breve delay
        setTimeout(async () => {
          try {
            await video.play();
          } catch (secondError) {
            console.log('Autoplay failed, but continuing with video element');
          }
        }, 100);
      }
    };

    // Event listeners
    const handleLoadedData = () => forcePlay();
    const handleCanPlay = () => forcePlay();
    
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('ended', onComplete);

    // Intentar reproducir inmediatamente cuando se monta el componente
    forcePlay();

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('ended', onComplete);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-100 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
        webkit-playsinline="true"
        x5-video-player-type="h5-page"
        x5-video-player-fullscreen="false"
        onEnded={onComplete}
      >
        <source src="/videos/entry-animationmobile.mp4" type="video/mp4" />
        {/* Fallback para navegadores sin soporte de video */}
        <div className="text-white text-2xl font-bold">X ROOFING & SOLAR</div>
      </video>
    </div>
  );
}