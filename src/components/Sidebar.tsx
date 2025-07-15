import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Filter, Star, MapPin, Route } from 'lucide-react';
import { useMap } from '../contexts/MapContext';
import { usePOI } from '../contexts/POIContext';
import POIList from './POIList';
import RoutePanel from './RoutePanel';

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'explore' | 'directions'>('explore');
  const { isRoutingMode } = useMap();
  const { selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = usePOI();

  const categories = [
    { id: 'all', name: 'All Places', icon: MapPin },
    { id: 'restaurant', name: 'Restaurants', icon: MapPin },
    { id: 'hotel', name: 'Hotels', icon: MapPin },
    { id: 'hospital', name: 'Hospitals', icon: MapPin },
    { id: 'tourist', name: 'Tourist Spots', icon: MapPin },
  ];

  React.useEffect(() => {
    if (isRoutingMode) {
      setActiveTab('directions');
    }
  }, [isRoutingMode]);

  return (
    <>
      <aside className={`${isCollapsed ? 'w-12' : 'w-80'} transition-all duration-300 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {!isCollapsed && (
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('explore')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'explore'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <MapPin className="h-4 w-4 inline mr-1" />
                Explore
              </button>
              <button
                onClick={() => setActiveTab('directions')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'directions'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <Route className="h-4 w-4 inline mr-1" />
                Directions
              </button>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        {!isCollapsed && (
          <div className="flex-1 overflow-hidden">
            {activeTab === 'explore' ? (
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search POIs..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  />
                </div>

                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    <Filter className="h-4 w-4 inline mr-1" />
                    Categories
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
                        }`}
                      >
                        <category.icon className="h-4 w-4 mr-2" />
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <POIList />
                </div>
              </div>
            ) : (
              <RoutePanel />
            )}
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;