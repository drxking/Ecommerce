import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [isFetched, setIsFetched] = useState(false);

  async function fetcher() {
    let product = await axios.get(`${import.meta.env.VITE_BASE_URL}/products`);
    setProducts(product.data);
    setIsFetched(true);
  }
  useEffect(() => {
    if (!isFetched) {
      fetcher();
    }
  }, [isFetched]);

  return (
    <ProductsContext.Provider value={products}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);
