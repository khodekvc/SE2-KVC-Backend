import { UserCircle, Folder } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import "../css/Sidebar.css"

export default function Sidebar({ className = "", onMenuItemClick }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isPatientSection = !location.pathname.startsWith("/account")

  const handleClick = (path) => {
    navigate(path)
    if (onMenuItemClick) {
      onMenuItemClick()
    }
  }

  return (
    <>
      {/* desktop didebar */}
      <nav className={`sidebar desktop-sidebar ${className}`}>
        <div
          className={`sidebar-item ${location.pathname === "/account" ? "active" : ""}`}
          onClick={() => handleClick("/account")}
        >
          <UserCircle size={40} />
        </div>
        <div className={`sidebar-item ${isPatientSection ? "active" : ""}`} onClick={() => handleClick("/")}>
          <Folder size={24} fill="currentColor" />
        </div>
      </nav>

      {/* mobile menu */}
      <nav className={`sidebar mobile-sidebar ${className}`}>
        <div className="mobile-menu">
          <div
            className={`mobile-menu-item ${location.pathname === "/account" ? "active" : ""}`}
            onClick={() => handleClick("/account")}
          >
            <UserCircle size={24} />
            <span>My Account</span>
          </div>
          <div className={`mobile-menu-item ${isPatientSection ? "active" : ""}`} onClick={() => handleClick("/")}>
            <Folder size={24} />
            <span>Patient Directory</span>
          </div>
        </div>
      </nav>
    </>
  )
}
