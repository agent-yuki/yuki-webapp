import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Coffee, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <footer
      className="py-12 px-8 border-t border-border mt-20 bg-background"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground font-light tracking-wide">
          <span>© 2026 YUKI. Built with <Coffee className="inline w-4 h-4" /> and <Heart className="inline w-4 h-4 text-red-500" /></span>
        </div>

        <div className="flex items-center space-x-8 text-sm text-muted-foreground font-light tracking-wide">
          <a href="/privacy" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="/terms" className="hover:text-foreground transition-colors">Terms</a>
          <a href="/contact" className="hover:text-foreground transition-colors">Contact</a>
          <a href="#" className="hover:text-foreground transition-colors">X / Twitter</a>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-1 p-1 rounded-full border border-border bg-secondary/50 transition-colors"
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${theme === 'light' ? 'bg-white shadow text-orange-500' : 'text-muted-foreground'}`}>
              <Sun className="w-3 h-3" />
            </div>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-all ${theme === 'dark' ? 'bg-cyan-400 text-black shadow' : 'text-muted-foreground'}`}>
              <Moon className="w-3 h-3" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;