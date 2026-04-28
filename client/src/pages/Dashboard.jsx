import { useEffect, useState } from "react";
import { siteContent } from "../siteData";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const endpoint = user.role === "admin" ? "/api/enquiries/all" : "/api/enquiries/me";
        const res = await fetch(`${siteContent.apiBaseUrl}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setEnquiries(data.enquiries);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user && token) {
      fetchEnquiries();
    }
  }, [user, token]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <header className="site-header scrolled">
        <div className="container nav-shell">
          <a className="brand" href="/">
            <div className="brand-copy"><span className="brand-name">{siteContent.businessName}</span></div>
          </a>
          <nav aria-label="Primary navigation">
             <ul className="nav-links desktop-only">
               <li><a className="nav-link" href="/">Home</a></li>
               <li><button onClick={handleLogout} className="button button-ghost" style={{ cursor: "pointer" }}>Logout</button></li>
             </ul>
          </nav>
        </div>
      </header>

      <main style={{ padding: "120px 20px 60px", maxWidth: "1000px", margin: "0 auto", backgroundColor: "#faf4ea", minHeight: "100vh" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "40px" }}>
          {user.avatar && <img src={user.avatar} alt="Avatar" style={{ width: "60px", height: "60px", borderRadius: "50%" }} />}
          <div>
            <h1 style={{ margin: 0, color: "#406a56" }}>Welcome, {user.name}</h1>
            <p style={{ margin: "5px 0 0", color: "#666" }}>{user.role === "admin" ? "Admin Dashboard" : "Customer Dashboard"}</p>
          </div>
        </div>

        <section className="panel" style={{ backgroundColor: "#fff" }}>
          <h2 style={{ marginBottom: "20px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>
            {user.role === "admin" ? "All Platform Enquiries" : "Your Submitted Enquiries"}
          </h2>
          
          {loading ? (
            <p>Loading enquiries...</p>
          ) : enquiries.length === 0 ? (
            <p style={{ color: "#666" }}>No enquiries found.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #e2e8f0" }}>
                    <th style={{ padding: "12px" }}>Date</th>
                    {user.role === "admin" && <th style={{ padding: "12px" }}>Name</th>}
                    {user.role === "admin" && <th style={{ padding: "12px" }}>Email</th>}
                    <th style={{ padding: "12px" }}>Service</th>
                    <th style={{ padding: "12px" }}>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map(enq => (
                    <tr key={enq._id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                      <td style={{ padding: "12px", whiteSpace: "nowrap" }}>{new Date(enq.createdAt).toLocaleDateString()}</td>
                      {user.role === "admin" && <td style={{ padding: "12px" }}>{enq.name}</td>}
                      {user.role === "admin" && <td style={{ padding: "12px" }}>{enq.email || "-"}</td>}
                      <td style={{ padding: "12px" }}>{enq.service || "General"}</td>
                      <td style={{ padding: "12px", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={enq.message}>{enq.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
