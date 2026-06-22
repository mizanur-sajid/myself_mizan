'use client';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const RichEditor = ({ value, onChange, placeholder }: RichEditorProps) => {
  return (
    <div style={{ background: '#fff', color: '#000', borderRadius: '8px', overflow: 'hidden' }}>
      <ReactQuill 
        theme="snow" 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder}
        style={{ height: '200px', borderBottom: 'none' }}
      />
    </div>
  );
};
