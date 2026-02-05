import { SecurityIncident, Partner } from './types';

export const THEME_COLORS = {
  primaryBg: '#111111',
  secondaryBg: '#191919',
  panelDark: '#1a1a19',
  borderDark: '#101010',
  cardBg: '#191918',
  textPrimary: '#ffffff', 
  hoverBg: '#181818',
  textSecondary: '#a1a1aa',
  mutedText: '#121211',
  accentDark: '#181819',
  accent: '#e5ff5d'
};

export const LIGHT_THEME_COLORS = {
  primaryBg: '#ffffff',
  secondaryBg: '#f3f4f6',
  panelDark: '#e5e7eb',
  borderDark: '#e5e7eb',
  cardBg: '#ffffff',
  textPrimary: '#111827',
  hoverBg: '#f9fafb',
  textSecondary: '#4b5563',
  mutedText: '#f9fafb',
  accentDark: '#f3f4f6',
  accent: '#4d7c0f'
};

export const MOCK_INCIDENTS: SecurityIncident[] = [
  {
    id: '1',
    timestamp: '2025-06-23 16:10:10',
    title: 'TokenVault Security Incident',
    severity: 'High',
    tags: ['Attack', 'Logic'],
    likes: 583,
    user_avatar: 'https://picsum.photos/seed/u1/40/40',
    status: 'Issues Detected',
    isFullDisclosure: true
  },
  {
    id: '2',
    timestamp: '2025-06-22 12:09:56',
    title: 'Kinetiq Vulnerability',
    severity: 'High',
    tags: ['Medium', 'Code4rena'],
    likes: 494,
    user_avatar: 'https://picsum.photos/seed/u2/40/40',
    status: 'Issues Detected'
  },
  {
    id: '3',
    timestamp: '2025-06-22 11:48:21',
    title: 'Pufferverse Security Scan',
    severity: 'High',
    tags: ['Binance Alpha'],
    likes: 411,
    user_avatar: 'https://picsum.photos/seed/u3/40/40',
    status: 'Issues Detected'
  },
  {
    id: '4',
    timestamp: '2025-06-23 08:43:58',
    title: 'SWC-120 Old Blockhash Vulnerability',
    severity: 'High',
    tags: ['SWC'],
    likes: 341,
    user_avatar: 'https://picsum.photos/seed/u4/40/40',
    status: 'Issues Detected',
    isFullDisclosure: true
  },
  {
    id: '5',
    timestamp: '2025-06-22 19:19:58',
    title: 'BankrollNetwork Security Incident',
    severity: 'High',
    tags: ['Attack'],
    likes: 328,
    user_avatar: 'https://picsum.photos/seed/u5/40/40',
    status: 'Issues Detected'
  },
  {
    id: '6',
    timestamp: '2025-11-29 11:29:27',
    title: 'FHEVMConfig.sol smart contract',
    severity: 'Low',
    tags: [],
    likes: 320,
    user_avatar: 'https://picsum.photos/seed/u6/40/40',
    status: 'No Issues Detected'
  },
  {
    id: '7',
    timestamp: '2025-11-19 22:44:32',
    title: 'Spine Protocol Vulnerability',
    severity: 'High',
    tags: ['Medium', 'Code4rena'],
    likes: 310,
    user_avatar: 'https://picsum.photos/seed/u7/40/40',
    status: 'Issues Detected'
  },
  {
    id: '8',
    timestamp: '2025-11-27 12:46:26',
    title: 'FHEVMConfig Sepolia Config Solidity',
    severity: 'Low',
    tags: [],
    likes: 304,
    user_avatar: 'https://picsum.photos/seed/u8/40/40',
    status: 'No Issues Detected'
  }
];

export const PARTNERS: Partner[] = [
  { name: 'Ethereum', logo: 'Ξ' },
  { name: 'BNB Chain', logo: 'BNB' },
  { name: 'Base', logo: 'Base' },
  { name: 'Solana', logo: 'Solana' },
  { name: 'Optimism', logo: 'OP' },
  { name: 'Avalanche', logo: 'Avax' },
  { name: 'Mantle', logo: 'Mantle' },
  { name: 'ZkLayer', logo: 'Layer' },
  { name: 'Taiko', logo: 'Taiko' }
];