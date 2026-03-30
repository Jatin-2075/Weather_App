import React from 'react';

interface ToggleUnitProps {
  isFahrenheit: boolean;
  onChange: (isFahrenheit: boolean) => void;
}

export const ToggleUnit: React.FC<ToggleUnitProps> = ({ isFahrenheit, onChange }) => {
  return (
    <div className="bg-secondary rounded-lg p-1 border border-accent/20 flex gap-1">
      <button
        onClick={() => onChange(false)}
        className={`px-4 py-2 rounded transition-colors font-medium ${
          !isFahrenheit
            ? 'bg-accent text-white'
            : 'text-light/60 hover:text-light'
        }`}
      >
        °C
      </button>
      <button
        onClick={() => onChange(true)}
        className={`px-4 py-2 rounded transition-colors font-medium ${
          isFahrenheit
            ? 'bg-accent text-white'
            : 'text-light/60 hover:text-light'
        }`}
      >
        °F
      </button>
    </div>
  );
};