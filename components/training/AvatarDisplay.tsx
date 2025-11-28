"use client";

import { useState, useEffect, useRef } from "react";

interface AvatarDisplayProps {
  isSpeaking: boolean;
  token: string;
  currentText?: string;
}

export function AvatarDisplay({ isSpeaking, token, currentText }: AvatarDisplayProps) {
  const idleVideoRef = useRef<HTMLVideoElement>(null);
  const speakingVideoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [idleVideoUrl, setIdleVideoUrl] = useState<string>("");
  const [speakingVideoUrl, setSpeakingVideoUrl] = useState<string>("");

  // 🔒 Cargar videos de forma protegida al montar el componente
  useEffect(() => {
    const loadVideos = async () => {
      try {
        // Fetch video como blob para ocultar la ruta real
        const idleResponse = await fetch('/videos/avatarstop.mp4');
        const idleBlob = await idleResponse.blob();
        const idleBlobUrl = URL.createObjectURL(idleBlob);
        setIdleVideoUrl(idleBlobUrl);

        const speakingResponse = await fetch('/videos/Cooperative-Homeowner.mp4');
        const speakingBlob = await speakingResponse.blob();
        const speakingBlobUrl = URL.createObjectURL(speakingBlob);
        setSpeakingVideoUrl(speakingBlobUrl);

        console.log('[AVATAR] Videos loaded as blobs');
      } catch (error) {
        console.error('[AVATAR] Error loading videos:', error);
        // Fallback a rutas normales si falla
        setIdleVideoUrl('/videos/avatarstop.mp4');
        setSpeakingVideoUrl('/videos/Cooperative-Homeowner.mp4');
      }
    };

    loadVideos();

    // Cleanup: revocar URLs cuando se desmonte
    return () => {
      if (idleVideoUrl) URL.revokeObjectURL(idleVideoUrl);
      if (speakingVideoUrl) URL.revokeObjectURL(speakingVideoUrl);
    };
  }, []);

  // Sincronizar con isSpeaking del parent
  useEffect(() => {
    console.log('[AVATAR] isSpeaking changed:', isSpeaking);
    setIsPlaying(isSpeaking);
  }, [isSpeaking]);

  // Manejar la transición entre videos
  useEffect(() => {
    if (isPlaying) {
      console.log('[AVATAR] Starting speaking mode');
      
      // Pausar video quieto
      if (idleVideoRef.current) {
        idleVideoRef.current.pause();
      }
      
      // Reproducir video hablando desde el inicio
      if (speakingVideoRef.current && speakingVideoUrl) {
        speakingVideoRef.current.currentTime = 0;
        speakingVideoRef.current.play()
          .then(() => console.log('[AVATAR] Speaking video started'))
          .catch(err => console.log('[AVATAR] Speaking video play error:', err));
      }

    } else {
      console.log('[AVATAR] Stopping speaking mode');
      
      // Pausar video hablando
      if (speakingVideoRef.current) {
        speakingVideoRef.current.pause();
        speakingVideoRef.current.currentTime = 0;
      }
      
      // Reproducir video quieto
      if (idleVideoRef.current && idleVideoUrl) {
        idleVideoRef.current.play()
          .then(() => console.log('[AVATAR] Idle video resumed'))
          .catch(err => console.log('[AVATAR] Idle video play error:', err));
      }
    }
  }, [isPlaying, idleVideoUrl, speakingVideoUrl]);

  // Auto-play idle video al montar (solo cuando la URL está lista)
  useEffect(() => {
    if (idleVideoRef.current && idleVideoUrl) {
      idleVideoRef.current.play()
        .then(() => console.log('[AVATAR] Initial idle video started'))
        .catch(err => console.log('[AVATAR] Initial idle video play error:', err));
    }
  }, [idleVideoUrl]);

  // Detectar cuando el speaking video termina
  useEffect(() => {
    const speakingVideo = speakingVideoRef.current;
    if (!speakingVideo) return;

    const handleEnded = () => {
      console.log('[AVATAR] Speaking video ended - will loop');
    };

    speakingVideo.addEventListener('ended', handleEnded);

    return () => {
      speakingVideo.removeEventListener('ended', handleEnded);
    };
  }, []);

  // 🔒 Prevenir click derecho y arrastrar en los videos
  const preventContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  const preventDragStart = (e: React.DragEvent) => {
    e.preventDefault();
    return false;
  };

  return (
    <div className="w-full">
      <div 
        className="w-full bg-gray-900 rounded-2xl border-2 border-gray-700 overflow-hidden select-none"
        style={{ 
          height: '550px',
          position: 'relative'
        }}
        onContextMenu={preventContextMenu}
      >
        {/* Video Quieto (idle) */}
        {idleVideoUrl && (
          <video
            ref={idleVideoRef}
            src={idleVideoUrl}
            loop
            muted
            playsInline
            controlsList="nodownload nofullscreen noremoteplayback"
            disablePictureInPicture
            onContextMenu={preventContextMenu}
            onDragStart={preventDragStart}
            className="absolute inset-0 w-full h-full transition-opacity duration-300 pointer-events-none"
            style={{
              opacity: isPlaying ? 0 : 1,
              objectFit: 'cover',
              objectPosition: 'center center'
            }}
          />
        )}

        {/* Video Hablando (speaking) - ✅ CORREGIDO: AHORA CENTRADO */}
        {speakingVideoUrl && (
          <video
            ref={speakingVideoRef}
            src={speakingVideoUrl}
            loop
            muted
            playsInline
            controlsList="nodownload nofullscreen noremoteplayback"
            disablePictureInPicture
            onContextMenu={preventContextMenu}
            onDragStart={preventDragStart}
            className="absolute inset-0 w-full h-full transition-opacity duration-300 pointer-events-none"
            style={{
              opacity: isPlaying ? 1 : 0,
              objectFit: 'cover',
              objectPosition: 'center center'  // ✅ CORREGIDO: Era '60% center', ahora 'center center'
            }}
          />
        )}

        {/* Overlay transparente para prevenir inspección directa */}
        <div 
          className="absolute inset-0 z-10"
          style={{ pointerEvents: 'none' }}
        />
      </div>
    </div>
  );
}