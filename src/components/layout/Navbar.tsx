import React from 'react';
import { IoRefresh, IoSettings } from 'react-icons/io5';
import { MdLocationOn } from 'react-icons/md';

interface NavbarProps {
  location?: string;
  onRefresh: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ location = 'Loading...', onRefresh }) => {
  return (
    <nav className="bg-secondary border-b border-accent/20 px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-light">Weather Dashboard</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-light/80">
            <MdLocationOn className="text-accent" />
            <span>{location}</span>
          </div>
          <button
            onClick={onRefresh}
            className="p-2 hover:bg-accent/20 rounded-lg transition-colors"
          >
            <IoRefresh className="text-accent text-xl" />
          </button>
          <button className="p-2 hover:bg-accent/20 rounded-lg transition-colors">
            <IoSettings className="text-accent text-xl" />
          </button>
        </div>
      </div>
    </nav>
  );
};