import React from 'react';
import clsx from 'clsx';

interface WeatherCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  className?: string;
  secondary?: string;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  title,
  value,
  unit = '',
  icon,
  className = '',
  secondary,
}) => {
  return (
    <div className={clsx('card-primary', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-light-muted text-sm">{title}</p>
          <p className="text-3xl font-bold text-light mt-2">
            {value}
            <span className="text-xl ml-1">{unit}</span>
          </p>
          {secondary && <p className="text-light-muted text-xs mt-1">{secondary}</p>}
        </div>
        {icon && <div className="text-accent text-3xl">{icon}</div>}
      </div>
    </div>
  );
};