'use client';

import { useTheme } from '../../contexts/ThemeContext';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

export default function LoadingSpinner({ fullScreen = true }: LoadingSpinnerProps) {
  const { colors } = useTheme();

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.primaryBg }}>
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2"
          style={{ borderColor: colors.accent }}
        ></div>
      </div>
    );
  }

  return (
    <div
      className="animate-spin rounded-full h-8 w-8 border-b-2"
      style={{ borderColor: colors.accent }}
    ></div>
  );
}
