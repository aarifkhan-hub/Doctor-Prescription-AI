import { Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Navbar({ onMenu }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = async () => {
    await logout();
    nav('/login');
  };

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onMenu} className="btn-ghost md:hidden" aria-label="Menu">
            <Menu size={20} />
          </button>
          <span className="font-semibold hidden md:block">Doctor Prescription AI</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
            <div className="w-7 h-7 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center font-bold">
              {(user?.fullName || '?').charAt(0).toUpperCase()}
            </div>
            <span className="text-sm">{user?.fullName}</span>
          </div>
          <button className="btn-ghost" onClick={handleLogout} aria-label="Logout" title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
