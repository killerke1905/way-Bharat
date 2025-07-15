import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Map as MapLibreMap } from 'maplibre-gl';

interface MapContextType {
  map: MapLibreMap | null;
  setMap: (map: MapLibreMap | null) => void;
  selectedPOI: any | null;
  setSelectedPOI: (poi: any | null) => void;
  isRoutingMode: boolean;
  setIsRoutingMode: (mode: boolean) => void;
  currentRoute: any | null;
  setCurrentRoute: (route: any | null) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};

interface MapProviderProps {
  children: ReactNode;
}

export const MapProvider: React.FC<MapProviderProps> = ({ children }) => {
  const [map, setMap] = useState<MapLibreMap | null>(null);
  const [selectedPOI, setSelectedPOI] = useState<any | null>(null);
  const [isRoutingMode, setIsRoutingMode] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<any | null>(null);

  return (
    <MapContext.Provider value={{
      map,
      setMap,
      selectedPOI,
      setSelectedPOI,
      isRoutingMode,
      setIsRoutingMode,
      currentRoute,
      setCurrentRoute
    }}>
      {children}
    </MapContext.Provider>
  );
};