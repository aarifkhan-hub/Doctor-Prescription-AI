import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getSettings, updateSettings } from '../services/settingsService';
import { useTheme } from '../context/ThemeContext.jsx';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState(null);

  useEffect(() => { (async () => setSettings(await getSettings()))(); }, []);

  const save = async (patch) => {
    try {
      const s = await updateSettings({ ...settings, ...patch });
      setSettings(s);
      toast.success('Saved');
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="card p-5 space-y-3">
        <h2 className="font-semibold">Appearance</h2>
        <div className="flex items-center gap-2">
          {['light', 'dark', 'system'].map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`btn-outline capitalize ${theme === t ? 'ring-2 ring-brand-500' : ''}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {settings && (
        <div className="card p-5 space-y-3">
          <h2 className="font-semibold">Preferences</h2>
          <div>
            <label className="label">Language</label>
            <select
              className="input"
              value={settings.language}
              onChange={(e) => save({ language: e.target.value })}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.notifications?.email}
              onChange={(e) => save({ notifications: { ...settings.notifications, email: e.target.checked } })}
            /> Email notifications
          </label>
        </div>
      )}
    </div>
  );
}
