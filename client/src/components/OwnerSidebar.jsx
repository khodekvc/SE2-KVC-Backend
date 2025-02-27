// not use for testing lang PET owners

import { UserCircle, Folder, PawPrint } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import "../css/Sidebar.css"

export default function OwnerSidebar({ className = "" }) {
  const location = useLocation()

  return (
    <nav className={`sidebar ${className}`}>
      <Link to="/account" className={`sidebar-item ${location.pathname === "/account" ? "active" : ""}`}>
        <UserCircle size={40} />
      </Link>
      <Link to="/" className={`sidebar-item ${location.pathname === "/" ? "active" : ""}`}>
        <Folder size={24} fill="currentColor" />
      </Link>
      <Link to="/add-pet" className={`sidebar-item ${location.pathname === "/add-pet" ? "active" : ""}`}>
        <PawPrint size={24} />
      </Link>
    </nav>
  )
}
