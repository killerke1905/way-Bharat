import React, { useState } from 'react';
import { Navigation, Clock, MapPin, X, Route } from 'lucide-react';
import { useMap } from '../contexts/MapContext';

const RoutePanel: React.FC = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [routeType, setRouteType] = useState<'driving' | 'walking' | 'cycling'>('driving');
  const [isCalculating, setIsCalculating] = useState(false);
  const { map, currentRoute, setCurrentRoute } = useMap();

  const calculateRoute = async () => {
    if (!origin || !destination) return;

    setIsCalculating(true);
    try {
      // This is a simplified example - you would use Valhalla API here
      // For demonstration, we'll create a mock route
      const mockRoute = {
        distance: '5.4 km',
        duration: '12 mins',
        steps: [
          { instruction: 'Head north on Main St', distance: '0.5 km' },
          { instruction: 'Turn right onto Oak Ave', distance: '1.2 km' },
          { instruction: 'Continue straight', distance: '2.1 km' },
          { instruction: 'Turn left onto Elm St', distance: '1.0 km' },
          { instruction: 'Arrive at destination', distance: '0.6 km' }
        ]
      };
      
      setCurrentRoute(mockRoute);
    } catch (error) {
      console.error('Route calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const clearRoute = () => {
    setCurrentRoute(null);
    setOrigin('');
    setDestination('');
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          <Route className="h-5 w-5 inline mr-2" />
          Directions
        </h3>
        {currentRoute && (
          <button
            onClick={clearRoute}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            From
          </label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="Enter starting point"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            To
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter destination"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Travel Mode
          </label>
          <select
            value={routeType}
            onChange={(e) => setRouteType(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="driving">Driving</option>
            <option value="walking">Walking</option>
            <option value="cycling">Cycling</option>
          </select>
        </div>

        <button
          onClick={calculateRoute}
          disabled={!origin || !destination || isCalculating}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isCalculating ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Calculating...
            </div>
          ) : (
            'Get Directions'
          )}
        </button>
      </div>

      {currentRoute && (
        <div className="flex-1 overflow-y-auto">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Navigation className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-semibold text-green-800 dark:text-green-300">
                  {currentRoute.distance}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-semibold text-green-800 dark:text-green-300">
                  {currentRoute.duration}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Turn-by-turn directions
            </h4>
            {currentRoute.steps.map((step: any, index: number) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {step.instruction}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {step.distance}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutePanel;