

import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate } from 'react-router-dom';
import 'react-resizable/css/styles.css';
import AdditionalFields from './AdditionalFields';
import Field from './Field';
import FieldTypes from './FieldTypes';

const FarmerTemplate = () => {
  const [templates, setTemplates] = useState([]);
  const [currentTemplateFields, setCurrentTemplateFields] = useState([]);
  const [fieldLayout, setFieldLayout] = useState([]);
  const [loadedTemplate, setLoadedTemplate] = useState(null);
  const [areaWidth, setAreaWidth] = useState(800);
  const [areaHeight, setAreaHeight] = useState(400);
  const [loadedTemplateName, setLoadedTemplateName] = useState(null);
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(null);
  const [rowCount, setRowCount] = useState(1);
  const [saveErrorMessage, setSaveErrorMessage] = useState('');

  const [fieldTypeCounters, setFieldTypeCounters] = useState({});
  const [draggedField, setDraggedField] = useState(null);
  const [copiedFieldCounter, setCopiedFieldCounter] = useState(1);

  const [highlightedRow, setHighlightedRow] = useState(null);
  const [highlightedColumn, setHighlightedColumn] = useState(null);
  const [highlightedCell, setHighlightedCell] = useState(null); // Track the highlighted cell


  const requiredAreaHeight = Math.ceil(currentTemplateFields.length / 2) * 100; // Calculate the required height based on rows and divide by 2 columns
  const columns = 3; // Set the number of columns

  const handleCellClick = (row, column) => {
    // Set the highlighted cell when a cell is clicked
    setHighlightedCell({ row, column });
  };

  useEffect(() => {
    // Calculate the rowCount based on the maximum row value in currentTemplateFields
    const maxRow = currentTemplateFields.reduce((max, field) => {
      if (field.row > max) {
        return field.row;
      }
      return max;
    }, 0);

    setRowCount(maxRow + 1); // Add 1 to account for zero-based indexing
  }, [currentTemplateFields]);

  const calculateRowCount = () => {
    let maxRow = 1;

    currentTemplateFields.forEach((field) => {
      if (field.row > maxRow) {
        maxRow = field.row;
      }
    });

    return maxRow + 1; // Add 1 to account for zero-based indexing
  };


  const DraggableField = ({ type, label, name, required, onEdit, onRequiredChange, onDelete, onCopy, row, column, isDragging }) => {
    const [, ref] = useDrag({
      type: 'FIELD',
      item: { name, type, label, required },
    });

    const handleFieldDrop = (item) => {
      const targetCell = highlightedCell || findEmptyCell();

      if (!targetCell) {
        return;
      }

      const fieldExistsInTargetCell = currentTemplateFields.some(
        (field) => field.row === targetCell.row && field.column === targetCell.column
      );

      if (!fieldExistsInTargetCell) {
        // Determine the field name based on the type and its counter
        let newFieldName = `${item.name}`;
        if (fieldTypeCounters[item.type] !== undefined) {
          fieldTypeCounters[item.type]++; // Increment the counter for this field type
          newFieldName = `${item.name}_${fieldTypeCounters[item.type]}`;
        } else {
          fieldTypeCounters[item.type] = 1;
        }

        const newField = {
          type: item.type,
          label: item.label,
          name: newFieldName, // Use the new field name
          required: item.required,
          row: targetCell.row,
          column: targetCell.column,
        };

        setCurrentTemplateFields((prevFields) => [...prevFields, newField]);
        setHighlightedCell(null);
      }
    };

    // Add a new function to find an empty cell
    const findEmptyCell = () => {
      // Find the first empty cell for dropping the field
      for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
          if (!currentTemplateFields.some((field) => field.row === rowIndex && field.column === columnIndex)) {
            return { row: rowIndex, column: columnIndex };
          }
        }
      }
      return null; // Return null if no empty cell is found
    };

    const [, drop] = useDrop({
      accept: 'FIELD',
      drop: (item) => {
        const newRow = Math.floor((highlightedRow * 100) / areaHeight);
        const newColumn = Math.floor((highlightedColumn * columns) / areaWidth);

        handleFieldDrop(item, newRow, newColumn);
      },
    });

    const handleHover = (row, column) => {
      setHighlightedRow(row);
      setHighlightedColumn(column);
    };


    const handleCopy = () => {
      // Create a copy of the field with a new name (e.g., field1, field2)
      const newName = `${name}_copy${copiedFieldCounter}`;
      setCopiedFieldCounter(copiedFieldCounter + 1);

      onCopy(newName);
    };

    return (
      <div
        ref={(node) => {
          ref(drop(node));
        }}
        style={{
          position: 'relative',
          cursor: 'move',
        }}
        onClick={() => handleCellClick(row, column)} // Call handleCellClick when the cell is clicked
      >
        <div
          className={`card ${isDragging ? 'dragging' : ''}`}
          style={{
            backgroundColor: highlightedRow === null ? '' : 'lightblue',
            borderColor: highlightedColumn === null ? '' : 'lightblue',
          }}
        >
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>{label}</div>
              <button type="button" className="btn btn-primary btn-sm" onClick={handleCopy}>
                Copy
              </button>
            </div>
            <Field
              type={type}
              label={label}
              name={name}
              required={required}
              onEdit={onEdit}
              onRequiredChange={onRequiredChange}
            />
            {required && <span className="text-danger">* Required</span>}
            <button type="button" className="btn btn-danger btn-sm mt-2" onClick={onDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  const [, drop] = useDrop({
    accept: 'FIELD',
    drop: (item) => {
      if (highlightedCell) {
        const newRow = highlightedCell.row; // Use the highlighted cell's row
        const newColumn = highlightedCell.column; // Use the highlighted cell's column

        handleFieldDrop(item, newRow, newColumn);
      }
    },
  });



  const handleCopyField = (fieldName) => {
    // Find the original field by its name
    const originalField = currentTemplateFields.find((field) => field.name === fieldName);

    if (originalField) {
      // Create a copy of the original field
      const copyField = { ...originalField, name: `${originalField.name}_copy${copiedFieldCounter}` };

      // Increment the copiedFieldCounter for the next copy
      setCopiedFieldCounter(copiedFieldCounter + 1);

      // Add the copied field to the currentTemplateFields
      setCurrentTemplateFields((prevFields) => [...prevFields, copyField]);
    }
  };


  useEffect(() => {
    const initialFieldLayout = currentTemplateFields.map((field) => ({
      i: field.name,
      x: field.column,
      y: field.row,
      w: 1,
      h: 1,
      isResizable: false,
    }));
    setFieldLayout(initialFieldLayout);
  }, [currentTemplateFields]);



  const handleFieldDrop = (item) => {
    const targetCell = highlightedCell || findEmptyCell();

    if (!targetCell) {
      return;
    }

    const fieldExistsInTargetCell = currentTemplateFields.some(
      (field) => field.row === targetCell.row && field.column === targetCell.column
    );

    if (!fieldExistsInTargetCell) {
      // Determine the field name based on the type and its counter
      let newFieldName = `${item.name}`;
      if (fieldTypeCounters[item.type] !== undefined) {
        fieldTypeCounters[item.type]++; // Increment the counter for this field type
        newFieldName = `${item.name}_${fieldTypeCounters[item.type]}`;
      } else {
        fieldTypeCounters[item.type] = 1;
      }

      const newField = {
        type: item.type,
        label: item.label,
        name: newFieldName, // Use the new field name
        required: item.required,
        row: targetCell.row,
        column: targetCell.column,
      };

      setCurrentTemplateFields((prevFields) => [...prevFields, newField]);
      setHighlightedCell(null);
    }
  };


  const handleCopy = (onCopy, name) => {
    // Create a copy of the field with a new name (e.g., field1, field2)
    const newName = `${name}_copy${copiedFieldCounter}`;
    setCopiedFieldCounter(copiedFieldCounter + 1);

    onCopy(newName);
  };

  // Add a new function to find an empty cell
  const findEmptyCell = () => {
    // Find the first empty cell for dropping the field
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
        if (!currentTemplateFields.some((field) => field.row === rowIndex && field.column === columnIndex)) {
          return { row: rowIndex, column: columnIndex };
        }
      }
    }
    return null; // Return null if no empty cell is found
  };


  const calculateFieldPosition = () => {
    // Calculate the next available position in the fixed layout
    const row = Math.floor(fieldLayout.length / 3); // Each row has 3 columns
    const column = fieldLayout.length % 3; // Column index within the row

    return { row, column };
  };

  const addRow = () => {
    setRowCount((prevRowCount) => prevRowCount + 1);
  };

  const navigate = useNavigate();

  const [layout, setLayout] = useState([]);

  const handleFieldNameChange = (fieldName, newName) => {
    setCurrentTemplateFields((prevFields) =>
      prevFields.map((field) => (field.name === fieldName ? { ...field, name: newName } : field))
    );
  };

  const handleDeleteField = (name) => {
    setCurrentTemplateFields((prevFields) => prevFields.filter((field) => field.name !== name));
  };

  const handleSaveFieldPositions = () => {
    setCurrentTemplateFields((prevFields) =>
      prevFields.map((field) => {
        const layoutItem = layout.find((layoutItem) => layoutItem.i === field.name);
        if (layoutItem) {
          const row = Math.floor(layoutItem.y / 100); // Assuming each row height is 100
          const column = layoutItem.x;

          return {
            ...field,
            row,
            column,
            x: layoutItem.x,
            y: layoutItem.y,
          };
        }
        return field;
      })
    );
  };

  const arrangeCards = () => {
    setCurrentTemplateFields((prevFields) => {
      const arrangedFields = [];
      let x = 0;
      let y = 0;
      let yOffset = 0;

      prevFields.forEach((field, index) => {
        if (index % 2 === 0) {
          x = 0;
          y = yOffset;
          yOffset += 100; // Adjust for 100 units per row
        } else {
          x = 1; // Offset for alternating column
        }

        arrangedFields.push({
          ...field,
          x,
          y,
        });
      });

      return arrangedFields;
    });
  };

  const handleRequiredChange = (fieldName, newRequired) => {
    setCurrentTemplateFields((prevFields) =>
      prevFields.map((field) => (field.name === fieldName ? { ...field, required: newRequired } : field))
    );
  };

  useEffect(() => {
    // Load templates from the server when the component mounts
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/templates');
        if (response.ok) {
          const templatesData = await response.json();
          setTemplates(templatesData.templates);
        } else {
          console.error('Failed to load templates.');
        }
      } catch (error) {
        console.error('An error occurred while fetching templates:', error);
      }
    };

    fetchTemplates();
  }, []);



  const handleUpdateTemplate = async () => {
    // Calculate the number of rows based on your logic (rowCount)
    const rowCount = calculateRowCount(); // Call the calculateRowCount function

    // Call handleSaveFieldPositions to update field positions
    handleSaveFieldPositions();

    if (loadedTemplateName && loadedTemplate) {
      try {
        const updatedFields = currentTemplateFields.map((field) => ({
          type: field.type,
          label: field.label,
          name: field.name,
          required: field.required,
          row: field.row,
          column: field.column,
        }));

        const updatedTemplateData = {
          fields: updatedFields,
          areaWidth,
          areaHeight: requiredAreaHeight,
          rowCount: rowCount,
        };

        const response = await fetch(`/api/template/${loadedTemplateName}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedTemplateData),
        });

        if (response.ok) {
          setUpdateStatus('success');
        } else {
          setUpdateStatus('error');
        }
      } catch (error) {
        console.error('An error occurred while updating the template:', error);
        setUpdateStatus('error');
      }
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call handleSaveFieldPositions to update field positions
    handleSaveFieldPositions();

    const newTemplateName = prompt('Enter a new template name:');
    if (newTemplateName) {
      const newTemplate = {
        templateName: newTemplateName,
        fields: currentTemplateFields.map((field) => ({
          type: field.type,
          label: field.label,
          name: field.name,
          required: field.required,
          row: field.row,
          column: field.column,
        })),
        areaWidth: areaWidth,
        areaHeight: requiredAreaHeight,
        rowCount: rowCount,
      };

      try {
        const response = await fetch('/api/template', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTemplate),
        });

        if (response.ok) {
          // Reset the form fields after successful submission
          setCurrentTemplateFields([
            // ... (your initial fields here)
          ]);

          // Add the new template to the templates state
          setTemplates((prevTemplates) => [...prevTemplates, newTemplate]);

          // Navigate to HomePage2 after saving the template
          navigate('/homepage2');
        }

        else if (response.status === 400) {
          // Handle the case where the template name already exists
          const errorData = await response.json();
          setSaveErrorMessage(errorData.error);
        }
        else {
          // Handle error if the request was not successful
          console.error('Failed to save template. Please try again later.');
        }
      } catch (error) {
        console.error('An error occurred while saving the template:', error);
      }
    }
  };

  const handleLoadTemplate = async () => {
    try {
      const response = await fetch('/api/templates'); // Fetch all templates
      if (response.ok) {
        const templatesData = await response.json();
        if (templatesData.templates.length === 0) {
          alert('No templates found!');
          return;
        }

        const templateNames = templatesData.templates.map((template) => template.templateName);
        const selectedTemplateName = prompt(
          'Select a template from the list:\n\n' + templateNames.join('\n')
        );

        if (selectedTemplateName) {
          const selectedTemplate = templatesData.templates.find(
            (template) => template.templateName === selectedTemplateName
          );

          if (selectedTemplate) {
            setCurrentTemplateFields(selectedTemplate.fields);
            setAreaWidth(selectedTemplate.areaWidth);
            setAreaHeight(selectedTemplate.areaHeight);
            setLoadedTemplateName(selectedTemplateName); // Set the loaded template name in the state
            setLoadedTemplate(selectedTemplate); // Set the loaded template in the state
            setShowUpdateButton(true); // Show the update button
          } else {
            alert('Template not found!');
          }
        } else {
          alert('Template name not provided.');
        }
      } else {
        alert('Failed to fetch templates!');
      }
    } catch (error) {
      console.error('An error occurred while loading templates:', error);
    }
  };


  return (
    <DndProvider backend={HTML5Backend}>
      <div className="CreateFarmer">
        <div className="container mt-4">
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {/* Template Form */}
            <div style={{ flex: '1' }}>
              <h2>Template</h2>
              <form onSubmit={handleSubmit}>
                {/* Template Area */}

                <div
                  ref={(node) => drop(node)} // Attach the drop target to this element
                  className="border border-primary rounded p-3"
                  style={{
                    width: '100%',
                    backgroundColor: 'FFFFFF',
                    position: 'relative',
                  }}
                >
                  {[...Array(rowCount)].map((_, rowIndex) => (
                    <div key={rowIndex} className="row">
                      {[0, 1, 2].map((columnIndex) => {
                        // Calculate the index based on the row and column
                        const index = rowIndex * 3 + columnIndex;

                        // Find the field at this index if it exists
                        const field = currentTemplateFields.find(
                          (field) => field.row === rowIndex && field.column === columnIndex
                        );

                        return (
                          <div
                            key={columnIndex}
                            style={{
                              flex: '1',
                              position: 'relative',
                              minHeight: '150px',
                              padding: '10px',
                              border: '1px solid #ccc',
                              marginRight: '10px',
                              marginBottom: '10px',
                              backgroundColor:
                                highlightedCell && rowIndex === highlightedCell.row && columnIndex === highlightedCell.column
                                  ? 'lightblue'
                                  : '', // Highlight the cell if it matches the highlightedCell
                            }}
                            onClick={() => handleCellClick(rowIndex, columnIndex)} // Call handleCellClick when the cell is clicked
                          >
                            {field && (
                              <div key={field.name}>
                                <DraggableField
                                  type={field.type}
                                  label={field.name}
                                  name={field.name}
                                  required={field.required}
                                  onEdit={(newName) => handleFieldNameChange(field.name, newName)}
                                  onRequiredChange={(isRequired) => handleRequiredChange(field.name, isRequired)}
                                  onDelete={() => handleDeleteField(field.name)}
                                  onCopy={handleCopyField} // Pass the onCopy function here
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                <br />

                <div>
                  <button type="submit" className="btn btn-primary ml-2" onClick={arrangeCards}>
                    Save Template
                  </button>
                  <button type="button" className="btn btn-secondary ml-2" onClick={handleLoadTemplate}>
                    Load Template
                  </button>

                  {showUpdateButton && (
                    <button type="button" className="btn btn-success ml-2" onClick={handleUpdateTemplate}>
                      Update Template
                    </button>
                  )}
                </div>

                {/* Add Row Button */}
                <div style={{ marginTop: '20px' }}>
                  <button type="button" className="btn btn-primary" onClick={addRow}>
                    Add Row
                  </button>
                </div>

                {/* Display update status message */}
                {updateStatus === 'success' && (
                  <div className="text-success">Template updated successfully!</div>
                )}
                {updateStatus === 'error' && (
                  <div className="text-danger">Failed to update template. Please try again later.</div>
                )}
                <br />
                {saveErrorMessage && (
                  <div className="alert alert-danger">{saveErrorMessage}</div>
                )}

              </form>
            </div>
            <div className="VerticalBorder" style={{ width: '10px', backgroundColor: 'FFFFFF' }} />

            <AdditionalFields onFieldDrop={handleFieldDrop} />
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default FarmerTemplate;

