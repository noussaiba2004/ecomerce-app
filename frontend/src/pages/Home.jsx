import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import "../styles/home.css";

function Home() {
    const { addToCart, user } = useContext(AppContext);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        let url = "http://localhost:9090/api/home/products";

        const params = [];
        if (selectedCategory) {
            params.push(`category=${encodeURIComponent(selectedCategory)}`);
        }
        if (searchTerm) {
            params.push(`search=${encodeURIComponent(searchTerm)}`);
        }

        if (params.length > 0) {
            url += `?${params.join("&")}`;
        }

        axios
            .get(url)
            .then((res) => setProducts(res.data))
            .catch((err) =>
                console.error("Erreur lors du chargement des produits :", err)
            );
    }, [selectedCategory, searchTerm]);

    const handleSearch = () => {
        if (searchTerm.trim() !== "") {
            setSelectedCategory("");
        }
    };

    const handleCategoryClick = (category) => {
        if (selectedCategory === category) {
            setSelectedCategory("");
        } else {
            setSelectedCategory(category);
            setSearchTerm("");
        }
    };

    // 🔹 Fonction ajout au panier depuis le modal
    const handleAddToCart = () => {
        if (!user) {
            alert("⚠️ Vous devez être connecté pour ajouter un produit au panier.");
            // Optionnel : rediriger vers la page de login
            window.location.href = "/login";
            return;
        }

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
        setSelectedProduct(null);
        setQuantity(1);
        setSelectedImage(null);
    };

    return (
        <div className="home">
            {/* Section Hero */}
            <div className="hero">
                <div className="search-box">
                    <h1>Discover Amazing Products</h1>
                    <p>Shop electronics, fashion, home appliances, and more</p>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search for products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button onClick={handleSearch}>Search</button>
                    </div>
                </div>
            </div>

            {/* Barre de Catégories */}
            <div className="categories">
                <ul>
                    {["Electronics", "Fashion - Women", "Home & Living", "Sports", "Beauty"].map(
                        (cat) => (
                            <li
                                key={cat}
                                className={selectedCategory === cat ? "active" : ""}
                                onClick={() => handleCategoryClick(cat)}
                            >
                                {cat}
                            </li>
                        )
                    )}
                </ul>
            </div>

            {/* Section Produits */}
            <div className="products">
                <h2>
                    {selectedCategory
                        ? `Products in "${selectedCategory}"`
                        : searchTerm
                            ? `Search results for "${searchTerm}"`
                            : "Popular Products"}
                </h2>

                <div className="product-grid">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <div key={product.id} className="product-card">
                                <div className="product-image">
                                    <img
                                        src={
                                            product.imageUrls &&
                                            product.imageUrls.length > 0
                                                ? `http://localhost:9090${product.imageUrls[0]}`
                                                : "/placeholder.png"
                                        }
                                        alt={product.name}
                                    />
                                </div>
                                <div className="product-info">
                                    <h3>{product.name}</h3>
                                    <p className="category">{product.category}</p>
                                    <p className="price">{Number(product.price).toFixed(2)} $</p>
                                    <button
                                        className="btn-details"
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setQuantity(1);
                                            setSelectedImage(
                                                product.imageUrls?.[0] || null
                                            );
                                        }}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-results">No products found.</p>
                    )}
                </div>
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

                        {/* ---------- Galerie d’images ---------- */}
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

                        {/* ---------- Informations ---------- */}
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

                            <div className="quantity-box">
                                <label>Quantity:</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(Number(e.target.value))
                                    }
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

export default Home;
