import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { listPrescriptions, deletePrescription } from '../services/prescriptionService';
import Badge from '../components/ui/Badge.jsx';

export default function History() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = async (p = page) => {
    setLoading(true);
    try {
      const data = await listPrescriptions(p, 12);
      setItems(data.items);
      setPages(data.pages || 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(page); }, [page]);

  const onDelete = async (id) => {
    if (!confirm('Delete this prescription?')) return;
    try {
      await deletePrescription(id);
      toast.success('Deleted');
      load(page);
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">History</h1>
      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-slate-500">No prescriptions yet.</p>
      ) : (
        <div className="grid gap-3">
          {items.map((p) => (
            <div key={p._id} className="card p-4 flex items-center gap-4">
              <img src={p.image?.secureUrl} alt="preview" className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1">
                <Link to={`/history/${p._id}`} className="font-medium hover:underline">
                  {new Date(p.createdAt).toLocaleString()}
                </Link>
                <p className="text-xs text-slate-500">
                  {p.medicines?.length || 0} medicine(s) · {p.modelVersion || '-'}
                </p>
              </div>
              <Badge status={p.status} />
              <button onClick={() => onDelete(p._id)} className="btn-ghost text-rose-500" aria-label="Delete">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center justify-center gap-2 pt-4">
        <button className="btn-outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span className="text-sm">{page} / {pages}</span>
        <button className="btn-outline" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}
