"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
import "../css/MyAccount.css"

const MyAccount = () => {
  const [userData] = useState({
    firstName: "John",
    lastName: "Kho",
    role: "Clinician",
    email: "cliniciankho1@gmail.com",
    contactNumber: "+639123456789",
  })

  return (
    <div className="my-account">
      <div className="account-container">
        <h1>My Account</h1>

        <div className="profile-container">
          <div className="profile-section">
            <div className="avatar-container">
              <div className="avatar-placeholder"></div>
              <h2>{`${userData.firstName} ${userData.lastName}`}</h2>
              <p className="role">{userData.role}</p>
            </div>

            <div className="info-section">
              <div className="info-card">
                <div className="card-header">
                  <h3>Personal Information</h3>
                  <button className="edit-profile-btn">
                    <Pencil size={16} />
                    Edit Profile
                  </button>
                </div>

                <div className="info-grid">
                  <div className="info-group">
                    <label>First Name</label>
                    <div className="info-value">{userData.firstName}</div>
                  </div>

                  <div className="info-group">
                    <label>Email</label>
                    <div className="info-value">{userData.email}</div>
                  </div>

                  <div className="info-group">
                    <label>Last Name</label>
                    <div className="info-value">{userData.lastName}</div>
                  </div>

                  <div className="info-group">
                    <label>Contact Number</label>
                    <div className="info-value">{userData.contactNumber}</div>
                  </div>
                </div>
              </div>

              <div className="info-card">
                <div className="card-header">
                  <h3>Change Password</h3>
                  <button className="change-btn">Change</button>
                </div>

                <div className="password-section">
                  <label>Password</label>
                  <input type="password" value="••••••••••••••••••••••" readOnly className="password-input" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyAccount
