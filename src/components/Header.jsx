import { Menu, LogOut } from "lucide-react";
import "../css/Header.css";
import { useNavigate } from "react-router-dom";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
        const csrfToken = document.cookie
            .split("; ")
            .find(row => row.startsWith("csrfToken="))
            ?.split("=")[1];

        const response = await fetch("http://localhost:5000/auth/logout", {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CSRF-Token": csrfToken // Send CSRF token in headers
            }
        });

        if (response.ok) {
            navigate("/");
        } else {
            console.error("Logout failed");
        }
    } catch (error) {
        console.error("Error during logout:", error);
    }
  };


  return (
    <header className="header">
      <div className="header-left">
        <button className="burger-menu" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <div className="logo-container">
          <img src="/logo.png" alt="Kho Veterinary Clinic Logo" className="logo" />
        </div>
        <div className="header-text">
          <h1>KHO VETERINARY CLINIC</h1>
          <p>Four paws, two feet, one heart</p>
        </div>
      </div>
      <button className="logout-btn" onClick={handleLogout}>
        <span className="logout-text">LOG OUT</span>
        <LogOut size={24} className="logout-icon" />
      </button>
    </header>
  );
};

export default Header;
