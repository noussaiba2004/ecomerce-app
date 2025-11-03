import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import "../styles/products.css";

function Products() {
    const { addToCart } = useContext(AppContext);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        fetch("http://localhost:9090/api/products")
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error("Error loading products:", err));
    }, []);

    // Fonction d’ajout au panier avec quantité et image choisie
    const handleAddToCart = () => {
        if (!selectedProduct) return;

        const productToAdd = {
            ...selectedProduct,
            quantity,
            selectedImage:
                selectedImage ||
                (selectedProduct.imageUrls?.length > 0
                    ? selectedProduct.imageUrls[0]
                    : null),
        };

        addToCart(productToAdd);
        setSelectedProduct(null); // 👈 ferme le modal
        setQuantity(1);
        setSelectedImage(null);
    };

    return (
        <div className="products-container">
            <h2>List of products</h2>
            <div className="products-grid">
                {products.map((p) => (
                    <div
                        key={p.id}
                        className="product-card"
                        onClick={() => {
                            setSelectedProduct(p);
                            setQuantity(1);
                            setSelectedImage(p.imageUrls?.[0] || null);
                        }}
                    >
                        <img
                            src={
                                p.imageUrls && p.imageUrls.length > 0
                                    ? `http://localhost:9090${p.imageUrls[0]}`
                                    : "/placeholder.png"
                            }
                            alt={p.name}
                            className="product-image"
                        />
                        <h3>{p.name}</h3>
                        <p className="price">{Number(p.price).toFixed(2)} $</p>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                addToCart({ ...p, quantity: 1 });
                            }}
                            className="add-btn"
                        >
                            Add to cart 🛒
                        </button>
                    </div>
                ))}
            </div>

            {/* ---------- Modal ---------- */}
            {selectedProduct && (
                <div
                    className="product-modal-overlay"
                    onClick={() => setSelectedProduct(null)}
                >
                    <div
                        className="product-modal fade-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span
                            className="close-btn"
                            onClick={() => setSelectedProduct(null)}
                        >
                            ✖
                        </span>

                        {/* ---------- Images ---------- */}
                        <div className="product-gallery">
                            <img
                                src={`http://localhost:9090${
                                    selectedImage ||
                                    selectedProduct.imageUrls?.[0] ||
                                    "/placeholder.png"
                                }`}
                                alt={selectedProduct.name}
                                className="main-image"
                            />

                            {/* Thumbnails */}
                            <div className="thumbs">
                                {selectedProduct.imageUrls?.map((url, idx) => (
                                    <img
                                        key={idx}
                                        src={`http://localhost:9090${url}`}
                                        alt={`thumb-${idx}`}
                                        className={`thumb ${
                                            selectedImage === url ? "active" : ""
                                        }`}
                                        onClick={() => setSelectedImage(url)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* ---------- Infos ---------- */}
                        <div className="product-info">
                            <h1 className="title">{selectedProduct.name}</h1>
                            <p className="description">
                                {selectedProduct.description}
                            </p>

                            <div className="price-only">
                                <span className="price">
                                    {Number(selectedProduct.price).toFixed(2)} $
                                </span>
                            </div>

                            <p className="category">
                                Category: {selectedProduct.category || "Not specified"}
                            </p>

                            {/* Sélecteur de quantité */}
                            <div className="quantity-box">
                                <label>Quantity:</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                />
                            </div>

                            <button className="buy-btn" onClick={handleAddToCart}>
                                🛒 Add to cart
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Products;
