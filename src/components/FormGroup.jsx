import React from 'react';

const FormGroup = ({ label, type, name, value, onChange, required }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label} {required && '*'}</label>
      <input 
        type={type} 
        id={name} 
        name={name} 
        value={value} 
        onChange={onChange} 
        required={required} 
      />
    </div>
  );
};

export default FormGroup;
