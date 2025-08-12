import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2

const AdminDashboard = () => {
    const [selected, setSelected] = useState("bookings"); // default tab
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [selected]);

    const fetchData = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`http://localhost:8080/api/${selected}`);
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

    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e91e63",
            cancelButtonColor: "#aaa",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`http://localhost:8080/api/${selected}/${id}`, {
                        method: "DELETE",
                    });
                    if (!res.ok) throw new Error("Failed to delete record");

                    setData((prev) => prev.filter((item) => item.id !== id));

                    Swal.fire("Deleted!", "The record has been deleted.", "success");
                } catch (err) {
                    Swal.fire("Error!", err.message || "Failed to delete record", "error");
                }
            }
        });
    };

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
                            backgroundColor: "transparent",
                            color: "black",
                            borderRadius: 5,
                        }}
                    >
                        Logout
                    </li>
                </ul>
            </aside>

            {/* Main Content */}
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
                                <th
                                    style={{
                                        border: "1px solid #ccc",
                                        padding: "8px",
                                        backgroundColor: "#f0f0f0",
                                        textAlign: "center",
                                    }}
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, idx) => (
                                <tr key={idx}>
                                    {columns.map((col) => (
                                        <td
                                            key={col}
                                            style={{ border: "1px solid #ccc", padding: "8px" }}
                                        >
                                            {item[col]}
                                        </td>
                                    ))}
                                    <td
                                        style={{
                                            border: "1px solid #ccc",
                                            padding: "8px",
                                            textAlign: "center",
                                        }}
                                    >
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            style={{
                                                backgroundColor: "red",
                                                color: "white",
                                                border: "none",
                                                padding: "5px 10px",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
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
