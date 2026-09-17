import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

const CollectionContext = createContext();

export const CollectionProvider = ({ children }) => {
  const [collection, setCollection] = useState([]);
  const [isFetched, setIsFetched] = useState(false);

  async function fetcher() {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/home-config`);
      const config = response.data?.data || response.data || {};
      // Navigation only exposes the collections explicitly selected for the
      // homepage featured-collections section.
      const data = Array.isArray(config.topThreeCollections)
        ? config.topThreeCollections.filter(Boolean)
        : [];
      setCollection({ data });
    } catch (error) {
      console.error("Failed to load navigation collections:", error);
      setCollection({ data: [] });
    } finally {
      setIsFetched(true);
    }
  }
  useEffect(() => {
    if (!isFetched) {
      fetcher();
    }
  }, [isFetched]);

  return (
    <CollectionContext.Provider value={collection}>
      {children}
    </CollectionContext.Provider>
  );
};

export const useCollection = () => useContext(CollectionContext);
