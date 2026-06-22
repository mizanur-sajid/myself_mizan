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
    <div className="quill-glass" style={{ width: '100%' }}>
      <ReactQuill 
        theme="snow" 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder}
      />
    </div>
  );
};
