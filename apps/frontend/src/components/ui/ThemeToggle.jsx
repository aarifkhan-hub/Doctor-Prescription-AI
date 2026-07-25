import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const cycle = () => setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light');
  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;
  return (
    <button className="btn-ghost" onClick={cycle} aria-label="Toggle theme" title={`Theme: ${theme}`}>
      <Icon size={18} />
    </button>
  );
}
