'use client';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { Bold, Italic, Underline, Link2, ListOrdered, List, Eraser } from 'lucide-react';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const CustomToolbar = () => (
  <div id="quill-toolbar" style={{ border: 'none', borderBottom: '1px solid var(--glass-border)', padding: '12px 16px', display: 'flex', gap: '8px', flexWrap: 'wrap', background: 'rgba(0,0,0,0.2)' }}>
    <button className="ql-bold" style={{ color: 'var(--text-secondary)' }}><Bold size={16} /></button>
    <button className="ql-italic" style={{ color: 'var(--text-secondary)' }}><Italic size={16} /></button>
    <button className="ql-underline" style={{ color: 'var(--text-secondary)' }}><Underline size={16} /></button>
    <div style={{ width: '1px', background: 'var(--glass-border)', margin: '0 8px' }} />
    <button className="ql-link" style={{ color: 'var(--text-secondary)' }}><Link2 size={16} /></button>
    <div style={{ width: '1px', background: 'var(--glass-border)', margin: '0 8px' }} />
    <button className="ql-list" value="ordered" style={{ color: 'var(--text-secondary)' }}><ListOrdered size={16} /></button>
    <button className="ql-list" value="bullet" style={{ color: 'var(--text-secondary)' }}><List size={16} /></button>
    <div style={{ width: '1px', background: 'var(--glass-border)', margin: '0 8px' }} />
    <button className="ql-clean" style={{ color: 'var(--text-secondary)' }}><Eraser size={16} /></button>
  </div>
);

export const RichEditor = ({ value, onChange, placeholder }: RichEditorProps) => {
  return (
    <div className="quill-glass custom-quill-container" style={{ width: '100%', position: 'relative' }}>
      <CustomToolbar />
      <ReactQuill 
        theme="snow" 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder}
        modules={{
          toolbar: {
            container: '#quill-toolbar'
          }
        }}
      />
      <style dangerouslySetInnerHTML={{__html: `
        .custom-quill-container .ql-container.ql-snow {
          border: none !important;
          font-family: inherit;
          font-size: 1rem;
          color: var(--text-primary);
        }
        .custom-quill-container .ql-editor {
          min-height: 150px;
          padding: 16px 20px;
        }
        .custom-quill-container .ql-editor.ql-blank::before {
          color: var(--text-secondary);
          opacity: 0.6;
          left: 20px;
        }
        .custom-quill-container .ql-toolbar.ql-snow {
          border: none;
          border-bottom: 1px solid var(--glass-border);
          font-family: inherit;
        }
        .custom-quill-container button {
          transition: color 0.2s;
        }
        .custom-quill-container button:hover {
          color: var(--primary-color) !important;
        }
        .custom-quill-container button.ql-active {
          color: var(--primary-color) !important;
        }
        /* Hide default Quill SVGs */
        .custom-quill-container .ql-toolbar button svg.ql-stroke,
        .custom-quill-container .ql-toolbar button svg.ql-fill {
          display: none;
        }
      `}} />
    </div>
  );
};
