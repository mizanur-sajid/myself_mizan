import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

interface PdfViewerModalProps {
  url: string | null;
  onClose: () => void;
}

export function PdfViewerModal({ url, onClose }: PdfViewerModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfDocRef = useRef<any>(null);
  const renderTaskRef = useRef<Map<number, boolean>>(new Map());

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (url) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [url]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Load PDF using pdf.js
  useEffect(() => {
    if (!url) {
      pdfDocRef.current = null;
      setNumPages(0);
      setCurrentPage(1);
      setError(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    (async () => {
      try {
        // Dynamic import to avoid SSR issues
        const pdfjsLib = await import('pdfjs-dist');
        
        // Set the worker source to use the bundled worker
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

        const loadingTask = pdfjsLib.getDocument(encodeURI(url));
        const pdf = await loadingTask.promise;
        
        if (cancelled) return;
        
        pdfDocRef.current = pdf;
        setNumPages(pdf.numPages);
        setCurrentPage(1);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load PDF:', err);
        if (!cancelled) {
          setError('Failed to load document. Please try downloading it instead.');
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [url]);

  // Render a specific page to a canvas
  const renderPage = useCallback(async (pageNum: number) => {
    const pdf = pdfDocRef.current;
    if (!pdf || !containerRef.current) return;

    // Prevent duplicate renders
    if (renderTaskRef.current.get(pageNum)) return;
    renderTaskRef.current.set(pageNum, true);

    try {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale });

      // Find or create the canvas for this page
      const canvasId = `pdf-page-${pageNum}`;
      let canvas = containerRef.current.querySelector(`#${canvasId}`) as HTMLCanvasElement | null;
      
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = canvasId;
        canvas.style.display = 'block';
        canvas.style.margin = '0 auto 16px auto';
        canvas.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        containerRef.current.appendChild(canvas);
      }

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const context = canvas.getContext('2d');
      if (!context) return;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;
    } catch (err) {
      console.error(`Failed to render page ${pageNum}:`, err);
    } finally {
      renderTaskRef.current.set(pageNum, false);
    }
  }, [scale]);

  // Render all pages when PDF is loaded or scale changes
  useEffect(() => {
    if (!pdfDocRef.current || numPages === 0) return;
    
    // Clear existing canvases
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }
    renderTaskRef.current.clear();

    // Render all pages
    for (let i = 1; i <= numPages; i++) {
      renderPage(i);
    }
  }, [numPages, scale, renderPage]);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));

  const scrollToPage = (pageNum: number) => {
    if (!containerRef.current) return;
    const canvas = containerRef.current.querySelector(`#pdf-page-${pageNum}`);
    if (canvas) {
      canvas.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setCurrentPage(pageNum);
    }
  };

  return (
    <AnimatePresence>
      {url && (
        <motion.div
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
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0.75rem 2rem',
              gap: '0.75rem',
              flexWrap: 'wrap',
            }}
          >
            {/* Page Navigation */}
            {numPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.35rem 0.75rem' }}>
                <button
                  onClick={() => scrollToPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                  style={{ background: 'none', border: 'none', color: currentPage <= 1 ? 'rgba(255,255,255,0.3)' : '#fff', cursor: currentPage <= 1 ? 'default' : 'pointer', display: 'flex', padding: '2px' }}
                >
                  <ChevronLeft size={18} />
                </button>
                <span style={{ color: '#fff', fontSize: '0.85rem', fontVariantNumeric: 'tabular-nums' }}>
                  {currentPage} / {numPages}
                </span>
                <button
                  onClick={() => scrollToPage(Math.min(numPages, currentPage + 1))}
                  disabled={currentPage >= numPages}
                  style={{ background: 'none', border: 'none', color: currentPage >= numPages ? 'rgba(255,255,255,0.3)' : '#fff', cursor: currentPage >= numPages ? 'default' : 'pointer', display: 'flex', padding: '2px' }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            {/* Zoom Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.35rem 0.75rem' }}>
              <button onClick={handleZoomOut} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', padding: '2px' }}>
                <ZoomOut size={18} />
              </button>
              <span style={{ color: '#fff', fontSize: '0.85rem', minWidth: '3em', textAlign: 'center' }}>
                {Math.round(scale * 100)}%
              </span>
              <button onClick={handleZoomIn} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', padding: '2px' }}>
                <ZoomIn size={18} />
              </button>
            </div>

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Download */}
            <a 
              href={encodeURI(url)} 
              download 
              style={{ background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', fontSize: '0.9rem' }} 
              title="Download PDF"
            >
              <Download size={18} /> Download
            </a>
            <div style={{ width: '1px', height: '24px', background: 'rgba(255, 255, 255, 0.2)' }}></div>
            <button onClick={onClose} style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.5)', color: '#f87171', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Close">
              <X size={20} />
            </button>
          </div>

          {/* PDF Container */}
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              flex: 1, 
              overflow: 'auto', 
              padding: '0 2rem 2rem 2rem',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div 
              ref={containerRef}
              style={{ 
                maxWidth: '1000px',
                width: '100%',
                paddingTop: '8px',
              }}
            />
            
            {/* Loading State */}
            {isLoading && (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '400px',
                gap: '1rem',
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid rgba(255,255,255,0.2)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Loading document...</span>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '400px',
                gap: '1rem',
                color: '#f87171',
              }}>
                <X size={48} />
                <span style={{ fontSize: '1rem', textAlign: 'center' }}>{error}</span>
                <a 
                  href={encodeURI(url)} 
                  download 
                  style={{ color: '#fff', background: 'rgba(255,255,255,0.15)', padding: '0.5rem 1.5rem', borderRadius: '8px', textDecoration: 'none', marginTop: '0.5rem' }}
                >
                  Download Instead
                </a>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
