import React, { useEffect } from 'react';
import { Star, MapPin } from 'lucide-react';
import { usePOI } from '../contexts/POIContext';
import { useMap } from '../contexts/MapContext';

const POIList: React.FC = () => {
  const { pois, filteredPOIs, setFilteredPOIs, selectedCategory, searchQuery } = usePOI();
  const { map, setSelectedPOI } = useMap();

  useEffect(() => {
    let filtered = pois;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(poi => poi.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(poi =>
        poi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        poi.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPOIs(filtered);
  }, [pois, selectedCategory, searchQuery, setFilteredPOIs]);

  const handlePOIClick = (poi: any) => {
    setSelectedPOI(poi);
    if (map) {
      map.flyTo({
        center: poi.coordinates,
        zoom: 16,
        duration: 2000
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Places ({filteredPOIs.length})
      </h3>
      
      {filteredPOIs.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No places found</p>
          <p className="text-sm">Try adjusting your filters or search query</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPOIs.map((poi) => (
            <div
              key={poi.id}
              onClick={() => handlePOIClick(poi)}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {poi.image && (
                <img
                  src={poi.image}
                  alt={poi.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
              )}
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                {poi.name}
              </h4>
              <div className="flex items-center mb-2">
                {renderStars(poi.rating)}
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  {poi.rating}/5
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {poi.description}
              </p>
              {poi.address && (
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {poi.address}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default POIList;