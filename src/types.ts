export interface SecurityIncident {
  id: string;
  timestamp: string;
  title: string;
  severity: 'High' | 'Medium' | 'Low';
  tags: string[];
  likes: number;
  user_avatar?: string;
  status: 'Issues Detected' | 'No Issues Detected' | 'Under Review' | 'Processing' | 'Queued' | 'Failed';
  user_id?: string;
  profiles?: {
    email?: string;
    avatar_url?: string;
    full_name?: string;
  };
  isFullDisclosure?: boolean;
  network?: string;
  contract_address?: string;
  score?: number;
  visibility?: 'PUBLIC' | 'PRIVATE';
  analysis_summary?: string;
  vulnerabilities?: any[];
  language?: string;
  source_code?: string;
  scanned_files?: any[];
}

export interface Partner {
  name: string;
  logo: string;
}