// src/pages/Login.jsx
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import "../styles/login.css";
import { setAuthToken } from "../utils/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setUser } = useContext(AppContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:9090/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                setError("Invalid email or password");
                return;
            }

            const data = await response.json();

            // Save JWT token
            localStorage.setItem("token", data.token);
            setAuthToken(data.token);
            // Save user in context
            setUser({
                id: data.id,         
                email: data.email,
                role: data.role,     
            });

            // Redirect according to role
            if (data.role === "ADMIN") {
                navigate("/admin/dashboard");
            } else if (data.role === "SELLER") {
                navigate("/seller/dashboard");
            } else if (data.role === "CUSTOMER") {
                navigate("/products");
            } else {
                navigate("/");
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="login-page">
            <div className="login-box">
                <h2>Login</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-login">
                        Login
                    </button>
                </form>
                <p className="register-link">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
