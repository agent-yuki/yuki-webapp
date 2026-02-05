-- Seed security_incidents
INSERT INTO security_incidents (id, timestamp, title, severity, tags, likes, user_avatar, status) VALUES
('1', '2025-06-23 16:10:10', 'TokenVault Security Incident', 'High', ARRAY['Attack', 'Logic'], 583, 'https://picsum.photos/seed/u1/40/40', 'Issues Detected'),
('2', '2025-06-22 12:09:56', 'Kinetiq Vulnerability', 'High', ARRAY['Medium', 'Code4rena'], 494, 'https://picsum.photos/seed/u2/40/40', 'Issues Detected'),
('3', '2025-06-22 11:48:21', 'Pufferverse Security Scan', 'High', ARRAY['Binance Alpha'], 411, 'https://picsum.photos/seed/u3/40/40', 'Issues Detected'),
('4', '2025-06-23 08:43:58', 'SWC-120 Old Blockhash Vulnerability', 'High', ARRAY['SWC'], 341, 'https://picsum.photos/seed/u4/40/40', 'Issues Detected'),
('5', '2025-06-22 19:19:58', 'BankrollNetwork Security Incident', 'High', ARRAY['Attack'], 328, 'https://picsum.photos/seed/u5/40/40', 'Issues Detected'),
('6', '2025-11-29 11:29:27', 'FHEVMConfig.sol smart contract', 'Low', ARRAY[]::text[], 320, 'https://picsum.photos/seed/u6/40/40', 'No Issues Detected'),
('7', '2025-11-19 22:44:32', 'Spine Protocol Vulnerability', 'High', ARRAY['Medium', 'Code4rena'], 310, 'https://picsum.photos/seed/u7/40/40', 'Issues Detected'),
('8', '2025-11-27 12:46:26', 'FHEVMConfig Sepolia Config Solidity', 'Low', ARRAY[]::text[], 304, 'https://picsum.photos/seed/u8/40/40', 'No Issues Detected')
ON CONFLICT (id) DO NOTHING;

-- Seed partners
INSERT INTO partners (name, logo) VALUES
('Ethereum', 'Ξ'),
('BNB Chain', 'BNB'),
('Base', 'Base'),
('Solana', 'Solana'),
('Optimism', 'OP'),
('Avalanche', 'Avax'),
('Mantle', 'Mantle'),
('ZkLayer', 'Layer'),
('Taiko', 'Taiko');
