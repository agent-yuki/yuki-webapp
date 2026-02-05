import { useTheme } from '../../contexts/ThemeContext';

interface CommunityFiltersProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const CommunityFilters: React.FC<CommunityFiltersProps> = ({ activeTab, setActiveTab }) => {
    const { colors, theme } = useTheme();
    const filters = ['Explore', 'Binance Alpha', 'OWASP', 'Code4rena', 'Logic', 'Attack'];
    
    return (
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
          <div 
            className="flex p-1 rounded-xl border"
            style={{ backgroundColor: colors.primaryBg, borderColor: colors.borderDark }}
          >
            {['Popular', 'Recent'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-2 rounded-lg text-sm font-semibold transition-all tracking-wide ${
                  activeTab === tab ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
                style={{
                   backgroundColor: activeTab === tab ? (theme === 'light' ? '#fff' : '#fff') : 'transparent',
                   color: activeTab === tab ? '#000' : colors.textSecondary
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 justify-center">
            {filters.map((filter, idx) => (
              <button
                key={filter}
                className={`px-4 py-1.5 rounded-lg border text-sm font-medium transition-all tracking-wide ${
                  idx === 0 
                    ? `border-transparent` 
                    : `hover:border-gray-500`
                }`}
                style={{ 
                   backgroundColor: idx === 0 ? colors.accent : 'transparent',
                   color: idx === 0 ? (theme === 'light' ? '#fff' : '#000') : colors.textSecondary,
                   borderColor: idx === 0 ? 'transparent' : colors.borderDark,
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
    );
};

export default CommunityFilters;