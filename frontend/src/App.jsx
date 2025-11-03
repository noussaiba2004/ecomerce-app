import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Navbar from "./components/Navbar.jsx";
import Products from "./pages/Products.jsx";
import SellerRegister from "./pages/SellerRegister.jsx";
import SellerDashboard from "./pages/seller/SellerDashboard.jsx";
import CartPage from "./pages/CartPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/register/seller" element={<SellerRegister />} />
                <Route path="/seller/dashboard" element={<SellerDashboard />}/>
                <Route path="/payment" element={<PaymentPage />} />
            </Routes>
        </Router>
    );
}

export default App;
