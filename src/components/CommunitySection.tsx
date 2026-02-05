import { useState, useEffect } from 'react';
import CommunityFilters from './community/CommunityFilters';
import IncidentGrid from './community/IncidentGrid';
import { incidentService } from '../services/incidentService';
import { SecurityIncident } from '../types';
import Link from 'next/link';

const CommunitySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Popular');
  const [incidents, setIncidents] = useState<SecurityIncident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublic = async () => {
      try {
        const result = await incidentService.getPublicIncidents(0, 12);
        if (result?.data) {
          setIncidents(result.data);
        }
      } catch (e) {
        console.error("Error fetching community incidents:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchPublic();
  }, []);

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-3xl font-bold mb-12 tracking-tight text-foreground">From the Community</h2>

        {/* <CommunityFilters activeTab={activeTab} setActiveTab={setActiveTab} /> */}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin border-accent"></div>
          </div>
        ) : (
          <IncidentGrid incidents={incidents} />
        )}

        <div className="mt-16 text-center">
          <Link
            href="/reports/public"
            className="inline-block px-8 py-3 rounded-xl border border-border font-bold text-sm transition-all hover:bg-muted bg-secondary/30 text-foreground"
          >
            More Public Scans
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;