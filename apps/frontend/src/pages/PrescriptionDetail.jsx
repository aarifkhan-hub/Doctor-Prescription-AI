import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getPrescription } from '../services/prescriptionService';
import Badge from '../components/ui/Badge.jsx';
import MedicineCard from '../components/prescription/MedicineCard.jsx';
import ExplanationPanel from '../components/prescription/ExplanationPanel.jsx';
import LoadingScreen from '../components/ui/LoadingScreen.jsx';

export default function PrescriptionDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setP(await getPrescription(id));
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <LoadingScreen />;
  if (!p) return <p>Not found.</p>;

  return (
    <div className="space-y-6">
      <Link to="/history" className="btn-ghost inline-flex"><ArrowLeft size={16} /> Back</Link>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Prescription</h1>
          <p className="text-sm text-slate-500">
            {new Date(p.createdAt).toLocaleString()} · Model {p.modelVersion || '—'}
          </p>
        </div>
        <Badge status={p.status} />
      </div>

      {p.requiresReview && (
        <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-sm">
          ⚠️ Low confidence — please verify with your doctor.
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <img src={p.image?.secureUrl} alt="prescription" className="rounded-2xl w-full border border-slate-200 dark:border-slate-800" />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-semibold">Medicines ({p.medicines?.length || 0})</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {p.medicines?.map((m, i) => <MedicineCard key={i} m={m} index={i} />)}
          </div>
        </div>
      </div>

      <ExplanationPanel explanation={p.explanation} />

      <details className="card p-5">
        <summary className="cursor-pointer font-semibold">Raw OCR output</summary>
        <pre className="text-xs mt-3 whitespace-pre-wrap">{p.ocr?.cleanedText || p.ocr?.rawText}</pre>
      </details>
    </div>
  );
}
