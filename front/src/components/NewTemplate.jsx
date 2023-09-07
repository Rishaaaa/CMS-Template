

import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const NewTemplate = () => {
  const [fields, setFields] = useState([]);
  const [areaWidth, setAreaWidth] = useState(800);
  const [areaHeight, setAreaHeight] = useState(400);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [selectedTemplateData, setSelectedTemplateData] = useState(null);
  const { id: templateId } = useParams();

  useEffect(() => {
    fetch(`/api/template/${templateId}`)
      .then((response) => response.json())
      .then((data) => {
        setFields(data.fields);
        setAreaWidth(data.areaWidth);
        setAreaHeight(data.areaHeight);
        setSelectedTemplateData(data);
        setShowTemplateForm(true);
      })
      .catch((error) => console.error('Error:', error));
  }, [templateId]);

  const columnCount = 3; // Define the number of columns

  // Calculate the number of rows based on the maximum row value in the fields
  const rowCount = fields.reduce((maxRow, field) => {
    return field.row > maxRow ? field.row : maxRow;
  }, 0) + 1; // Add 1 to account for zero-based indexing

  // Create an array of row and column objects
  const cellData = [];
  for (let row = 0; row < rowCount; row++) {
    for (let column = 0; column < columnCount; column++) {
      const fieldInCell = fields.find((field) => field.row === row && field.column === column);
      cellData.push({ row, column, field: fieldInCell });
    }
  }

  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  const handleSubmit = (e) => {
    e.preventDefault();
    let allFieldsValid = true;

    // Validate email and phone fields
    fields.forEach((field) => {
      if (field.type === 'email') {
        if (field.required && !e.target[field.name].value) {
          allFieldsValid = false;
        } else if (e.target[field.name].value && !/\S+@\S+\.\S+/.test(e.target[field.name].value)) {
          allFieldsValid = false;
        }
      }

      if (field.type === 'phone') {
        if (field.required && !e.target[field.name].value) {
          allFieldsValid = false;
        } else if (e.target[field.name].value && !/^\d{10,12}$/.test(e.target[field.name].value)) {
          allFieldsValid = false;
        }
      }
    });

    if (allFieldsValid) {
      // If all fields are valid, reset the form and show success message
      e.target.reset();
      setSuccessMessage('Form validated successfully');
      setErrorMessage(''); // Clear any previous error message
    } else {
      setSuccessMessage(''); // Clear success message
      setErrorMessage('Form validation failed');
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="CreateFarmer">
        <div className="container mt-4">
          <h2>Template</h2>
          {showTemplateForm && selectedTemplateData && (
            <div className="container mt-4">
              <h3>Template Form: {selectedTemplateData.templateName}</h3>

              <form onSubmit={handleSubmit}>
                <div
                  style={{
                    border: '1px solid #ccc', // Border for the entire template area
                    padding: '16px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
                        gap: '16px',
                        borderCollapse: 'collapse', // Merge cell borders
                      }}
                    >
                      {cellData.map(({ row, column, field }, index) => (
                        <div
                          key={index}
                          style={{
                            border: '1px solid transparent', // Transparent cell border
                            padding: '16px',
                            textAlign: 'center',
                          }}
                        >
                          {field && (
                            <div>
                              <Field field={field} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
                {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <button type="submit">Submit</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

const Field = ({ field }) => {
  const { label, name, type, required } = field;

  const [isValid, setIsValid] = useState(true);

  const validateField = (value) => {
    if (type === 'email' && !/\S+@\S+\.\S+/.test(value)) {
      setIsValid(false);
    } else if (type === 'phone' && !/^\d{10,12}$/.test(value)) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    validateField(value);
  };

  return (
    <div className="form-group">
      <label htmlFor={name}>{name}</label>
      {type === 'text' && (
        <input
          type="text"
          name={name}
          className={`form-control ${isValid ? '' : 'is-invalid'}`}
          required={required}
          onChange={handleInputChange}
        />
      )}
      {type === 'checkbox' && (
        <div className="form-check">
          <input type="checkbox" name={name} className="form-check-input" />
          <label className="form-check-label">Option 1</label><br />
          <input type="checkbox" name={name} className="form-check-input" />
          <label className="form-check-label">Option 2</label>
        </div>
      )}
      {type === 'radio' && (
        <div className="form-check">
          <input type="radio" name={name} value="option1" className="form-check-input" />
          <label className="form-check-label">Option 1</label>
          <input type="radio" name={name} value="option2" className="form-check-input" />
          <label className="form-check-label">Option 2</label>
        </div>
      )}
      {type === 'select' && (
        <select name={name} className="form-control">
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        </select>
      )}
      {type === 'textarea' && (
        <textarea
          name={name}
          className={`form-control ${isValid ? '' : 'is-invalid'}`}
          required={required}
          onChange={handleInputChange}
        />
      )}
      {type === 'email' && (
        <div>
          <input
            type="email"
            name={name}
            className={`form-control ${isValid ? '' : 'is-invalid'}`}
            required={required}
            onChange={handleInputChange}
          />
          {!isValid && <div className="invalid-feedback">Invalid email format</div>}
        </div>
      )}
      {type === 'phone' && (
        <div>
          <input
            type="tel"
            name={name}
            className={`form-control ${isValid ? '' : 'is-invalid'}`}
            required={required}
            onChange={handleInputChange}
          />
          {!isValid && <div className="invalid-feedback">Invalid phone number format</div>}
        </div>
      )}

      {type === 'time' && (
        <div>
          <input
            type="time"
            name={name}
            className={`form-control ${isValid ? '' : 'is-invalid'}`}
            required={required}
            onChange={handleInputChange}
          />
        </div>
      )}

      {type === 'date' && (
        <div>
          <input
            type="date"
            name={name}
            className={`form-control ${isValid ? '' : 'is-invalid'}`}
            required={required}
            onChange={handleInputChange}
          />
        </div>
      )}

    </div>
  );
};

export default NewTemplate;

