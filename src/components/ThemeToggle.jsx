import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-zinc-700 hover:scale-105 transition"
      title="Toggle Theme"
    >
      {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-800" />}
    </button>
  );
};

export default ThemeToggle;