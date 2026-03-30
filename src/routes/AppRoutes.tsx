import React, { useState } from 'react';
import { CurrentWeather } from '../Pages/CurrentWeather';
import { Historical } from '../Pages/Historical';
import { Navbar } from '../components/layout/Navbar';
import { useLocation } from '../hooks/useLocation';
import { Loader } from '../components/ui/Loader';

type Page = 'current' | 'historical';

export const AppRoutes: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('current');
    const { location, loading: locationLoading } = useLocation();

    if (locationLoading || !location) {
        return <Loader />;
    }

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-primary">
            <Navbar
                location={location.name || 'Unknown Location'}
                onRefresh={handleRefresh}
            />

            <div className="bg-secondary border-b border-accent/20 sticky top-16 z-40">
                <div className="flex gap-8 px-6">
                    <button
                        onClick={() => setCurrentPage('current')}
                        className={`px-4 py-3 font-medium border-b-2 transition-colors ${currentPage === 'current'
                                ? 'border-accent text-accent'
                                : 'border-transparent text-light/60 hover:text-light'
                            }`}
                    >
                        Current Weather
                    </button>
                    <button
                        onClick={() => setCurrentPage('historical')}
                        className={`px-4 py-3 font-medium border-b-2 transition-colors ${currentPage === 'historical'
                                ? 'border-accent text-accent'
                                : 'border-transparent text-light/60 hover:text-light'
                            }`}
                    >
                        Historical Analytics
                    </button>
                </div>
            </div>
            
            <main className="bg-primary min-h-[calc(100vh-8rem)]">
                {currentPage === 'current' && (
                    <CurrentWeather
                        latitude={location.latitude}
                        longitude={location.longitude}
                    />
                )}
                {currentPage === 'historical' && (
                    <Historical
                        latitude={location.latitude}
                        longitude={location.longitude}
                    />
                )}
            </main>
        </div>
    );
};
