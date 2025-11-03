import { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

function SellerRegister() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        phone: "",
        companyName: "",
        address: "",
        role: "SELLER"
    });
    const [msg, setMsg] = useState("");

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/auth/register/seller", {
                user: {
                    username: form.username,
                    email: form.email,
                    password: form.password,
                },
                phone: form.phone,
                companyName: form.companyName,
                address: form.address
            });
            setMsg("Registered! Redirecting to login...");
            setTimeout(() => navigate("/login"), 1200);
        } catch (err) {
            setMsg("Registration failed");
            console.error(err);
        }
    };

    return (
        <div className="register-container">
            <h2>Provider Registration</h2>
            <form onSubmit={handleSubmit}>
                <input name="username" placeholder="Your name" onChange={handleChange} required/>
                <input name="email" type="email" placeholder="Email" onChange={handleChange} required/>
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required/>
                <input name="companyName" placeholder="company's name" onChange={handleChange}/>
                <input name="phone" placeholder="Phone" onChange={handleChange}/>
                <input name="address" placeholder="Address" onChange={handleChange}/>
                <button type="submit">Register as Provider</button>
            </form>
            {msg && <p>{msg}</p>}
        </div>
    );
}

export default SellerRegister;
