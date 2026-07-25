import { Pill, Clock, Calendar, InfoIcon } from 'lucide-react';

export default function MedicineCard({ m, index }) {
  return (
    <div className="card p-5 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 flex items-center justify-center">
            <Pill size={18} />
          </div>
          <div>
            <p className="font-semibold">{m.normalizedName || m.name}</p>
            {m.name !== m.normalizedName && m.normalizedName && (
              <p className="text-xs text-slate-500">Detected: {m.name}</p>
            )}
          </div>
        </div>
        <span className="text-xs text-slate-400">#{index + 1}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-slate-500 text-xs">Dose</p>
          <p className="font-medium">{m.dosage || '—'}</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs flex items-center gap-1"><Clock size={12} />Frequency</p>
          <p className="font-medium">{m.frequency || '—'}</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs flex items-center gap-1"><Calendar size={12} />Duration</p>
          <p className="font-medium">{m.duration || '—'}</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs flex items-center gap-1"><InfoIcon size={12} />Instructions</p>
          <p className="font-medium">{m.instructions || '—'}</p>
        </div>
      </div>
    </div>
  );
}
