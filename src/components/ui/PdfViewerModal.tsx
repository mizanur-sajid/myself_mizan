'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  Lock, 
  FileText, 
  Loader2, 
  AlertCircle,
  RotateCcw
} from 'lucide-react';

interface PdfViewerModalProps {
  url: string | null;
  title?: string;
  onClose: () => void;
}

export function PdfViewerModal({ url, title = 'Research Paper', onClose }: PdfViewerModalProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageInput, setPageInput] = useState<string>('1');
  const [scale, setScale] = useState<number>(1.2);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingStatus, setLoadingStatus] = useState<string>('Initializing viewer...');
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const pdfDocRef = useRef<any>(null);
  const renderTaskRef = useRef<any>(null);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (url) {
      document.body.style.overflow = 'hidden';
      setCurrentPage(1);
      setPageInput('1');
      setScale(1.2);
      setError(null);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [url]);

  // Handle keyboard shortcuts (Navigating pages, closing, and blocking Ctrl+S / Ctrl+P)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Block Save (Ctrl+S / Cmd+S) and Print (Ctrl+P / Cmd+P)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p' || e.key === 'S' || e.key === 'P')) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Arrow keys for page navigation if not focused on input
      if (document.activeElement?.tagName !== 'INPUT') {
        if (e.key === 'ArrowRight' || e.key === 'PageDown') {
          e.preventDefault();
          setCurrentPage(prev => Math.min(prev + 1, numPages || prev));
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          e.preventDefault();
          setCurrentPage(prev => Math.max(prev - 1, 1));
        } else if (e.key === 'Home') {
          e.preventDefault();
          setCurrentPage(1);
        } else if (e.key === 'End' && numPages > 0) {
          e.preventDefault();
          setCurrentPage(numPages);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, numPages]);

  // Synchronize page input string with current page number
  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  // Load PDF document using streaming fetch and legacy pdfjs-dist
  const loadDocument = useCallback(async () => {
    if (!url) return;

    setLoading(true);
    setError(null);
    setLoadingProgress(0);
    setLoadingStatus('Downloading document...');

    let abortController = new AbortController();

    try {
      // 1. Fetch file with streaming progress
      const response = await fetch(url, { signal: abortController.signal });
      if (!response.ok) {
        throw new Error(`Failed to load document (${response.status} ${response.statusText})`);
      }

      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      let arrayBuffer: ArrayBuffer;

      if (response.body && total > 0) {
        const reader = response.body.getReader();
        const chunks: Uint8Array[] = [];
        let loaded = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(value);
            loaded += value.length;
            const percent = Math.min(99, Math.round((loaded / total) * 100));
            setLoadingProgress(percent);
            setLoadingStatus(`Downloading document... ${percent}%`);
          }
        }

        const combined = new Uint8Array(loaded);
        let offset = 0;
        for (const chunk of chunks) {
          combined.set(chunk, offset);
          offset += chunk.length;
        }
        arrayBuffer = combined.buffer;
      } else {
        arrayBuffer = await response.arrayBuffer();
      }

      setLoadingStatus('Rendering PDF pages...');
      setLoadingProgress(100);

      // 2. Load pdfjs library (legacy build with universal compatibility)
      // @ts-ignore
      const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
      if (pdfjsLib.GlobalWorkerOptions) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
      }

      // 3. Parse PDF document
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
        cMapUrl: '/cmaps/',
        cMapPacked: true,
      });

      const doc = await loadingTask.promise;
      pdfDocRef.current = doc;
      setNumPages(doc.numPages);
      setCurrentPage(1);
      setLoading(false);
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      console.error('PDF Load Error:', err);
      setError(err?.message || 'Failed to open PDF document.');
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    loadDocument();

    return () => {
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // ignore
        }
        renderTaskRef.current = null;
      }
      if (pdfDocRef.current) {
        try {
          pdfDocRef.current.destroy();
        } catch {
          // ignore
        }
        pdfDocRef.current = null;
      }
    };
  }, [loadDocument]);

  // Render current page onto canvas
  const renderCurrentPage = useCallback(async () => {
    if (!pdfDocRef.current || !canvasRef.current || currentPage < 1) return;

    try {
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // ignore
        }
        renderTaskRef.current = null;
      }

      const page = await pdfDocRef.current.getPage(currentPage);
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext('2d', { alpha: false });
      if (!context) return;

      const pixelRatio = window.devicePixelRatio || 1;
      const viewport = page.getViewport({ scale });

      canvas.width = Math.floor(viewport.width * pixelRatio);
      canvas.height = Math.floor(viewport.height * pixelRatio);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';

      const renderContext = {
        canvasContext: context,
        transform: pixelRatio !== 1 ? [pixelRatio, 0, 0, pixelRatio, 0, 0] : undefined,
        viewport,
      };

      const task = page.render(renderContext);
      renderTaskRef.current = task;
      await task.promise;
      renderTaskRef.current = null;
    } catch (err: any) {
      if (err?.name !== 'RenderingCancelledException') {
        console.error('Page render error:', err);
      }
    }
  }, [currentPage, scale]);

  useEffect(() => {
    if (!loading && pdfDocRef.current) {
      renderCurrentPage();
    }
  }, [loading, currentPage, scale, renderCurrentPage]);

  // Page navigation helpers
  const handlePrevPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPage(prev => Math.min(prev + 1, numPages));
  };

  const handlePageInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const parsed = parseInt(pageInput, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= numPages) {
        setCurrentPage(parsed);
      } else {
        setPageInput(currentPage.toString());
      }
    }
  };

  // Zoom helpers
  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(prev => Math.min(Number((prev + 0.2).toFixed(1)), 3.0));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(prev => Math.max(Number((prev - 0.2).toFixed(1)), 0.6));
  };

  const handleResetZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(1.2);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      modalRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <AnimatePresence>
      {url && (
        <motion.div
          ref={modalRef}
          data-lenis-prevent="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          onContextMenu={(e) => e.preventDefault()}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(7, 11, 20, 0.94)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
        >
          {/* Header Toolbar */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(15, 23, 42, 0.85)',
              gap: '1rem',
              flexWrap: 'wrap',
              zIndex: 10,
            }}
          >
            {/* Left: Document info & View-Only Shield */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <div style={{ padding: '6px', borderRadius: '8px', background: 'var(--primary-alpha-10)', border: '1px solid var(--primary-alpha-20)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={18} color="var(--primary-color)" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <span style={{ color: '#fff', fontSize: '0.92rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '320px' }}>
                  {title}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Lock size={10} color="#38bdf8" /> Protected View • Download Disabled
                </span>
              </div>
            </div>

            {/* Center: Pagination controls */}
            {numPages > 0 && !loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.06)', padding: '4px 10px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage <= 1}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: currentPage <= 1 ? 'rgba(255, 255, 255, 0.25)' : '#fff',
                    padding: '4px',
                    borderRadius: '4px',
                    cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title="Previous Page (←)"
                >
                  <ChevronLeft size={18} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#fff' }}>
                  <span>Page</span>
                  <input
                    type="text"
                    value={pageInput}
                    onChange={(e) => setPageInput(e.target.value)}
                    onKeyDown={handlePageInputSubmit}
                    onBlur={() => setPageInput(currentPage.toString())}
                    style={{
                      width: '36px',
                      padding: '2px 4px',
                      borderRadius: '4px',
                      background: 'rgba(255, 255, 255, 0.12)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#fff',
                      fontSize: '0.85rem',
                      textAlign: 'center',
                      outline: 'none',
                    }}
                  />
                  <span style={{ color: '#94a3b8' }}>/ {numPages}</span>
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= numPages}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: currentPage >= numPages ? 'rgba(255, 255, 255, 0.25)' : '#fff',
                    padding: '4px',
                    borderRadius: '4px',
                    cursor: currentPage >= numPages ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title="Next Page (→)"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            {/* Right: Zoom & Close Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255, 255, 255, 0.06)', padding: '4px 6px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <button
                  onClick={handleZoomOut}
                  disabled={scale <= 0.6}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: scale <= 0.6 ? 'rgba(255, 255, 255, 0.25)' : '#fff',
                    padding: '5px',
                    borderRadius: '6px',
                    cursor: scale <= 0.6 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title="Zoom Out"
                >
                  <ZoomOut size={16} />
                </button>
                <button
                  onClick={handleResetZoom}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '0.8rem',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                  title="Reset Zoom"
                >
                  {Math.round(scale * 100)}%
                </button>
                <button
                  onClick={handleZoomIn}
                  disabled={scale >= 3.0}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: scale >= 3.0 ? 'rgba(255, 255, 255, 0.25)' : '#fff',
                    padding: '5px',
                    borderRadius: '6px',
                    cursor: scale >= 3.0 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title="Zoom In"
                >
                  <ZoomIn size={16} />
                </button>
              </div>

              <button
                onClick={toggleFullscreen}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#fff',
                  padding: '6px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>

              <button
                onClick={onClose}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#f87171',
                  padding: '6px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Close (Esc)"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* PDF Viewer Body */}
          <div
            data-lenis-prevent="true"
            onClick={(e) => e.stopPropagation()}
            style={{
              flex: 1,
              width: '100%',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: loading || error ? 'center' : 'flex-start',
              padding: '2rem 1rem',
              boxSizing: 'border-box',
              position: 'relative',
            }}
          >
            {/* Loading Indicator */}
            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: '#fff' }}>
                <Loader2 size={36} className="animate-spin" color="var(--primary-color)" />
                <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500 }}>
                  {loadingStatus}
                </p>
                <div style={{ width: '240px', height: '5px', background: 'rgba(255, 255, 255, 0.12)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${loadingProgress > 0 ? loadingProgress : 15}%`,
                      background: 'linear-gradient(90deg, var(--primary-color), var(--accent-color))',
                      transition: 'width 0.2s ease',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: '#f87171', background: 'rgba(239, 68, 68, 0.1)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <AlertCircle size={36} />
                <p style={{ margin: 0, fontSize: '0.95rem', textAlign: 'center' }}>{error}</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={loadDocument}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      background: 'var(--primary-color)',
                      border: 'none',
                      color: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <RotateCcw size={14} /> Retry
                  </button>
                  <button
                    onClick={onClose}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Canvas Container with Protection Overlay */}
            <div
              style={{
                display: loading || error ? 'none' : 'block',
                position: 'relative',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
                borderRadius: '4px',
                lineHeight: 0,
                background: '#ffffff',
              }}
              onContextMenu={(e) => e.preventDefault()}
            >
              <canvas
                ref={canvasRef}
                style={{
                  display: 'block',
                  maxWidth: '100%',
                  borderRadius: '4px',
                }}
              />

              {/* Transparent Security Overlay - Prevents Right-Click Image Saving & Dragging */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'transparent',
                  pointerEvents: 'auto',
                  cursor: 'default',
                }}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
