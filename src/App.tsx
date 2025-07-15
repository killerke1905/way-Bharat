import React, { useState, useEffect } from 'react';
import MapContainer from './components/MapContainer';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { ThemeProvider } from './contexts/ThemeContext';
import { MapProvider } from './contexts/MapContext';
import { POIProvider } from './contexts/POIContext';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Register service worker for offline support
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Simulate initial loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-white mt-4">Loading Interactive Map...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <MapProvider>
        <POIProvider>
          <div className="h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
            <Header />
            <div className="flex h-full pt-16">
              <Sidebar />
              <MapContainer />
            </div>
          </div>
        </POIProvider>
      </MapProvider>
    </ThemeProvider>
  );
}

export default App;