import { useState, useEffect } from "react";
import api from "../../utils/api";
import "../../styles/seller.css";

export default function OrderList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const fetchOrders = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await api.get("/seller/dashboard/orders");
            setOrders(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load orders.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

   
    const updateStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/seller/dashboard/orders/${orderId}/status`, null, {
                params: { status: newStatus },
            });
            // Met à jour localement le statut
            setOrders(prev =>
                prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
            );
        } catch (err) {
            console.error(err);
            alert("Failed to update status.");
        }
    };

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="order-list">
            <h2>🛒 Orders</h2>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Products</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.customerEmail}</td>
                            <td>
                                <ul>
                                    {order.products.map((p, i) => (
                                        <li key={i}>{p}</li>
                                    ))}
                                </ul>
                            </td>
                            <td>{order.status}</td>
                            <td>{new Date(order.createdAt).toLocaleString()}</td>
                            <td>
                                {order.status === "ON_HOLD" && (
                                    <button onClick={() => updateStatus(order.id, "PAID")}>
                                        Mark as PAID
                                    </button>
                                )}
                                {order.status === "PAID" && (
                                    <button onClick={() => updateStatus(order.id, "SHIPPED")}>
                                        Mark as SHIPPED
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
