import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, History as HistoryIcon, Activity, FileText } from 'lucide-react';
import { listPrescriptions } from '../services/prescriptionService';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ total: 0, done: 0, failed: 0 });

  useEffect(() => {
    (async () => {
      try {
        const data = await listPrescriptions(1, 5);
        setItems(data.items);
        setStats({
          total: data.total,
          done: data.items.filter((p) => p.status === 'DONE').length,
          failed: data.items.filter((p) => p.status === 'FAILED').length,
        });
      } catch (_) { /* ignore */ }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hi {user?.fullName?.split(' ')[0]} 👋</h1>
        <p className="text-slate-500">Here’s a summary of your prescriptions.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Stat icon={<FileText />} label="Total" value={stats.total} />
        <Stat icon={<Activity />} label="Processed" value={stats.done} />
        <Stat icon={<HistoryIcon />} label="Failed" value={stats.failed} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-brand-600 to-brand-800 text-white">
          <h2 className="font-semibold">Upload a new prescription</h2>
          <p className="text-sm text-white/80 mt-1">Drop a photo and we’ll do the rest.</p>
          <Link to="/upload" className="inline-flex mt-4 items-center gap-2 bg-white text-brand-700 rounded-lg px-4 py-2 text-sm font-semibold">
            <Upload size={16} /> Upload now
          </Link>
        </Card>
        <Card>
          <h2 className="font-semibold">Recent</h2>
          <ul className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
            {items.length === 0 && <li className="text-sm text-slate-500 py-2">No prescriptions yet.</li>}
            {items.map((p) => (
              <li key={p._id} className="py-2 flex items-center justify-between">
                <Link to={`/history/${p._id}`} className="text-sm hover:underline">
                  {new Date(p.createdAt).toLocaleString()}
                </Link>
                <Badge status={p.status} />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </Card>
  );
}
