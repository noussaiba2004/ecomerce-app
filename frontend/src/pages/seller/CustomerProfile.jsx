import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CustomerProfile() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");


    const fetchCustomers = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:9090/api/seller/customers", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCustomers(res.data);
        } catch (err) {
            console.error("Error loading clients :", err);
        } finally {
            setLoading(false);
        }
    };

    
    useEffect(() => {
        fetchCustomers();
    }, [token]);

    return (
        <div style={{ padding: "20px" }}>
            <h2>👥 My Customers</h2>

            {/*  En-tête avec compteur et bouton actualiser */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                }}
            >
                <p style={{ fontSize: "16px" }}>
                    {customers.length > 0
                        ? `You have ${customers.length} customer${
                            customers.length > 1 ? "s" : ""
                        }.`
                        : "No registered customers."}
                </p>
                <button
                    onClick={fetchCustomers}
                    style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    🔄 Refresh
                </button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : customers.length > 0 ? (
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        marginTop: "10px",
                    }}
                >
                    <thead>
                    <tr style={{ backgroundColor: "#f4f4f4" }}>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Nom</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Email</th>
                    </tr>
                    </thead>
                    <tbody>
                    {customers.map((c) => (
                        <tr key={c.id}>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                {c.username}
                            </td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                {c.email}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No customers found for this seller.</p>
            )}
        </div>
    );
}
