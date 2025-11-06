import { useState } from "react";
import api from "../../utils/api";
import "../../styles/seller.css";

import ProductList from "./ProductList";
import OrderList from "./OrderList";
import CustomerProfile from "./CustomerProfile";

function SellerDashboard() {
    const [activeTab, setActiveTab] = useState("dashboard");

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [stock, setStock] = useState(0);
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [images, setImages] = useState([]);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(""); 

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            let finalCategory = category;
            if (category === "Fashion" && subCategory) {
                finalCategory = `${category} - ${subCategory}`;
            }

            const formData = new FormData();
            formData.append("name", name);
            formData.append("price", price);
            formData.append("description", description);
            formData.append("stock", stock);
            formData.append("category", finalCategory);
            for (let i = 0; i < images.length; i++) {
                formData.append("images", images[i]);
            }

            const response = await api.post(
                "/seller/dashboard/products",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (response.status === 201 || response.status === 200) {
                setSuccess("✅ Product added successfully!");
                setName("");
                setPrice("");
                setDescription("");
                setStock(0);
                setCategory("");
                setSubCategory("");
                setImages([]);
                // auto-hide après 3s
                setTimeout(() => setSuccess(""), 3000);
            }
        } catch (err) {
            console.error("Error adding product:", err);
            setError("❌ Failed to add product. Please try again.");
            setTimeout(() => setError(""), 3000);
        }
    };

    return (
        <div className="seller-dashboard-layout">
            {/* ---------- Sidebar ---------- */}
            <aside className="sidebar">
                <h2>Seller Panel</h2>
                <ul>
                    <li onClick={() => setActiveTab("dashboard")}>
                        ➕ Add Product
                    </li>
                    <li onClick={() => setActiveTab("products")}>
                        📦 My Products
                    </li>
                    <li onClick={() => setActiveTab("orders")}>
                        🛒 Orders
                    </li>
                    <li onClick={() => setActiveTab("customers")}>
                        👤 Customers
                    </li>
                </ul>
            </aside>

            {/* ---------- Main Content ---------- */}
            <main className="dashboard-content">
                {activeTab === "dashboard" && (
                    <form onSubmit={handleAddProduct} className="product-form">
                        <h2>Add New Product</h2>
                        <input
                            type="text"
                            placeholder="Product name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Stock"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            required
                        />

                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="">-- Select Category --</option>
                            <option value="Beauty">Beauty</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Home & Living">Home & Living</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Sports">Sports</option>
                            <option value="Others">Others</option>
                        </select>

                        {category === "Fashion" && (
                            <select
                                value={subCategory}
                                onChange={(e) => setSubCategory(e.target.value)}
                                required
                            >
                                <option value="">-- Select Fashion Type --</option>
                                <option value="Men">Men</option>
                                <option value="Women">Women</option>
                                <option value="Kids">Kids</option>
                            </select>
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => setImages(Array.from(e.target.files))}
                        />

                        <button type="submit">Add Product</button>

                        {/*  messages stylés */}
                        {success && <div className="success">{success}</div>}
                        {error && <div className="error">{error}</div>}
                    </form>
                )}

                {activeTab === "products" && <ProductList />}
                {activeTab === "orders" && <OrderList />}
                {activeTab === "customers" && <CustomerProfile />}
            </main>
        </div>
    );
}

export default SellerDashboard;
