"use client"
import { useState } from "react"
import { Pencil, Plus, Save } from "lucide-react"
import "../css/PetProfile.css"
import VisitHistory from "./VisitHistory"
import { useConfirmDialog } from "../contexts/ConfirmDialogContext"

export default function PetProfile() {
  const { showConfirmDialog } = useConfirmDialog()
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [editedPetData, setEditedPetData] = useState({})

  const [petData, setPetData] = useState({
    id: "012345",
    name: "Oreo",
    species: "Dog",
    breed: "Dalmatian",
    gender: "Female",
    birthday: "05/06/2021",
    age: {
      years: "03",
      months: "07",
    },
    color: "White w/ spots",
    status: "Alive",
    owner: "Princess Tan",
    email: "princess@gmail.com",
    contact: "0912345678",
    address: "Manila",
  })

  const [vaccinations, setVaccinations] = useState([
    { type: "Anti-rabies", doses: 2, date: "11/20/2024" },
    { type: "Bordatella", doses: 1, date: "10/15/2024" },
    { type: "DHLPP", doses: 1, date: "9/30/2024" },
  ])


  const [vaccineType, setVaccineType] = useState("")
  const [doses, setDoses] = useState("")
  const [date, setDate] = useState("")

  const getCurrentDate = () => {
    const today = new Date()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")
    const year = today.getFullYear()
    return `${month}/${day}/${year}`
  }

  const handleUpdateDose = (index) => {
    setVaccinations((prevVaccinations) =>
      prevVaccinations.map((vax, i) =>
        i === index ? { ...vax, doses: Number(vax.doses) + 1, date: getCurrentDate() } : vax,
      ),
    )
  }

  const handleAddVaccination = () => {
    if (!vaccineType || !doses || !date) {
      alert("Please fill in all fields.")
      return
    }

    setVaccinations([...vaccinations, { type: vaccineType, doses: Number(doses), date }])

    setVaccineType("")
    setDoses("")
    setDate("")
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditedPetData({ ...petData })
  }

  const handleSave = () => {
    showConfirmDialog("Do you want to save your changes?", () => {
    setPetData(editedPetData)
    setIsEditing(false)
  })
}

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedPetData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="pet-profile-page">
      <div className="tabs">
        <button className={`tab ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>
          Pet Profile
        </button>
        <button className={`tab ${activeTab === "history" ? "active" : ""}`} onClick={() => setActiveTab("history")}>
          Visit History
        </button>
      </div>

      <div className="content-area">
        {activeTab === "profile" ? (
          <div className="profile-content">
            <div className="pet-details">
              <div className="section-header">
                <h2>Pet Profile</h2>
                {isEditing ? (
                  <button className="save-button" onClick={handleSave}>
                    <Save size={16} />
                    Save
                  </button>
                ) : (
                  <button className="edit-button" onClick={handleEdit}>
                    <Pencil size={16} />
                  </button>
                )}
              </div>

              <div className="details-grid">
                <div className="detail-item">
                  <label>ID</label>
                  <span>{petData.id}</span>
                </div>
                <div className="detail-item">
                  <label>Name</label>
                  {isEditing ? (
                    <input type="text" name="name" value={editedPetData.name || ""} onChange={handleInputChange} />
                  ) : (
                    <span>{petData.name}</span>
                  )}
                </div>
                <div className="detail-item">
                  <label>Species</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="species"
                      value={editedPetData.species || ""}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <span>{petData.species}</span>
                  )}
                </div>
                <div className="detail-item">
                  <label>Breed</label>
                  {isEditing ? (
                    <input type="text" name="breed" value={editedPetData.breed || ""} onChange={handleInputChange} />
                  ) : (
                    <span>{petData.breed}</span>
                  )}
                </div>
                <div className="detail-item">
                  <label>Gender</label>
                  {isEditing ? (
                    <input type="text" name="gender" value={editedPetData.gender || ""} onChange={handleInputChange} />
                  ) : (
                    <span>{petData.gender}</span>
                  )}
                </div>
                <div className="detail-item">
                  <label>Birthday</label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="birthday"
                      value={editedPetData.birthday || ""}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <span>{petData.birthday}</span>
                  )}
                </div>
                <div className="detail-item">
                  <label>Age</label>
                  <span>
                    <span className="age-unit">Years</span>
                    <span className="age-value">{petData.age.years}</span>
                    <span className="age-unit">Months</span>
                    <span className="age-value">{petData.age.months}</span>
                  </span>
                </div>
                <div className="detail-item">
                  <label>Color</label>
                  {isEditing ? (
                    <input type="text" name="color" value={editedPetData.color || ""} onChange={handleInputChange} />
                  ) : (
                    <span>{petData.color}</span>
                  )}
                </div>
                <div className="detail-item">
                  <label>Status</label>
                  {isEditing ? (
                    <input type="text" name="status" value={editedPetData.status || ""} onChange={handleInputChange} />
                  ) : (
                    <span>{petData.status}</span>
                  )}
                </div>
              </div>

              <h3 className="contact-header">Contact Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <label>Owner</label>
                  <span>{petData.owner}</span>
                </div>
                <div className="detail-item">
                  <label>Email</label>
                  <span>{petData.email}</span>
                </div>
                <div className="detail-item">
                  <label>Contact no.</label>
                  <span>{petData.contact}</span>
                </div>
                <div className="detail-item">
                  <label>Address</label>
                  <span>{petData.address}</span>
                </div>
              </div>
            </div>

            <div className="separator"></div>

            <div className="vaccination-record">
              <h2>Vaccination Record</h2>

              <div className="vaccination-form">
                <div className="form-group">
                  <label>
                    Type of Vaccine<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Select vaccine type"
                    name="vaccineType"
                    value={vaccineType}
                    onChange={(e) => setVaccineType(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>
                    Doses (Qty.)<span className="required">*</span>
                  </label>
                  <input type="number" min="1" name="doses" value={doses} onChange={(e) => setDoses(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <div className="date-input">
                    <input
                      type="date"
                      placeholder="Select date"
                      name="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  
                  </div>
                </div>
                <button className="add-button" onClick={handleAddVaccination}>
                  <Plus size={16} />
                  Add
                </button>
              </div>

              <div className="vaccination-table">
                <table>
                  <thead>
                    <tr>
                      <th>Type of Vaccine</th>
                      <th>Doses (Qty.)</th>
                      <th></th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vaccinations.map((vax, index) => (
                      <tr key={index}>
                        <td>{vax.type}</td>
                        <td>{vax.doses}</td>
                        <td>
                          <button className="add-dose" onClick={() => handleUpdateDose(index)}>
                            +
                          </button>
                        </td>
                        <td>{vax.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="history-content">
            <VisitHistory />
          </div>
        )}
      </div>
    </div>
  )
}
