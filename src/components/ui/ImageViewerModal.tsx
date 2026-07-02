import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, Maximize, Download } from 'lucide-react';

interface ImageViewerModalProps {
  src: string | null;
  onClose: () => void;
}

export function ImageViewerModal({ src, onClose }: ImageViewerModalProps) {
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
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              padding: '1rem 2rem',
              gap: '1rem',
            }}
          >
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

          {/* Image Container */}
          <div 
            data-lenis-prevent="true"
            style={{ 
              flex: 1, 
              width: '100%',
              overflow: 'auto', 
              display: 'flex', 
              flexDirection: 'column'
            }}
          >
            <div 
              onClick={(e) => e.stopPropagation()} 
              style={{ 
                flex: '1 0 auto',
                minWidth: '100%',
                width: 'fit-content',
                padding: '2rem',
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
                  width: scale === 1 ? 'auto' : `${baseSize.width * scale}px`,
                  height: scale === 1 ? 'auto' : `${baseSize.height * scale}px`,
                  maxWidth: scale === 1 ? '90vw' : 'none', 
                  maxHeight: scale === 1 ? '80vh' : 'none', 
                  objectFit: 'contain', 
                  display: 'block',
                  borderRadius: '8px', 
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  transition: 'width 0.2s ease-out, height 0.2s ease-out'
                }} 
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
