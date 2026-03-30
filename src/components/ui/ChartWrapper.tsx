import React from 'react';
import clsx from 'clsx';

interface ChartWrapperProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  showLegend?: boolean;
}

export const ChartWrapper: React.FC<ChartWrapperProps> = ({
  title,
  children,
  className = '',
  showLegend = false,
}) => {
  return (
    <div className={clsx('card-primary', className)}>
      <h3 className="text-lg font-semibold text-light mb-4">{title}</h3>
      <div className="overflow-x-auto scrollbar-hide">
        {children}
      </div>
      {showLegend && (
        <div className="flex gap-4 mt-4 text-xs text-light-muted flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-accent" />
            <span>Primary</span>
          </div>
        </div>
      )}
    </div>
  );
};