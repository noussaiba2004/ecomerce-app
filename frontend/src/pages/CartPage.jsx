import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import "../styles/cart.css";
import { useNavigate } from "react-router-dom";

function CartPage() {
    const { user, cart, removeFromCart } = useContext(AppContext);
    const navigate = useNavigate();

    // Calcul du total
    const total = cart.reduce(
        (sum, item) => sum + item.price * (item.quantity || 1),
        0
    );

    // Si l’utilisateur n’est pas connecté
    if (!user) {
        return (
            <div className="cart-container">
                <h2 className="cart-title">🛒 Your Shopping Cart</h2>
                <p className="empty-msg">
                    You must be logged in to view your cart.
                </p>
            </div>
        );
    }

    // Si le panier est vide
    if (cart.length === 0) {
        return (
            <div className="cart-container">
                <h2 className="cart-title">🛒 Your Shopping Cart</h2>
                <p className="empty-msg">Your cart is empty.</p>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h2 className="cart-title">🛒 Your Shopping Cart</h2>

            <div className="cart-content">
                <table className="cart-table">
                    <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {cart.map((item, index) => (
                        <tr key={`${item.id}-${index}`}>
                            <td className="cart-product">
                                <img
                                    src={
                                        item.selectedImage
                                            ? `http://localhost:9090${item.selectedImage}`
                                            : item.imageUrls?.[0]
                                                ? `http://localhost:9090${item.imageUrls[0]}`
                                                : "/placeholder.png"
                                    }
                                    alt={item.name}
                                />
                                <span>{item.name}</span>
                            </td>
                            <td>{Number(item.price).toFixed(2)} MAD</td>
                            <td>{item.quantity || 1}</td>
                            <td>
                                {(item.price * (item.quantity || 1)).toFixed(2)} MAD
                            </td>
                            <td>
                                <button
                                    className="remove-btn"
                                    onClick={() =>
                                        removeFromCart(item.id, item.selectedImage)
                                    }
                                >
                                    ❌ Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <div className="cart-summary">
                    <h3>
                        Total: <span>{total.toFixed(2)} MAD</span>
                    </h3>
                    <button className="checkout-btn" onClick={() => navigate("/payment")}>
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CartPage;
