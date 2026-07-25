import { Globe } from 'lucide-react';

export default function ExplanationPanel({ explanation }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-2 text-brand-600">
          <Globe size={16} /><h3 className="font-semibold">English</h3>
        </div>
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{explanation?.en || '—'}</p>
      </div>
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-2 text-brand-600">
          <Globe size={16} /><h3 className="font-semibold">हिन्दी</h3>
        </div>
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{explanation?.hi || '—'}</p>
      </div>
    </div>
  );
}
