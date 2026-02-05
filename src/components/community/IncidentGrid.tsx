import Card from '../Card';
import { SecurityIncident } from '../../types';

interface IncidentGridProps {
  incidents: SecurityIncident[];
}

const IncidentGrid: React.FC<IncidentGridProps> = ({ incidents }) => {
  if (incidents.length === 0) {
    return <div className="text-center opacity-50 py-12 text-muted-foreground">No public scans found yet.</div>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {incidents.map(incident => (
        <Card key={incident.id} incident={incident} />
      ))}
    </div>
  );
};
export default IncidentGrid;