import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import "../styles/payment.css";

export default function PaymentPage() {
    const { user, cart, clearCart } = useContext(AppContext);
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const handlePayment = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:9090/api/orders/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: user.id,
                    items: cart.map(item => ({
                        productId: item.id,
                        quantity: item.quantity || 1
                    })),
                }),
            });

            if (response.ok) {
                clearCart();
                alert("✅ Payment successful! Your order has been placed.");
                navigate("/orders");
            } else {
                alert("❌ Payment failed. Please try again.");
            }
        } catch (error) {
            console.error("Payment error:", error);
            alert("⚠️ Something went wrong during payment.");
        }
    };

    return (
        <div className="payment-container">
            <h2>💳 Secure Payment</h2>
            <form className="payment-form" onSubmit={handlePayment}>
                <label>Cardholder Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <label>Card Number</label>
                <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    maxLength="16"
                    required
                />

                <div className="payment-row">
                    <div>
                        <label>Expiry</label>
                        <input
                            type="text"
                            placeholder="MM/YY"
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>CVV</label>
                        <input
                            type="text"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            maxLength="3"
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="btn-pay">Pay Now</button>
            </form>
        </div>
    );
}
