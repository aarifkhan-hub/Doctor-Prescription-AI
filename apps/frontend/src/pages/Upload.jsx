import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import UploadDropzone from '../components/prescription/UploadDropzone.jsx';
import { uploadPrescription } from '../services/prescriptionService';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [language, setLanguage] = useState('en');
  const nav = useNavigate();

  const handleUpload = async () => {
    if (!file) return;
    setBusy(true);
    try {
      const p = await uploadPrescription(file, language, setProgress);
      toast.success('Prescription processed');
      nav(`/history/${p._id}`);
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Upload failed');
    } finally {
      setBusy(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Upload prescription</h1>
        <p className="text-slate-500">JPG, PNG or WEBP up to 8 MB.</p>
      </div>

      <UploadDropzone onFile={setFile} disabled={busy} />

      {file && (
        <div className="card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button className="btn-ghost text-rose-500" onClick={() => setFile(null)} disabled={busy}>Remove</button>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-500">Explanation language:</label>
            <select className="input w-auto" value={language} onChange={(e) => setLanguage(e.target.value)} disabled={busy}>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
          {busy && (
            <div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
                <div className="h-full bg-brand-500 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {progress < 100 ? `Uploading… ${progress}%` : 'Analysing with AI… please wait'}
              </p>
            </div>
          )}
          <button className="btn-primary" onClick={handleUpload} disabled={busy}>
            {busy ? 'Processing…' : 'Analyse prescription'}
          </button>
        </div>
      )}
    </div>
  );
}
