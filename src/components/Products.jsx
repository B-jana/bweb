import React, { useEffect, useState } from "react";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8080/api/getAllProducts")
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handleBuy = (product) => {
        setSelectedProduct(product);
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2 style={{ marginBottom: "1rem" }}>Products</h2>

            {loading && <p>Loading products...</p>}
            {!loading && products.length === 0 && <p>No products available.</p>}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.5rem" }}>
                {products.map((p) => (
                    <div key={p.id} style={{ border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
                        <img
                            src={`http://localhost:8080/uploads/${p.imageName}`}
                            alt={p.name}
                            style={{ width: "100%", height: "180px", objectFit: "cover" }}
                        />
                        <div style={{ padding: "0.8rem" }}>
                            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.3rem" }}>{p.name}</h3>
                            <p style={{ fontSize: "0.9rem", color: "#555" }}>{p.description}</p>
                            <p style={{ fontWeight: "bold", margin: "0.5rem 0" }}>₹ {p.price}</p>
                            <button
                                onClick={() => handleBuy(p)}
                                style={{
                                    width: "100%",
                                    padding: "0.6rem",
                                    backgroundColor: "#2196f3",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                }}
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Payment Modal */}
            {selectedProduct && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000,
                }}>
                    <div style={{ backgroundColor: "#fff", padding: "2rem", borderRadius: "10px", maxWidth: "400px", width: "90%" }}>
                        <h2 style={{ marginBottom: "1rem" }}>Purchase {selectedProduct.name}</h2>
                        <p>Price: ₹ {selectedProduct.price}</p>

                        <button
                            onClick={() => alert(`Redirecting to payment for ₹ ${selectedProduct.price}`)}
                            style={{ padding: "0.6rem 1rem", backgroundColor: "#4caf50", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", marginRight: "1rem" }}
                        >
                            Pay Now
                        </button>
                        <button
                            onClick={handleCloseModal}
                            style={{ padding: "0.6rem 1rem", backgroundColor: "#f44336", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
