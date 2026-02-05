import { SecurityIncident } from '../types';
import { Shield, Check, Heart } from 'lucide-react';

const UserAvatar = ({ url, fallback }: { url?: string, fallback: string }) => {
  if (url) {
    return <img src={url} className="w-6 h-6 rounded-full border border-border object-cover" alt="Avatar" />;
  }

  return (
    <div
      className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-[10px] font-bold bg-accent text-accent-foreground"
    >
      {fallback[0].toUpperCase()}
    </div>
  );
};

interface CardProps {
  incident: SecurityIncident;
}

const Card: React.FC<CardProps> = ({ incident }) => {
  const isHighSeverity = incident.severity === 'High';
  const isIssuesDetected = incident.status === 'Issues Detected';

  return (
    <div
      className="group rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden flex flex-col h-full hover:shadow-lg hover:border-accent/30"
    >
      {/* Background Glow */}
      <div
        className={`absolute -top-24 -right-24 w-48 h-48 blur-[80px] rounded-full transition-opacity opacity-20 group-hover:opacity-40 pointer-events-none ${isIssuesDetected ? 'bg-red-500' : 'bg-accent'}`}
      />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center space-x-2 text-xs text-muted-foreground font-medium">
          <span>{new Date(incident.timestamp).toLocaleDateString()}</span>
          {incident.isFullDisclosure && (
            <span className="text-muted-foreground/70" title="Full Disclosure">
              <Shield className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
        <UserAvatar
          url={incident.profiles?.avatar_url || incident.user_avatar}
          fallback={incident.profiles?.full_name || incident.profiles?.email || 'User'}
        />
      </div>

      <h3 className="text-base font-bold mb-6 leading-tight flex-grow text-card-foreground relative z-10">
        {incident.title}
      </h3>

      <div className="flex items-center justify-between mt-auto relative z-10">
        <div className="flex items-center gap-2">
          {incident.severity === 'High' && (
            <span className="px-2.5 py-1 rounded text-xs font-bold border transition-all duration-500 group-hover:animate-pulse group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(239,68,68,0.4)] bg-destructive/10 text-destructive border-destructive/20">
              High
            </span>
          )}
          {(incident.tags || []).map(tag => (
            <span key={tag} className="px-2.5 py-1 rounded text-xs font-bold border bg-secondary/50 text-secondary-foreground border-border">
              {tag}
            </span>
          ))}
          {!isIssuesDetected && (
            <span className="px-2.5 py-1 rounded text-xs font-bold border bg-green-500/10 text-green-500 border-green-500/20">
              No Issues Detected
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1.5 text-muted-foreground hover:text-red-500 transition-colors cursor-pointer">
          <span className="text-sm"><Heart className="w-3.5 h-3.5" /></span>
          <span className="text-xs font-bold">{incident.likes}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;