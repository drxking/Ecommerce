import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

const CollectionContext = createContext();

export const CollectionProvider = ({ children }) => {
  const [collection, setCollection] = useState([]);
  const [isFetched, setIsFetched] = useState(false);

  async function fetcher() {
    let collection = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/collections/three-collection`
    );
    setCollection(collection.data);
    setIsFetched(true);
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
