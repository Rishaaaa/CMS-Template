
import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate } from 'react-router-dom';
import 'react-resizable/css/styles.css';
import AdditionalFields from './AdditionalFields';
import Field from './Field';
import '../App.css';
import 'react-grid-layout/css/styles.css';
import { ResizableBox } from 'react-resizable';

import { Responsive, WidthProvider } from "react-grid-layout";
const ResponsiveGridLayout = WidthProvider(Responsive);

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
  const [rowCount, setRowCount] = useState(5);
  const [columnCount, setColumnCount] = useState(1);
  const [saveErrorMessage, setSaveErrorMessage] = useState('');
  const [showPreviewCard, setShowPreviewCard] = useState(false);
  const [previewCardPosition, setPreviewCardPosition] = useState({ x: 0, y: 0 });
  const [previewFieldValues, setPreviewFieldValues] = useState({});
  const [fieldTypeCounters, setFieldTypeCounters] = useState({});
  const [copiedFieldCounter, setCopiedFieldCounter] = useState(1);
  const [highlightedRow, setHighlightedRow] = useState(null);
  const [highlightedColumn, setHighlightedColumn] = useState(null);
  const [highlightedCell, setHighlightedCell] = useState(null); // Track the highlighted cell
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [themes, setThemes] = useState({});
  const [containerStyle, setContainerStyle] = useState({});
  const [menuBarStyle, setMenuBarStyle] = useState({});
  const [light, setLight] = useState({});
  const [shades, setShades] = useState({});
  const [previewFields, setPreviewFields] = useState([]);
  const [initialFieldWidths, setInitialFieldWidths] = useState({});

  const navigate = useNavigate();

  // Calculate the default grid layout based on the currentTemplateFields.
  const defaultLayout = currentTemplateFields.map((field, index) => ({
    i: field.name,
    x: field.column,
    y: field.row,
    w: 12, // Adjust based on the colSpan of the field
    h: 1, // Adjust based on the rowSpan of the field
    isResizable: true, // Allow resizing
  }));

  const [layout, setLayout] = useState([]);


  // Function to handle field resizing
  const handleFieldResize = (field, newColSpan, newRowSpan) => {
    setLayout((prevLayout) => {
      const updatedLayout = prevLayout.map((item) => {
        if (item.i === field.name) {
          return { ...item, w: newColSpan, h: newRowSpan };
        }
        return item;
      });
      return updatedLayout;
    });

    // Update the currentTemplateFields with the new colSpan and rowSpan
    setCurrentTemplateFields((prevFields) => {
      return prevFields.map((prevField) => {
        if (prevField.name === field.name) {
          return { ...prevField, colSpan: newColSpan, rowSpan: newRowSpan };
        }
        return prevField;
      });
    });
  };

  // Update the previewFields state whenever currentTemplateFields changes
  useEffect(() => {
    setPreviewFields(currentTemplateFields);
  }, [currentTemplateFields]);

  const handleFieldMove = (layout, field) => {
    // // Update the template layout
    setLayout(layout.map((item) => ({
      ...item,
      w: Math.max(item.w, 3),
    })));
    // setLayout(layout);

    // Update the currentTemplateFields with the new layout information
    const updatedFields = layout.map((item) => {
      const field = currentTemplateFields.find((f) => f.name === item.i);
      return {
        ...field,
        colSpan: item.w,
        rowSpan: item.h,
        row: item.y,
        column: item.x,
      };
    });
    setCurrentTemplateFields(updatedFields);

    // Update the preview area layout
    const updatedPreviewFields = layout.map((item) => {
      const field = previewFields.find((f) => f.name === item.i);
      return {
        ...field,
        colSpan: item.w,
        rowSpan: item.h,
        row: item.y,
        column: item.x,
      };
    });
    setPreviewFields(updatedPreviewFields);
  };

  const gridColumns = 12;

  // Calculate the width for each cell in the grid based on the available area width and the grid columns.
  const cellWidth = areaWidth / gridColumns;
  const cellHeight = areaHeight / rowCount;
  const previewCardStyle = {
    right: '0',
    top: '7%',
    width: '50%', // Adjust the width as needed
    height: '90%', // Make it cover the full height
    zIndex: '9999', // Ensure it's above other content
    flexDirection: 'column', // Center content vertically
    border: '10px solid ', // Add a 10px border
    borderColor: menuBarStyle.backgroundColor, // Use the 'light' color from the backend
    overflow: 'auto', // Add scrollbars if content overflows
    backgroundColor: light.backgroundColor, // Use the 'menuBar' color from the backend
  };

  const handlePreviewFieldChange = (fieldName, value) => {
    setPreviewFieldValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
  };

  const renderField = (field) => {
    const { name, type, required } = field;
    let isValid = true; // Assume the field is valid by default

    if (type === 'email') {
      const emailValue = previewFieldValues[field.name];
      if (emailValue && !/\S+@\S+\.\S+/.test(emailValue)) {
        isValid = false; // Email format is invalid
      }
    } else if (type === 'phone') {
      const phoneValue = previewFieldValues[field.name];
      if (phoneValue && !/^\d{10,12}$/.test(phoneValue)) {
        isValid = false; // Phone format is invalid
      }
    } else if (type === 'address') {
      // Address field with street, city, state, and zip code
      const zipValue = previewFieldValues[`${name}_zip`];
      if (zipValue && !/^[1-9][0-9]{2}\s?[0-9]{3}$/.test(zipValue)) {
        isValid = false; // Zip code format is invalid
      }
    }
    return (
      <div className="form-group">
        <label htmlFor={field.name}>{field.name} {field.required && <span className="text-danger">*</span>}</label>
        {field.type === 'text' && (
          <input
            type="text"
            name={field.name}
            className={`form-control ${isValid ? '' : 'is-invalid'}`}
            value={previewFieldValues[field.name] || ''}
            onChange={(e) => handlePreviewFieldChange(field.name, e.target.value)}
          />
        )}
        {field.type === 'checkbox' && (
          <div className={`form-control ${isValid ? '' : 'is-invalid'}`} onChange={(e) => handlePreviewFieldChange(field.name, e.target.value)} >
            <input type="checkbox" name={field.name} value="option1" className="form-check-input" />
            <label className="form-check-label">Option 1</label>
            <input type="checkbox" name={field.name} value="option2" className="form-check-input" />
            <label className="form-check-label">Option 2</label>
          </div>
        )}

        {field.type === 'radio' && (
          <div className={`form-control ${isValid ? '' : 'is-invalid'}`} onChange={(e) => handlePreviewFieldChange(field.name, e.target.value)} >
            <input type="radio" name={field.name} value="option1" className="form-check-input" />
            <label className="form-check-label">Option 1</label>
            <input type="radio" name={field.name} value="option2" className="form-check-input" />
            <label className="form-check-label">Option 2</label>
          </div>
        )}
        {field.type === 'select' && (
          <select
            name={field.name}
            className={`form-control ${isValid ? '' : 'is-invalid'}`}
            value={previewFieldValues[field.name] || ''}
            onChange={(e) => handlePreviewFieldChange(field.name, e.target.value)}
          >
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </select>
        )}
        {field.type === 'textarea' && (
          <textarea
            type="textarea"
            name={field.name}
            className={`form-control ${isValid ? '' : 'is-invalid'}`}
            value={previewFieldValues[field.name] || ''}
            onChange={(e) => handlePreviewFieldChange(field.name, e.target.value)}
          />
        )}
        {field.type === 'email' && (
          <input
            type="email"
            name={field.name}
            className={`form-control ${isValid ? '' : 'is-invalid'}`}
            value={previewFieldValues[field.name] || ''}
            onChange={(e) => handlePreviewFieldChange(field.name, e.target.value)}
          />
        )}
        {field.type === 'phone' && (
          <input
            type="tel"
            name={field.name}
            className={`form-control ${isValid ? '' : 'is-invalid'}`}
            value={previewFieldValues[field.name] || ''}
            onChange={(e) => handlePreviewFieldChange(field.name, e.target.value)}
          />
        )}
        {field.type === 'time' && (
          <input
            type="time"
            name={field.name}
            className={`form-control ${isValid ? '' : 'is-invalid'}`}
            value={previewFieldValues[field.name] || ''}
            onChange={(e) => handlePreviewFieldChange(field.name, e.target.value)}
          />
        )}
        {field.type === 'date' && (
          <input
            type="date"
            name={field.name}
            className={`form-control ${isValid ? '' : 'is-invalid'}`}
            value={previewFieldValues[field.name] || ''}
            onChange={(e) => handlePreviewFieldChange(field.name, e.target.value)}
          />
        )}
        {field.type === 'address' && (
          <div>
            <input
              type="text"
              name={`address_street`}
              className={`form-control ${isValid ? '' : 'is-invalid'}`}
              placeholder="Street"
              value={previewFieldValues['address_street'] || ''}
              onChange={(e) => handlePreviewFieldChange('address_street', e.target.value)}
            />
            <br />
            <input
              type="text"
              name={`address_city`}
              className={`form-control ${isValid ? '' : 'is-invalid'}`}
              placeholder="City"
              value={previewFieldValues['address_city'] || ''}
              onChange={(e) => handlePreviewFieldChange('address_city', e.target.value)}
            />
            <br />
            <input
              type="text"
              name={`address_state`}
              className={`form-control ${isValid ? '' : 'is-invalid'}`}
              placeholder="State"
              value={previewFieldValues['address_state'] || ''}
              onChange={(e) => handlePreviewFieldChange('address_state', e.target.value)}
            />
            <br />
            <input
              type="text"
              name={`address_zip`}
              className={`form-control ${isValid ? '' : 'is-invalid'}`}
              placeholder="Zip Code"
              value={previewFieldValues['address_zip'] || ''}
              onChange={(e) => handlePreviewFieldChange('address_zip', e.target.value)}
            />
          </div>
        )}
      </div>
    );
  };

  const handlePreviewButtonClick = () => {
    // Show the preview card and position it in the middle of the page
    setShowPreviewCard(true);
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const cardWidth = windowWidth * 0.25; // 25% of the window width
    const cardHeight = windowHeight * 0.5; // 50% of the window height
    const cardX = (windowWidth - cardWidth) / 2;
    const cardY = (windowHeight - cardHeight) / 2;
    setPreviewCardPosition({ x: cardX, y: cardY });
  };

  const handleClosePreviewCard = () => {
    // Close the preview card
    setShowPreviewCard(false);
  };

  // Update the previewFields state whenever currentTemplateFields changes
  useEffect(() => {
    setPreviewFields(currentTemplateFields);
  }, [currentTemplateFields]);

  const themeOptions = Object.keys(themes);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState); // Toggle dropdown visibility
  };

  useEffect(() => {
    // Fetch the themes from the backend
    fetch('/api/themes')
      .then((response) => response.json())
      .then((data) => {
        const { themes } = data;
        setThemes(themes);

        // Set the initial selected theme color
        if (themes[selectedTheme]) {
          applyThemeColors(themes[selectedTheme]);
        }
      })
      .catch((error) => {
        console.error('Error fetching themes:', error);
      });
  }, [selectedTheme]); // Trigger when selectedTheme changes


  const applyThemeColors = (theme) => {
    // Apply the selected theme color and shades to various components
    const containerStyle = {
      backgroundColor: theme.containerColor,
      color: '#000000', // Change text color as needed
    };

    const menuBarStyle = {
      backgroundColor: theme.menuBarColor,
      color: '#000000', // Change text color as needed
    };

    const shades = {
      backgroundColor: theme.shades,
      color: '#000000', // Change text color as needed
    };

    const light = {
      backgroundColor: theme.light,
      color: '#000000', // Change text color as needed
    };

    setContainerStyle(containerStyle);
    setMenuBarStyle(menuBarStyle);
    setLight(light);
    setShades(shades);
  };


  const handleThemeChange = (themeName, themeData) => {
    // Send a request to set/update the theme on the backend
    fetch(`/api/theme/${themeName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ themeData }),
    })
      .then(() => {
        setSelectedTheme(themeName); // Update the selectedTheme state on success

        // Apply the theme colors to components
        applyThemeColors(themeData);
      })
      .catch((error) => {
        console.error('Error setting theme:', error);
      });
  };

  const requiredAreaHeight = Math.ceil(currentTemplateFields.length / 2) * 100; // Calculate the required height based on rows and divide by 2 columns


  const [{ isDragging }, previewRef, preview] = useDrag({
    type: 'PREVIEW_CARD',
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleCellClick = (row, column) => {
    // Set the highlighted cell when a cell is clicked
    setHighlightedCell({ row, column });
  };
  const handleSxSClick = () => {
    setRowCount(2);
    setColumnCount(2);
  };

  const DraggableField = ({ type, label, name, required, onEdit, onRequiredChange, onDelete, onCopy, row, column, isDragging, cellWidth,
    cellHeight, }) => {
    const [, ref] = useDrag({
      type: 'FIELD',
      item: { name, type, label, required },
    });

    const handleFieldDrop = (item) => {
      const targetCell = highlightedCell || findEmptyCell();

      if (!targetCell) {
        return;
      }

      let currentRow = targetCell.row;
      let currentColumn = targetCell.column;

      const fieldExistsInTargetCell = currentTemplateFields.some(
        (field) => field.row === currentRow && field.column === currentColumn
      );

      // Find an empty cell in the current row
      while (fieldExistsInTargetCell && currentColumn < columnCount) {
        currentColumn++;
        fieldExistsInTargetCell = currentTemplateFields.some(
          (field) => field.row === currentRow && field.column === currentColumn
        );
      }

      if (currentColumn >= columnCount) {
        // Move to the next row if the current row can't accommodate more fields
        currentRow++;
        currentColumn = 0;

        // Find an empty cell in the next row
        while (fieldExistsInTargetCell && currentColumn < columnCount) {
          currentColumn++;
          fieldExistsInTargetCell = currentTemplateFields.some(
            (field) => field.row === currentRow && field.column === currentColumn
          );
        }
      }

      if (currentRow < rowCount && currentColumn < columnCount) {
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
          row: currentRow,
          column: currentColumn,
        };

        // Store the initial width when the field is initially dropped
        setInitialFieldWidths((prevWidths) => ({
          ...prevWidths,
          [newField.name]: 3, // Set the initial width to 4
        }));

        setCurrentTemplateFields((prevFields) => [...prevFields, newField]);

        // Update the layout state with the new field's layout information
        setLayout((prevLayout) => [
          ...prevLayout,
          {
            i: newField.name,
            x: newField.column,
            y: newField.row,
            w: 1, // Set the default width to 4
            h: 1, // Set the default height
            isResizable: true, // Allow resizing
          },
        ]);

        setHighlightedCell(null);
      }
    };



    // Add a new function to find an empty cell
    const findEmptyCell = () => {
      // Find the first empty cell for dropping the field
      for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
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
        const newColumn = Math.floor((highlightedColumn * columnCount) / areaWidth);

        handleFieldDrop(item, newRow, newColumn);
      },
    });
    const handleCopy = () => {
      // Create a copy of the field with a new name (e.g., field1, field2)
      const newName = `${name}_copy${copiedFieldCounter}`;
      setCopiedFieldCounter(copiedFieldCounter + 1);

      onCopy(newName);
    };


    return (
      <div
        ref={(node) => {
          ref(node);
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
            backgroundColor: highlightedRow === null ? '' : light.backgroundColor,
            borderColor: highlightedColumn === null ? '' : shades.backgroundColor,
          }}
        >
          <Field
            type={type}
            label={label}
            name={name}
            required={required}
            onEdit={onEdit}
            onRequiredChange={onRequiredChange}
            onDelete={onDelete}
            onCopy={onCopy}
          />

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

  // Add a new function to find an empty cell
  const findEmptyCell = () => {
    // Find the first empty cell for dropping the field
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
        if (!currentTemplateFields.some((field) => field.row === rowIndex && field.column === columnIndex)) {
          return { row: rowIndex, column: columnIndex };
        }
      }
    }
    return null; // Return null if no empty cell is found
  };

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
    try {
      const updatedFields = currentTemplateFields.map((field) => ({
        type: field.type,
        label: field.label,
        name: field.name,
        required: field.required,
        row: field.row,
        column: field.column,
        colSpan: field.colSpan, // Include colSpan
        rowSpan: field.rowSpan, // Include rowSpan
        columnCount: gridColumns, // Include columnCount
      }));

      const updatedTemplateData = {
        fields: updatedFields,
      };

      const response = await fetch(`/api/template/${loadedTemplateName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTemplateData),
      });

      if (response.ok) {
        setSuccessMessage('Template updated successfully!');
      } else {
        setErrorMessage('Failed to update template. Please try again later.');
      }
    } catch (error) {
      console.error('An error occurred while updating the template:', error);
      setErrorMessage('An error occurred while updating the template.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    handleSaveFieldPositions();

    const dataToValidate = {
      fields: fieldData,
      previewFieldValues,
      // Add other data needed for validation if necessary
    };

    try {
      const validationResponse = await fetch('/api/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToValidate),
      });

      if (validationResponse.ok) {
        setErrorMessage('');
        setSuccessMessage('Validation success');

        // Validation successful, proceed to save the data
        const newTemplateName = prompt('Enter a new template name:');
        if (newTemplateName) {
          // Create an object to hold the form data, including previewFieldValues
          const newTemplate = {
            templateName: newTemplateName,
            fields: currentTemplateFields.map((field) => ({
              type: field.type,
              label: field.label,
              name: field.name,
              required: field.required,
              row: field.row,
              column: field.column,
              colSpan: field.colSpan, // Include colSpan
              rowSpan: field.rowSpan, // Include rowSpan
              columnCount: field.columnCount, // Include columnCount
            })),
            areaWidth,
            areaHeight: requiredAreaHeight,
            rowCount,
            previewFieldValues,
          };

          console.log(newTemplate);

          // Assuming you have a save API endpoint, e.g., '/api/template'
          try {
            const saveResponse = await fetch('/api/template', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(newTemplate),
            });

            if (saveResponse.ok) {
              // Reset the form fields after successful submission
              setCurrentTemplateFields([]);
              setPreviewFieldValues({}); // Clear preview field values

              // Add the new template to the templates state
              setTemplates((prevTemplates) => [...prevTemplates, newTemplate]);

              // Navigate to HomePage2 after saving the template
              navigate('/homepage2');
              setSuccessMessage('Template saved successfully!');
              setErrorMessage('');
            } else {
              const errorData = await saveResponse.json();
              setErrorMessage(errorData.error);
              setSuccessMessage('');
            }
          } catch (error) {
            console.error('An error occurred while saving the template:', error);
            setErrorMessage('An error occurred while saving the template.');
            setSuccessMessage('');
          }
        }
      } else {
        const validationErrorData = await validationResponse.json();
        console.error('Validation failed:');
        validationErrorData.errors.forEach((error) => {
          console.error(`Field: ${error.field}, Error: ${error.error}`);
        });
        const detailedErrorMessage = validationErrorData.errors
          .map((error) => `Field: ${error.field}, Error: ${error.error}`)
          .join('\n');

        setErrorMessage(detailedErrorMessage);
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('An error occurred while validating the data:', error);
      setErrorMessage('An error occurred while validating the data.');
      setSuccessMessage('');
    }
  };
  const MessageDisplay = () => {
    return (
      <div className="message-display">
        {errorMessage && <div className="error-message text-danger">{errorMessage}</div>}
        {successMessage && <div className="success-message text-success">{successMessage}</div>}
      </div>
    );
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
            setPreviewFields(selectedTemplate.fields); // Update previewFields with loaded data
            setAreaWidth(selectedTemplate.areaWidth);
            setAreaHeight(selectedTemplate.areaHeight);
            setLoadedTemplateName(selectedTemplateName);
            setLoadedTemplate(selectedTemplate);
            setShowUpdateButton(true);
            setRowCount(selectedTemplate.rowCount);
            setColumnCount(selectedTemplate.columnCount);

            // Update the layout based on the loaded template data
            const initialLayout = selectedTemplate.fields.map((field) => ({
              i: field.name,
              x: field.column,
              y: field.row,
              w: field.colSpan,
              h: field.rowSpan,
              isResizable: true,
            }));
            setLayout(initialLayout);

            // Set colSpan and rowSpan properties for each field
            setCurrentTemplateFields((prevFields) =>
              prevFields.map((field) => ({
                ...field,
                colSpan: selectedTemplate.fields.find((f) => f.name === field.name)?.colSpan || 1,
                rowSpan: selectedTemplate.fields.find((f) => f.name === field.name)?.rowSpan || 1,
              }))
            );
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
  const handleFieldDrop = (item) => {
    const targetCell = highlightedCell || findEmptyCell();

    if (!targetCell) {
      return;
    }

    let currentRow = targetCell.row;
    let currentColumn = targetCell.column;

    const fieldExistsInTargetCell = currentTemplateFields.some(
      (field) => field.row === currentRow && field.column === currentColumn
    );

    // Find an empty cell in the current row
    while (fieldExistsInTargetCell && currentColumn < columnCount) {
      currentColumn++;
      fieldExistsInTargetCell = currentTemplateFields.some(
        (field) => field.row === currentRow && field.column === currentColumn
      );
    }

    if (currentColumn >= columnCount) {
      // Move to the next row if the current row can't accommodate more fields
      currentRow++;
      currentColumn = 0;

      // Find an empty cell in the next row
      while (fieldExistsInTargetCell && currentColumn < columnCount) {
        currentColumn++;
        fieldExistsInTargetCell = currentTemplateFields.some(
          (field) => field.row === currentRow && field.column === currentColumn
        );
      }
    }

    if (currentRow < rowCount && currentColumn < columnCount) {
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
        row: currentRow,
        column: currentColumn,
      };

      // Store the initial width when the field is initially dropped
      setInitialFieldWidths((prevWidths) => ({
        ...prevWidths,
        [newField.name]: 4, // Set the initial width to 4
      }));

      setCurrentTemplateFields((prevFields) => [...prevFields, newField]);

      // Update the layout state with the new field's layout information
      setLayout((prevLayout) => [
        ...prevLayout,
        {
          i: newField.name,
          x: newField.column,
          y: newField.row,
          w: 1, // Set the default width to 4
          h: 1, // Set the default height
          isResizable: true, // Allow resizing
        },
      ]);

      setHighlightedCell(null);
    }
  };


  const fieldData = currentTemplateFields.map((field) => ({
    name: field.name,
    type: field.type,
    label: field.label,
    required: field.required,
    row: field.row,
    column: field.column,
    colSpan: field.colSpan,
    rowSpan: field.rowSpan,
    layout: layout.find((item) => item.i === field.name), // Get the layout data for the field
    columnCount: gridColumns, // Include the column count in the data
  }));
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="MenuBar d-flex justify-content-end" style={menuBarStyle}>
        <div className="MenuBar d-flex justify-content-end mt-2 mb-2">
          <button className="btn btn-light MenuOption mx-2">Configuration</button>
          <button onClick={handlePreviewButtonClick} className="btn btn-light MenuOption mx-2">Preview</button>

          <div className="btn-group" style={{ position: 'relative', zIndex: '10000' }}>
            <button
              type="button"
              className="btn btn-light dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded={isDropdownOpen}
              onClick={toggleDropdown}
            >
              Themes
            </button>
            <ul
              className={`dropdown-menu${isDropdownOpen ? ' show' : ''}`}
              style={{ position: 'absolute', top: '100%', left: '0', zIndex: '10001' }}
            >
              {themeOptions.map((themeName) => (
                <li key={themeName}>
                  <button
                    className={`dropdown-item ${themes[themeName] ? themes[themeName].containerColor : ''}`}
                    onClick={() => {
                      handleThemeChange(themeName, themes[themeName]);
                      toggleDropdown();
                    }}
                  >
                    {themeName}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="CreateFarmer" style={light}>
        {/* <div className="CreateFarmer"> */}
        <div className={showPreviewCard ? 'col-md-6' : 'col-md-12'}>
          <div className="container">
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              {/* Template Form */}
              <div style={{ flex: '1' }}>
                <h2>Template</h2>

                <form onSubmit={handleSubmit}>
                  {/* Template Area */}
                  <div
                    ref={(node) => drop(node)}
                    className="border border-primary rounded p-3"
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: light.backgroundColor,
                      position: 'relative',
                    }}
                  >
                    <ResponsiveGridLayout
                      className="layout"
                      layouts={{ lg: layout }}
                      breakpoints={{ lg: 1200 }}
                      cols={{ lg: gridColumns }}
                      rowHeight={cellHeight}
                      onLayoutChange={(layout, layouts) => handleFieldMove(layout, currentTemplateFields)}
                    >
                      {previewFields.map((field) => {
                        return (
                          <div key={field.name}>
                            <DraggableField
                              type={field.type}
                              label={field.name}
                              name={field.name}
                              required={field.required}
                              onEdit={(newName) =>
                                handleFieldNameChange(field.name, newName)
                              }
                              onRequiredChange={(isRequired) =>
                                handleRequiredChange(field.name, isRequired)
                              }
                              onDelete={() => handleDeleteField(field.name)}
                              onCopy={handleCopyField}
                              cellWidth={cellWidth}
                              cellHeight={cellHeight}
                            />
                          </div>
                        );
                      })}
                    </ResponsiveGridLayout>
                  </div>
                  <br />
                  <div className="row-count-buttons">
                    <button type="button" className="btn btn-primary btn-md ml-2" onClick={handleSxSClick}>
                      SxS
                    </button>
                  </div>
                  <div>
                    <button type="button" className="btn btn-secondary ml-2" onClick={handleLoadTemplate}>
                      Load Template
                    </button>
                    {showUpdateButton && (
                      <button type="button" className="btn btn-success ml-2" onClick={handleUpdateTemplate}>
                        Update Template
                      </button>
                    )}
                    <MessageDisplay />
                  </div>
                </form>
              </div>
              <div className="VerticalBorder" style={{ width: '10px', backgroundColor: light.backgroundColor }} />
              <AdditionalFields onFieldDrop={handleFieldDrop} />
            </div>
          </div>
        </div>
      </div>
      <div style={previewCardStyle}>
        {showPreviewCard && (
          <div
            ref={previewRef}
            className={`preview-card ${isDragging ? 'dragging' : ''} position-fixed`}
            style={previewCardStyle}
          >
            <button className="btn btn-danger btn-md mx-2" onClick={handleClosePreviewCard}>
              Close
            </button>
            <br />
            <br />
            <div>
              <ResponsiveGridLayout
                className="layout"
                layouts={{ lg: layout }}
                breakpoints={{ lg: 1200 }}
                cols={{ lg: gridColumns }}
                rowHeight={cellHeight}
                onLayoutChange={(layout, layouts) => handleFieldMove(layout, previewFields)}
              >
                {previewFields.map((field) => {
                  return (
                    <div key={field.name}>
                      {renderField(field)}
                    </div>
                  );
                })}
              </ResponsiveGridLayout>
            </div>
            <br />
            <hr></hr>
            <button className="btn btn-success btn-md mx-2" onClick={handleSubmit}>
              Save
            </button>
            <MessageDisplay />
          </div>
        )}
      </div>
    </DndProvider >
  );
};
export default FarmerTemplate;

