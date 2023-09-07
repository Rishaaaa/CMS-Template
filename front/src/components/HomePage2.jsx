
import React, { useEffect, useState, useRef } from 'react';
import video from './video/video.mp4';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDrag, useDrop } from 'react-dnd';

const Field = ({ field, index, fields, setFields, formValues, handleChange, formRef }) => {
  const [, drop] = useDrop({
    accept: 'FIELD',
    hover: (item) => {
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const updatedFields = [...fields];
      const draggedField = updatedFields[dragIndex];
      updatedFields.splice(dragIndex, 1);
      updatedFields.splice(hoverIndex, 0, draggedField);
      setFields(updatedFields);
      item.index = hoverIndex;
    },
  });

  const [, drag] = useDrag({
    type: 'FIELD',
    item: { index },
  });

  const handleFieldDrop = (e) => {
    e.preventDefault();
    const droppedX = e.clientX - formRef.current.offsetLeft;
    const droppedY = e.clientY - formRef.current.offsetTop;
    const updatedFields = [...fields];
    updatedFields[index] = { ...field, x: droppedX, y: droppedY };
    setFields(updatedFields);
  };

  const { name, type, required, x, y } = field;
  const fieldStyle = {
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
  };

  return (
    <div ref={(node) => drop(drag(node))} style={fieldStyle} onDrop={handleFieldDrop} onDragOver={(e) => e.preventDefault()}>
      <div style={{ cursor: 'move' }}>
        {type === 'text' && (
          <div>
            <label htmlFor={name}>{name}</label>
            <input
              type="text"
              id={name}
              name={name}
              required={required}
              value={formValues[name] || ''}
              onChange={handleChange}
            />
          </div>
        )}

        {type === 'checkbox' && (
          <div>
            <input
              type="checkbox"
              id={name}
              name={name}
              checked={formValues[name] || false}
              onChange={handleChange}
            />
            <label htmlFor={name}>{name}</label>
          </div>
        )}

        {type === 'radio' && (
          <div>
            <input
              type="radio"
              id={name}
              name={name}
              checked={formValues[name] || false}
              onChange={handleChange}
            />
            <label htmlFor={name}>{name}</label>
          </div>
        )}

        {type === 'select' && (
          <div>
            <label htmlFor={name}>{name}</label>
            <select id={name} name={name} value={formValues[name] || ''} onChange={handleChange}>
              <option value="">Select an option</option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};




const HomePage2 = () => {
  const [message2, setMessage2] = useState('');
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);
  const [selectedTemplateData, setSelectedTemplateData] = useState(null);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Add isEditing state for the FormComponent

  const navigate = useNavigate();
  const { id } = useParams();

  const formRef = useRef(null);

  useEffect(() => {
    fetch(`/api/template/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setMessage2(data.message);
        setSelectedTemplateData(data);
      })
      .catch((error) => console.error('Error:', error));
  }, [id]);

  useEffect(() => {
    fetch('/api/templates') // Update the URL to match the server-side route
      .then((response) => response.json())
      .then((data) => setSavedTemplates(data.templates)) // Update to data.templates
      .catch((error) => console.error('Error fetching templates:', error));
  }, []);


  const handleRemoveTemplate = async (templateId) => {
    try {
      const response = await fetch(`/api/template/${templateId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const updatedTemplates = savedTemplates.filter((template) => template._id !== templateId);
        setSavedTemplates(updatedTemplates);
      } else {
        console.error('Failed to delete template.');
      }
    } catch (error) {
      console.error('An error occurred while deleting the template:', error);
    }
  };


  const toggleDeleteOptions = () => {
    setShowDeleteOptions((prevValue) => !prevValue);
  };



  const handleTemplateUpdate = (updatedTemplateData) => {
    fetch(`/api/template/${updatedTemplateData._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTemplateData),
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedTemplates = savedTemplates.map((template) =>
          template._id === data.updatedTemplate._id ? data.updatedTemplate : template
        );
        setSavedTemplates(updatedTemplates);
        setShowTemplateForm(false);
        setIsEditing(false); // Set isEditing back to false after the update
      })
      .catch((error) => console.error('Error:', error));
  };

  return (
    <div className="home-page">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link to="/homepage2" className="navbar-brand">
          Falca2
        </Link>
        <h1>{message2}</h1>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Sign Up
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Sign In
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <video className="video-bg" autoPlay loop muted>
        <source src={video} type="video/mp4" />
      </video>
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-md-6">
            <div className="card bg-secondary justify-content-center mt-5">
              <div className="card-body text-center">
                <h1 className="mt-5 text-dark">Welcome to Falca2</h1>
                <div className="options d-flex justify-content-center mt-5">
                  <Link to="/farmerlist2" className="btn btn-outline-warning btn-lg mx-2">
                    Farmer
                  </Link>
                  <Link to="/traderlist2" className="btn btn-outline-warning btn-lg mx-2">
                    Trader
                  </Link>
                </div>
                <div className="options d-flex justify-content-center mt-5">
                  <Link to="/farmer-template" className="btn btn-outline-warning btn-lg mx-2">
                    Template
                  </Link>
                  <Link to="/trader-template" className="btn btn-outline-warning btn-lg mx-2">
                    Trader Template
                  </Link>
                  {savedTemplates.map((template) => (
                    <button
                      key={template._id}
                      className="btn btn-outline-warning btn-lg mx-2"
                      onClick={() => {
                        navigate(`/new-template/${template._id}`);
                      }}
                    >
                      {template.templateName}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                className="btn btn-outline-danger btn-lg mx-2"
                onClick={toggleDeleteOptions}
              >
                Manage Templates
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* New section for template management */}
      {showDeleteOptions && (
        <div className="container mt-4">
          <h3>Manage Templates</h3>
          {savedTemplates.length > 0 ? (
            <ul className="list-group">
              {savedTemplates.map((template) => (
                <li
                  key={template._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <button onClick={() => {
                    navigate(`/new-template/${template._id}`);
                  }}
                    className="btn btn-outline-primary btn-md mx-2">
                    {template.templateName}
                  </button>
                  <div>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm mx-2"
                      onClick={() => handleRemoveTemplate(template._id)} // Use template._id
                    >
                      Remove
                    </button>


                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No templates saved yet.</p>
          )}
        </div>
      )}
      {/* Display the dynamic form */}
      {showTemplateForm && selectedTemplateData && (
        <div className="container mt-4">
          <h3>Template Form: {selectedTemplateData.templateName}</h3>
          {/* Render the dynamic form here */}
          <div>
            <div
              style={{
                position: 'relative',
                width: `${selectedTemplateData.areaWidth}px`,
                height: `${selectedTemplateData.areaHeight}px`,
                border: '1px solid black',
              }}
              ref={formRef}
            >
              <form onSubmit={handleTemplateUpdate}>
                <div>
                  {selectedTemplateData.fields.map((field, index) => (
                    <Field
                      key={field.name}
                      field={field}
                      index={index}
                      fields={selectedTemplateData.fields}
                      setFields={setSelectedTemplateData}
                      formValues={selectedTemplateData.formValues}
                      handleChange={() => { }}
                      formRef={formRef}
                    />
                  ))}
                </div>
                <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
                  {isEditing && <button type="submit">Save Changes</button>}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage2;

