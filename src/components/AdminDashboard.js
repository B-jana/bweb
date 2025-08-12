import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../AdminDashboard.css"; // Import the CSS

const AdminDashboard = () => {
  const [selected, setSelected] = useState("bookings");
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
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e91e63",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(
            `https://bwebbackend.onrender.com/api/${selected}/${id}`,
            {
              method: "DELETE",
            }
          );
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

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h3>Admin Panel</h3>
        <ul>
          <li
            className={selected === "bookings" ? "active" : ""}
            onClick={() => setSelected("bookings")}
          >
            Bookings
          </li>
          <li
            className={selected === "trainings" ? "active" : ""}
            onClick={() => setSelected("trainings")}
          >
            Trainings
          </li>
          <li
            onClick={() => {
              Swal.fire({
                title: "Are you sure you want to logout?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#e91e63",
                cancelButtonColor: "#aaa",
                confirmButtonText: "Yes, logout",
              }).then((result) => {
                if (result.isConfirmed) {
                  navigate("/");
                }
              });
            }}
            style={{ cursor: "pointer" }}
          >
            Logout
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <h2>{selected.charAt(0).toUpperCase() + selected.slice(1)}</h2>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && data.length === 0 && <p>No data available.</p>}

        {!loading && !error && data.length > 0 && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>S.No</th>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td>{idx + 1}</td>
                  {columns.map((col) => (
                    <td key={col}>
                      {col === "date" ? formatDate(item[col]) : item[col]}
                    </td>
                  ))}
                  <td className="actions">
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item.id)}
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
