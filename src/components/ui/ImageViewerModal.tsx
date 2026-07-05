import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, Maximize, Download, Timer } from 'lucide-react';

interface ImageViewerModalProps {
  src: string | null;
  onClose: () => void;
  countdown?: number | null;
}

export function ImageViewerModal({ src, onClose, countdown }: ImageViewerModalProps) {
  const [scale, setScale] = useState(1);
  const imgRef = useRef<HTMLImageElement>(null);
  const [baseSize, setBaseSize] = useState({ width: 0, height: 0 });

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (src) {
      document.body.style.overflow = 'hidden';
      setScale(1); // Reset scale when opening a new image
      setBaseSize({ width: 0, height: 0 }); // Reset base size
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [src]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (scale === 1 && imgRef.current) {
      setBaseSize({
        width: imgRef.current.clientWidth,
        height: imgRef.current.clientHeight
      });
    }
    setScale(prev => Math.min(prev + 0.5, 4));
  };
  
  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(prev => Math.max(prev - 0.5, 0.5));
  };
  
  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(1);
  };

  const handleImageLoad = () => {
    if (imgRef.current && scale === 1) {
      setBaseSize({
        width: imgRef.current.clientWidth,
        height: imgRef.current.clientHeight
      });
    }
  };

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          data-lenis-prevent="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Toolbar */}
          <style>{`
            .iv-toolbar {
              padding: 1rem 2rem;
              gap: 1rem;
              flex-wrap: nowrap;
            }
            .iv-actions {
              gap: 1rem;
            }
            .iv-countdown {
              font-size: 0.95rem;
              padding: 6px 16px;
            }
            .iv-image-container {
              padding: 2rem;
            }
            @media (max-width: 640px) {
              .iv-toolbar {
                padding: 1rem;
                flex-wrap: wrap;
                justify-content: center;
              }
              .iv-actions {
                gap: 0.5rem;
                width: 100%;
                justify-content: center;
              }
              .iv-countdown {
                font-size: 0.85rem;
                padding: 4px 12px;
              }
              .iv-image-container {
                padding: 1rem;
              }
            }
          `}</style>
          <div 
            onClick={(e) => e.stopPropagation()}
            className="iv-toolbar"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            {/* Left side: Countdown */}
            <div style={{ color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              {countdown !== undefined && countdown !== null && (
                 <div className="iv-countdown" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '100px', border: '1px solid rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', whiteSpace: 'nowrap' }}>
                   <Timer size={16} style={{ flexShrink: 0 }} /> Next image in {countdown} seconds
                 </div>
              )}
            </div>

            {/* Right side: Actions */}
            <div className="iv-actions" style={{ display: 'flex', alignItems: 'center' }}>
              <button onClick={handleZoomOut} style={{ background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#fff', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Zoom Out">
                <ZoomOut size={20} />
              </button>
              <button onClick={handleReset} style={{ background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#fff', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Reset Zoom">
                <Maximize size={20} />
              </button>
              <button onClick={handleZoomIn} style={{ background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#fff', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Zoom In">
                <ZoomIn size={20} />
              </button>
              <a 
                href={src} 
                download 
                onClick={(e) => e.stopPropagation()}
                style={{ background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#fff', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }} 
                title="Download Image"
              >
                <Download size={20} />
              </a>
              <div style={{ width: '1px', height: '24px', background: 'rgba(255, 255, 255, 0.2)', margin: '0 0.5rem' }}></div>
              <button onClick={onClose} style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.5)', color: '#f87171', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Close">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Image Container */}
          <div 
            data-lenis-prevent="true"
            style={{ 
              flex: 1, 
              width: '100%',
              overflow: scale === 1 ? 'hidden' : 'auto', 
              display: 'flex', 
              flexDirection: 'column'
            }}
          >
            <div 
              className="iv-image-container"
              onClick={(e) => e.stopPropagation()} 
              style={{ 
                flex: scale === 1 ? '1' : '0 0 auto',
                minHeight: 0,
                minWidth: '100%',
                width: scale === 1 ? '100%' : 'fit-content',
                height: scale === 1 ? '100%' : 'fit-content',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                ref={imgRef}
                src={src} 
                alt="Enlarged view" 
                onLoad={handleImageLoad}
                style={{ 
                  width: scale === 1 ? '100%' : `${baseSize.width * scale}px`,
                  height: scale === 1 ? '100%' : `${baseSize.height * scale}px`,
                  maxWidth: scale === 1 ? '100%' : 'none', 
                  maxHeight: scale === 1 ? '100%' : 'none', 
                  objectFit: 'contain', 
                  display: 'block',
                  borderRadius: '8px', 
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  transition: 'width 0.2s ease-out, height 0.2s ease-out',
                  imageRendering: 'high-quality',
                  WebkitFontSmoothing: 'antialiased'
                }} 
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
