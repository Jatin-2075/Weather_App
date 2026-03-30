import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-primary">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
        <p className="text-light/80">Loading weather data...</p>
      </div>
    </div>
  );
};