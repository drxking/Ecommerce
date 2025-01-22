import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import AdminRouter from "./routes/AdminRouter";
import AdminCollectionDetails from "./pages/AdminCollectionDetails";
import { ProductsProvider } from "./components/ProductsProvider";

function App() {
  return (
    <ProductsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/admin/*" element={<AdminRouter />} />
          <Route
            path="/admin/collections/:id"
            element={<AdminCollectionDetails />}
          />
        </Routes>
      </Router>
    </ProductsProvider>
  );
}

export default App;
