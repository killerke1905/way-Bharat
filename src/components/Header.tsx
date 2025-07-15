import React, { useState } from 'react';
import { Search, Menu, Moon, Sun, Navigation, MapPin } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useMap } from '../contexts/MapContext';
import SearchBar from './SearchBar';

const Header: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { map, setIsRoutingMode, isRoutingMode } = useMap();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (map) {
          map.flyTo({
            center: [longitude, latitude],
            zoom: 15,
            duration: 2000
          });
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location.');
      }
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-lg">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Interactive Map
            </h1>
          </div>
        </div>

        <div className="flex-1 max-w-2xl mx-4">
          <SearchBar />
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleGeolocation}
            className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            title="My Location"
          >
            <Navigation className="h-5 w-5" />
          </button>

          <button
            onClick={() => setIsRoutingMode(!isRoutingMode)}
            className={`p-2 rounded-lg transition-colors ${
              isRoutingMode 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'
            }`}
            title="Directions"
          >
            <Navigation className="h-5 w-5" />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors"
            title="Toggle Theme"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;