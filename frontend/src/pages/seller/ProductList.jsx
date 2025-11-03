import { useState, useEffect } from "react";
import api from "../../utils/api";
import "../../styles/seller.css";

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchProducts = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await api.get("/seller/dashboard/products");
            setProducts(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load products.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const deleteProduct = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/seller/dashboard/products/${productId}`);
            setProducts(prev => prev.filter(p => p.id !== productId));
        } catch (err) {
            console.error(err);
            alert("Failed to delete product.");
        }
    };

    if (loading) return <p>Loading products...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="product-cards-container">
            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                products.map(product => (
                    <div className="product-card" key={product.id}>
                        <img
                            src={`http://localhost:9090${product.imageUrls && product.imageUrls[0] ? product.imageUrls[0] : "/placeholder.png"}`}
                            alt={product.name}
                        />
                        <div className="product-info">
                            <h3>{product.name}</h3>
                            <p>💲 {product.price}</p>
                            <p>Stock: {product.stock}</p>
                            <p>Category: {product.category}</p>
                            <button onClick={() => deleteProduct(product.id)}>Delete</button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
