import { useState, useEffect } from "react";
import { AppContext } from "./AppContext";
import axios from "axios";

const AppProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [cart, setCart] = useState([]);
    // Charger le panier pour l'utilisateur connecté
    useEffect(() => {
        if (user) {
            const saved = localStorage.getItem(`cart_${user.email}`);
            setCart(saved ? JSON.parse(saved) : []);
        } else {
            setCart([]);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            localStorage.setItem(`cart_${user.email}`, JSON.stringify(cart));
        }
    }, [cart, user]);

    // Charger l'utilisateur depuis le token (si existant)
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios
                .get("http://localhost:9090/api/auth/me", {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => setUser(res.data))
                .catch(() => {
                    // Token invalide → on le supprime
                    localStorage.removeItem("token");
                    setUser(null);
                });
        }
    }, []);

    // Ajouter un produit au panier (seulement si connecté)
    const addToCart = (product) => {
        if (!user) {
            alert("⚠️ Vous devez être connecté pour ajouter un produit au panier.");
            window.location.href = "/login";
            return;
        }

        setCart((prevCart) => {
            const existing = prevCart.find(
                (item) =>
                    item.id === product.id &&
                    item.selectedImage === product.selectedImage
            );

            if (existing) {
                return prevCart.map((item) =>
                    item.id === product.id &&
                    item.selectedImage === product.selectedImage
                        ? { ...item, quantity: item.quantity + (product.quantity || 1) }
                        : item
                );
            } else {
                return [...prevCart, { ...product, quantity: product.quantity || 1 }];
            }
        });
    };

    // Supprimer un produit précis
    const removeFromCart = (productId, selectedImage) => {
        setCart((prevCart) =>
            prevCart.filter(
                (item) =>
                    !(item.id === productId && item.selectedImage === selectedImage)
            )
        );
    };

    //  Déconnexion
    const logout = () => {
        setUser(null);
        setCart([]); // vide le panier
        localStorage.removeItem("token");
        window.location.href = "/";
    };


    //  Vider tout le panier
    const clearCart = () => setCart([]);

    return (
        <AppContext.Provider
            value={{
                user,
                setUser,
                cart,
                addToCart,
                removeFromCart,
                clearCart,
                logout,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;
