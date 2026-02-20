import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AdminDashboard = () => {
    const [selected, setSelected] = useState("bookings");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [contactedMap, setContactedMap] = useState({});
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef();

    // ----------------------------
    // CONTACTED MAP LOCAL STORAGE
    // ----------------------------
    useEffect(() => {
        const saved = localStorage.getItem(`contacted_${selected}`);
        if (saved) setContactedMap(JSON.parse(saved));
        else setContactedMap({});
    }, [selected]);


     // ----------------------------
    // FETCH BOOKINGS/TRAININGS
    // ----------------------------
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`https://bwebbackend.onrender.com/api/${selected}`);
            if (!res.ok) throw new Error("Failed to fetch data");
            const json = await res.json();
            setData(json);
        } catch (err) {
            setError(err.message || "Error fetching data");
            setData([]);
        } finally {
            setLoading(false);
        }
   }, [selected]);


     // ----------------------------
    // FETCH PRODUCTS
    // ----------------------------
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("https://bwebbackend.onrender.com/api/getAllProducts");
            if (!res.ok) throw new Error("Failed to fetch products");
            const products = await res.json();
            setData(products);
        } catch (err) {
            setError(err.message || "Failed to fetch products");
        } finally {
            setLoading(false);
        }
   }, []);


    // ----------------------------
    // FETCH DATA OR LOGOUT
    // ----------------------------
    useEffect(() => {
        if (selected !== "logout" && selected !== "products") fetchData();
        else if (selected === "products") fetchProducts(); // fetch products separately
        else {
            Swal.fire({
                title: "Are you sure you want to logout?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#e91e63",
                cancelButtonColor: "#aaa",
                confirmButtonText: "Yes, logout",
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.clear();
                    navigate("/", { replace: true });
                } else {
                    setSelected("bookings");
                }
            });
        }

    }, [selected, fetchData, fetchProducts, navigate]);



   

    // ----------------------------
    // DELETE RECORD
    // ----------------------------
    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e91e63",
            cancelButtonColor: "#aaa",
            confirmButtonText: "Yes!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // check if deleting product
                    const url = selected === "products"
                        ? `https://bwebbackend.onrender.com/api/delete/${id}`
                        : `https://bwebbackend.onrender.com/api/${selected}/${id}`;

                    const res = await fetch(url, { method: "DELETE" });
                    if (!res.ok) throw new Error("Failed to delete record");

                    setData((prev) => prev.filter((item) => item.id !== id));
                    setContactedMap((prev) => {
                        const copy = { ...prev };
                        delete copy[id];
                        localStorage.setItem(`contacted_${selected}`, JSON.stringify(copy));
                        return copy;
                    });

                    Swal.fire("Deleted!", "The record has been deleted.", "success");
                } catch (err) {
                    Swal.fire("Error!", err.message || "Failed to delete record", "error");
                }
            }
        });
    };


    // ----------------------------
    // CONTACTED CHECKBOX
    // ----------------------------
    const handleContactedChange = (id) => {
        setContactedMap((prev) => {
            const updated = { ...prev, [id]: !prev[id] };
            localStorage.setItem(`contacted_${selected}`, JSON.stringify(updated));
            return updated;
        });
    };

    // ----------------------------
    // VIEW DETAILS
    // ----------------------------
    const handleView = (item) => {
        let details = "";
        Object.entries(item).forEach(([key, value]) => {

            if (key === "id") return;
            if (!value) return;

            if (key === "imageName") {
                details += `<p><b>Image:</b><br/>
                        <img src="https://bwebbackend.onrender.com/uploads/${value}" 
                             alt="${item.name}" 
                             style="max-width:200px; max-height:200px; border:1px solid #ccc; padding:2px;" />
                        </p>`;
            } else {
                details += `<p><b>${key}:</b> ${value}</p>`;
            }
        });

        Swal.fire({
            title: "Details",
            html: details,
            width: 600
        });
    };


    // ----------------------------
    // DROPDOWN OUTSIDE CLICK
    // ----------------------------
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        setSelected(option);
        setDropdownOpen(false);
    };

    // ----------------------------
    // STYLES
    // ----------------------------
    const thStyle = { border: "1px solid #ccc", padding: "8px", backgroundColor: "#f0f0f0" };
    const tdStyle = { border: "1px solid #ccc", padding: "8px" };
    const viewBtn = { backgroundColor: "#2196f3", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", marginRight: "5px" };
    const deleteBtn = { backgroundColor: "red", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" };

    // ----------------------------
    // PRODUCT FORM STATE
    // ----------------------------
    const [newProduct, setNewProduct] = useState({ name: "", price: "", description: "", image: null });

   
    // ----------------------------
    // ADD PRODUCT
    // ----------------------------
    const handleAddProduct = async (e) => {
        e.preventDefault();

        if (!newProduct.name || !newProduct.price || !newProduct.description || !newProduct.image) {
            Swal.fire("Warning", "Please fill all fields and select an image", "warning");
            return;
        }

        const formData = new FormData();
        formData.append("name", newProduct.name);
        formData.append("price", newProduct.price);
        formData.append("description", newProduct.description);
        formData.append("image", newProduct.image);

        try {
            const res = await fetch("https://bwebbackend.onrender.com/api/add", { method: "POST", body: formData });
            if (!res.ok) throw new Error("Failed to add product");

            const addedProduct = await res.json();
            setData((prev) => [...prev, addedProduct]); // update table immediately

            Swal.fire("Success", "Product added successfully", "success");

            // reset form
            setNewProduct({ name: "", price: "", description: "", image: null });
            document.getElementById("product-image").value = null;

        } catch (err) {
            Swal.fire("Error", err.message || "Failed to add product", "error");
        }
    };

    return (
        <div style={{ padding: "1rem", fontFamily: "Arial, sans-serif" }}>
            {/* DROPDOWN */}
            <div style={{ marginBottom: "1rem", position: "relative", width: 160 }} ref={dropdownRef}>
                 <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          style={{
            width: "100%",
            padding: "0.4rem 0.8rem",
            fontSize: "0.95rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {selected.charAt(0).toUpperCase() + selected.slice(1)}
          <span>▼</span>
        </button>

                {dropdownOpen && (
                    <ul style={{ position: "absolute", top: "100%", left: 0, width: "100%", backgroundColor: "#fff", boxShadow: "0 2px 5px rgba(0,0,0,0.2)", listStyle: "none", padding: 0, margin: 0, zIndex: 1000, borderRadius: "5px", overflow: "hidden" }}>
                        {["bookings", "trainings", "products", "logout"].map((option) => (
                            <li
                                key={option}
                                onClick={() => handleSelect(option)}
                                style={{ padding: "0.5rem 0.8rem", cursor: "pointer", backgroundColor: selected === option ? "#e91e63" : "#fff", color: selected === option ? "#fff" : "#000", transition: "0.2s" }}
                            >
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* PRODUCT FORM */}
            {selected === "products" && (
                <form onSubmit={handleAddProduct} style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px", marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "1rem", backgroundColor: "#f9f9f9" }}>
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        style={{ padding: "0.6rem", borderRadius: "5px", border: "1px solid #ccc" }}
                    />
                    <input
                        type="number"
                        placeholder="Price (₹)"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        style={{ padding: "0.6rem", borderRadius: "5px", border: "1px solid #ccc" }}
                    />
                    <textarea
                        placeholder="Description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        style={{ padding: "0.6rem", borderRadius: "5px", border: "1px solid #ccc", resize: "vertical" }}
                    />
                    <input
                        id="product-image"
                        type="file"
                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
                    />
                    <button
                        type="submit"
                        style={{ padding: "0.7rem", backgroundColor: "#2196f3", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
                    >
                        Add Product
                    </button>
                </form>
            )}

            <h2>{selected.charAt(0).toUpperCase() + selected.slice(1)}</h2>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!loading && !error && data.length === 0 && <p>No data available.</p>}

            {!loading && !error && data.length > 0 && (
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
                    <thead>
                        <tr>
                            <th style={thStyle}>S.No</th>
                            <th style={thStyle}>{selected === "products" ? "Product Name" : "Name"}</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, idx) => (
                            <tr key={item.id || idx}>
                                <td style={tdStyle}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        {idx + 1}
                                        <input type="checkbox" checked={!!contactedMap[item.id]} onChange={() => handleContactedChange(item.id)} />
                                    </div>
                                </td>
                                <td style={tdStyle}>{item.name}</td>
                                <td style={{ ...tdStyle, textAlign: "center" }}>
                                    <button onClick={() => handleView(item)} style={viewBtn}>View</button>
                                    <button onClick={() => handleDelete(item.id)} style={deleteBtn}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminDashboard;
