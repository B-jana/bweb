import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AdminDashboard = () => {
  const [selected, setSelected] = useState("bookings"); // default tab
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [contactedMap, setContactedMap] = useState({}); // store contacted state per id
  const navigate = useNavigate();

  // Load contacted state from localStorage whenever selected tab changes
  useEffect(() => {
    const saved = localStorage.getItem(`contacted_${selected}`);
    if (saved) {
      setContactedMap(JSON.parse(saved));
    } else {
      setContactedMap({});
    }
  }, [selected]);

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
          const res = await fetch(`https://bwebbackend.onrender.com/api/${selected}/${id}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error("Failed to delete record");

          setData((prev) => prev.filter((item) => item.id !== id));

          // Remove from contacted map as well
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

  const handleContactedChange = (id) => {
    setContactedMap((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem(`contacted_${selected}`, JSON.stringify(updated));
      return updated;
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
                <th style={{ border: "1px solid #ccc", padding: "8px", backgroundColor: "#f0f0f0" }}>
                  S.No
                </th>
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
                  Contacted
                </th>
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
                <tr key={item.id || idx}>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{idx + 1}</td>
                  {columns.map((col) => (
                    <td key={col} style={{ border: "1px solid #ccc", padding: "8px" }}>
                      {col === "date" && item[col]
                        ? (() => {
                            const d = new Date(item[col]);
                            const day = String(d.getDate()).padStart(2, "0");
                            const month = String(d.getMonth() + 1).padStart(2, "0");
                            const year = d.getFullYear();
                            return `${day}-${month}-${year}`;
                          })()
                        : item[col]}
                    </td>
                  ))}
                  <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={!!contactedMap[item.id]}
                      onChange={() => handleContactedChange(item.id)}
                    />
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
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
