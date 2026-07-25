import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import clsx from 'clsx';

export default function UploadDropzone({ onFile, disabled }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 8 * 1024 * 1024,
    disabled,
    onDrop: (files) => files[0] && onFile(files[0]),
  });

  return (
    <div
      {...getRootProps()}
      className={clsx(
        'card border-2 border-dashed p-10 text-center cursor-pointer transition',
        isDragActive ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-900/20' : 'border-slate-300 dark:border-slate-700',
        disabled && 'opacity-60 cursor-not-allowed'
      )}
    >
      <input {...getInputProps()} />
      <div className="mx-auto w-14 h-14 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 flex items-center justify-center mb-3">
        <UploadCloud size={26} />
      </div>
      <p className="font-semibold">Drop your prescription image here</p>
      <p className="text-sm text-slate-500 mt-1">or click to select · JPG / PNG / WEBP · max 8 MB</p>
    </div>
  );
}
