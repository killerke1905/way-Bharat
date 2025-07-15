import React, { useEffect, useRef, useState } from 'react';
import { Map, NavigationControl, ScaleControl, FullscreenControl, GeolocateControl } from 'maplibre-gl';
import { Layers, Maximize2, Compass } from 'lucide-react';
import { useMap } from '../contexts/MapContext';
import { usePOI } from '../contexts/POIContext';
import { useTheme } from '../contexts/ThemeContext';

const MapContainer: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapStyle, setMapStyle] = useState('streets');
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const { map, setMap } = useMap();
  const { setPOIs } = usePOI();
  const { isDark } = useTheme();

  // Replace with your MapTiler API key
  const MAPTILER_API_KEY = 'YOUR_MAPTILER_API_KEY';

  const mapStyles = {
    streets: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_API_KEY}`,
    satellite: `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_API_KEY}`,
    terrain: `https://api.maptiler.com/maps/terrain-v2/style.json?key=${MAPTILER_API_KEY}`,
    dark: `https://api.maptiler.com/maps/dark-v2/style.json?key=${MAPTILER_API_KEY}`,
    light: `https://api.maptiler.com/maps/light-v2/style.json?key=${MAPTILER_API_KEY}`
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    const mapInstance = new Map({
      container: mapContainer.current,
      style: mapStyles[isDark ? 'dark' : 'streets'],
      center: [-74.006, 40.7128], // New York City
      zoom: 12,
      pitch: 0,
      bearing: 0
    });

    // Add controls
    mapInstance.addControl(new NavigationControl(), 'top-right');
    mapInstance.addControl(new ScaleControl(), 'bottom-left');
    mapInstance.addControl(new FullscreenControl(), 'top-right');
    mapInstance.addControl(new GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }), 'top-right');

    mapInstance.on('load', () => {
      // Add sample POIs
      const samplePOIs = [
        {
          id: '1',
          name: 'Central Park',
          category: 'tourist',
          coordinates: [-73.9654, 40.7829] as [number, number],
          rating: 4.8,
          description: 'Beautiful urban park in Manhattan',
          image: 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=400',
          address: 'Central Park, New York, NY'
        },
        {
          id: '2',
          name: 'Brooklyn Bridge',
          category: 'tourist',
          coordinates: [-73.9969, 40.7061] as [number, number],
          rating: 4.7,
          description: 'Historic suspension bridge',
          image: 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=400',
          address: 'Brooklyn Bridge, New York, NY'
        },
        {
          id: '3',
          name: 'Times Square Diner',
          category: 'restaurant',
          coordinates: [-73.9857, 40.7589] as [number, number],
          rating: 4.2,
          description: 'Classic American diner',
          image: 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=400',
          address: 'Times Square, New York, NY'
        }
      ];

      setPOIs(samplePOIs);

      // Add POI markers
      samplePOIs.forEach(poi => {
        const marker = document.createElement('div');
        marker.className = 'poi-marker';
        marker.style.cssText = `
          width: 30px;
          height: 30px;
          background: #3B82F6;
          border: 2px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          transition: all 0.2s;
        `;

        marker.addEventListener('mouseenter', () => {
          marker.style.transform = 'scale(1.2)';
        });

        marker.addEventListener('mouseleave', () => {
          marker.style.transform = 'scale(1)';
        });

        const popup = document.createElement('div');
        popup.className = 'poi-popup';
        popup.style.cssText = `
          background: white;
          padding: 12px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          max-width: 250px;
          display: none;
          position: absolute;
          z-index: 1000;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
        `;
        
        popup.innerHTML = `
          <h3 style="margin: 0 0 8px 0; font-weight: bold;">${poi.name}</h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">${poi.description}</p>
          <div style="display: flex; align-items: center;">
            <span style="color: #F59E0B;">★</span>
            <span style="margin-left: 4px; font-size: 14px;">${poi.rating}/5</span>
          </div>
        `;

        marker.appendChild(popup);

        marker.addEventListener('click', () => {
          popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
        });

        new (window as any).maplibregl.Marker(marker)
          .setLngLat(poi.coordinates)
          .addTo(mapInstance);
      });
    });

    // Handle map click for reverse geocoding
    mapInstance.on('click', async (e) => {
      const { lng, lat } = e.lngLat;
      
      try {
        const response = await fetch(
          `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${MAPTILER_API_KEY}`
        );
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          const place = data.features[0];
          console.log('Clicked location:', place.place_name);
          
          // You can show this in a popup or sidebar
          const popup = document.createElement('div');
          popup.style.cssText = `
            background: white;
            padding: 8px 12px;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            font-size: 14px;
            max-width: 200px;
          `;
          popup.textContent = place.place_name;
          
          new (window as any).maplibregl.Popup()
            .setLngLat([lng, lat])
            .setDOMContent(popup)
            .addTo(mapInstance);
        }
      } catch (error) {
        console.error('Reverse geocoding error:', error);
      }
    });

    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, []);

  // Update map style when theme changes
  useEffect(() => {
    if (map) {
      const newStyle = isDark ? mapStyles.dark : mapStyles.streets;
      map.setStyle(newStyle);
    }
  }, [isDark, map]);

  const handleStyleChange = (style: string) => {
    if (map) {
      map.setStyle(mapStyles[style as keyof typeof mapStyles]);
      setMapStyle(style);
      setShowLayerPanel(false);
    }
  };

  return (
    <div className="flex-1 relative">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Layer Control */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={() => setShowLayerPanel(!showLayerPanel)}
          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          title="Map Layers"
        >
          <Layers className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </button>

        {showLayerPanel && (
          <div className="absolute top-12 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 min-w-[200px]">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Map Styles</h3>
            <div className="space-y-2">
              {Object.entries(mapStyles).map(([key, _]) => (
                <button
                  key={key}
                  onClick={() => handleStyleChange(key)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    mapStyle === key
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Compass */}
      <div className="absolute bottom-4 right-4 z-10">
        <button
          onClick={() => map?.resetNorth()}
          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          title="Reset North"
        >
          <Compass className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
};

export default MapContainer;