import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import "../styles/navbar.css";

function Navbar() {
    const { user, cart, logout } = useContext(AppContext);
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="navbar-container">
            <nav className="navbar">
                {/* Logo */}
                <div className="navbar-logo">
                    <Link to="/">🛒 E-Shop</Link>
                </div>

                {/* Liens */}
                <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/products">Products</Link></li>
                </ul>

                <div className="navbar-actions">
                    {/* Icône Panier */}
                    <Link to="/cart" className="icon-link">
                        <FaShoppingCart size={22} />
                        {cart.length > 0 && (
                            <span className="cart-badge">{cart.length}</span>
                        )}
                    </Link>

                    {/* Icône Compte avec dropdown */}
                    <div className="dropdown">
                        <div className="icon-link">
                            <FaUserCircle size={22} />
                        </div>
                        <div className="dropdown-menu">
                            {user ? (
                                <>
                                    <p className="dropdown-header">👋 {user.email}</p>
                                    <Link to="/orders">My Orders</Link>
                                    <Link to="/profile">My Account</Link>
                                    <Link to="/favorites">My Favorites</Link>
                                    <Link to="/logout">Logout</Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="dropdown-btn">Login</Link>
                                    <Link to="/register" className="dropdown-btn outline">Register</Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Bouton seller */}
                    <Link to="/register/seller" className="btn-seller">
                        Become a Seller
                    </Link>
                </div>

                {/* Actions à droite */}
                <div className="navbar-actions">
                    {user ? (
                        <>
                            <span className="welcome">👋 Bonjour {user.username}</span>
                            <button className="logout-btn" onClick={logout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-btn">Login</Link>
                            <Link to="/register" className="nav-btn">Register</Link>
                        </>
                    )}
                    {/* Burger menu (mobile) */}
                    <div
                        className="menu-toggle"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        ☰
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
