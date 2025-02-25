import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PetInfo = () => {
  const [petData, setPetData] = useState({
    petName: "",
    petType: "",
    petBreed: "",
    petAge: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setPetData({ ...petData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      ...petData, // Collect pet info
    };

    try {
      const response = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData }),
      });
      const data = await response.json();
      if (response.ok) {
        navigate("/dashboard"); // Redirect after successful signup
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Pet Name</label>
        <input
          type="text"
          name="petName"
          value={petData.petName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Pet Type</label>
        <input
          type="text"
          name="petType"
          value={petData.petType}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Pet Breed</label>
        <input
          type="text"
          name="petBreed"
          value={petData.petBreed}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Pet Age</label>
        <input
          type="number"
          name="petAge"
          value={petData.petAge}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="button2">Submit</button>
    </form>
  );
};

export default PetInfo;
