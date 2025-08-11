import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const [selected, setSelected] = useState("bookings"); // default tab
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {


        const fetchData = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await fetch(`https://bwebbackend.onrender.com/${selected}`);
                if (!res.ok) throw new Error("Failed to fetch data");
                const json = await res.json();
                setData(json);
            } catch (err) {
                setError(err.message || "Error fetching data");
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selected]);

    // Columns based on selected tab
    const columns =
        selected === "bookings"
            ? ["name", "mobile", "date", "service"]
            : ["name", "email", "mobile", "course"];

    return (
        <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
            {/* Sidebar */}
            <aside
                style={{
                    width: 200,
                    background: "#f5f5f5",
                    padding: "1rem",
                    borderRight: "1px solid #ccc",
                }}
            >
                <h3>Admin Panel</h3>
                <ul style={{ listStyle: "none", padding: 0 }}>
                    <li
                        onClick={() => setSelected("bookings")}
                        style={{
                            padding: "10px",
                            marginBottom: 10,
                            cursor: "pointer",
                            backgroundColor: selected === "bookings" ? "#e91e63" : "transparent",
                            color: selected === "bookings" ? "white" : "black",
                            borderRadius: 5,
                        }}
                    >
                        Bookings
                    </li>
                    <li
                        onClick={() => setSelected("trainings")}
                        style={{
                            padding: "10px",
                            cursor: "pointer",
                            backgroundColor: selected === "trainings" ? "#e91e63" : "transparent",
                            color: selected === "trainings" ? "white" : "black",
                            borderRadius: 5,
                        }}
                    >
                        Trainings
                    </li>

                    <li
                        onClick={() => navigate("/")}
                        style={{
                            padding: "10px",
                            cursor: "pointer",
                            borderRadius: 5,
                        }}
                    >
                        Logout
                    </li>
                </ul>
            </aside>


            <main style={{ flex: 1, padding: "1rem" }}>
                <h2>{selected.charAt(0).toUpperCase() + selected.slice(1)}</h2>

                {loading && <p>Loading...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}

                {!loading && !error && data.length === 0 && <p>No data available.</p>}

                {!loading && !error && data.length > 0 && (
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            marginTop: "1rem",
                        }}
                    >
                        <thead>
                            <tr>
                                {columns.map((col) => (
                                    <th
                                        key={col}
                                        style={{
                                            border: "1px solid #ccc",
                                            padding: "8px",
                                            backgroundColor: "#f0f0f0",
                                            textTransform: "capitalize",
                                            textAlign: "left",
                                        }}
                                    >
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, idx) => (
                                <tr key={idx}>
                                    {columns.map((col) => (
                                        <td key={col} style={{ border: "1px solid #ccc", padding: "8px" }}>
                                            {item[col]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
