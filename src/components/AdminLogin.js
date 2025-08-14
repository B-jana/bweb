import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AdminLogin = () => {
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!form.username.trim() || !form.password.trim()) {
            setError("Username and Password cannot be empty.");
            return;
        }

        // Add listener for mobile back button
const handleBack = () => {
    Swal.close(); // close spinner if user navigates back
    window.removeEventListener("popstate", handleBack);
    navigate("/"); // go to /home
};
window.addEventListener("popstate", handleBack);


        Swal.fire({
    background: "transparent", // no background box
    showConfirmButton: false,
    allowOutsideClick: false,
    html: `
        <div style="text-align:center;">
            <div style="font-size:18px; color:white; margin-bottom:10px;">
                Please wait...
            </div>
            <div class="custom-spinner"></div>
        </div>
    `,
    didOpen: () => {
        // Add spinner styling
        const style = document.createElement("style");
        style.innerHTML = `
            .custom-spinner {
                border: 4px solid rgba(255, 255, 255, 0.3);
                border-top: 4px solid white;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                animation: spin 1s linear infinite;
                margin: 0 auto;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
});


        try {
            const response = await fetch("https://bwebbackend.onrender.com/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
                credentials: "include",
            });

            Swal.close();
            

            if (response.ok) {
                // Redirect to admin dashboard on successful login
                navigate("/admin");
            } else {
                setError("Invalid username or password.");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Admin Login</h2>

            {error && <p style={styles.error}>{error}</p>}

            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Username"
                    style={styles.input}
                />
                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>
                    Login
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: 400,
        margin: "3rem auto",
        padding: "2rem",
        border: "1px solid #ccc",
        borderRadius: 10,
        backgroundColor: "#f9f9f9",
        fontFamily: "Arial, sans-serif",
    },
    heading: {
        textAlign: "center",
        marginBottom: "1rem",
        color: "#333",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    },
    input: {
        padding: 10,
        fontSize: 16,
        borderRadius: 5,
        border: "1px solid #ccc",
    },
    button: {
        padding: 10,
        fontSize: 16,
        borderRadius: 5,
        backgroundColor: "#e91e63",
        color: "white",
        border: "none",
        cursor: "pointer",
    },
    error: {
        color: "red",
        textAlign: "center",
        marginBottom: "1rem",
        fontWeight: "bold",
    },
};

export default AdminLogin;
