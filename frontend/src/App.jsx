import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";
import AdminRouter from "./routes/AdminRouter";
import { ProductsProvider } from "./components/ProductsProvider";
import { CollectionProvider } from "./components/CollectionProvider";
import Collection from "./pages/Collection";
import Cart from "./pages/Cart";

function App() {
  return (
    <ProductsProvider>
      <CollectionProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/collections/:id" element={<Collection />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin/*" element={<AdminRouter />} />
          </Routes>
        </Router>
      </CollectionProvider>
    </ProductsProvider>
  );
}

export default App;
