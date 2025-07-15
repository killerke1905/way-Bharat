import React, { createContext, useContext, useState, ReactNode } from 'react';

interface POI {
  id: string;
  name: string;
  category: string;
  coordinates: [number, number];
  rating: number;
  description: string;
  image?: string;
  address?: string;
}

interface POIContextType {
  pois: POI[];
  setPOIs: (pois: POI[]) => void;
  filteredPOIs: POI[];
  setFilteredPOIs: (pois: POI[]) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const POIContext = createContext<POIContextType | undefined>(undefined);

export const usePOI = () => {
  const context = useContext(POIContext);
  if (!context) {
    throw new Error('usePOI must be used within a POIProvider');
  }
  return context;
};

interface POIProviderProps {
  children: ReactNode;
}

export const POIProvider: React.FC<POIProviderProps> = ({ children }) => {
  const [pois, setPOIs] = useState<POI[]>([]);
  const [filteredPOIs, setFilteredPOIs] = useState<POI[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <POIContext.Provider value={{
      pois,
      setPOIs,
      filteredPOIs,
      setFilteredPOIs,
      selectedCategory,
      setSelectedCategory,
      searchQuery,
      setSearchQuery
    }}>
      {children}
    </POIContext.Provider>
  );
};