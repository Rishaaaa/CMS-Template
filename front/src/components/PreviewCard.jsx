

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDrag, useDrop } from 'react-dnd';
import 'react-resizable/css/styles.css';
import Field from './Field';
import '../App.css';

const PreviewCard = () => {
    const [templates, setTemplates] = useState([]);
    const [currentTemplateFields, setCurrentTemplateFields] = useState([]);
    const [fieldLayout, setFieldLayout] = useState([]);
    const [loadedTemplate, setLoadedTemplate] = useState(null);
    const [areaWidth, setAreaWidth] = useState(800);
    const [areaHeight, setAreaHeight] = useState(400);
    const [loadedTemplateName, setLoadedTemplateName] = useState(null);
    const [showUpdateButton, setShowUpdateButton] = useState(false);
    const [rowCount, setRowCount] = useState(1);
    const [columnCount, setColumnCount] = useState(3);
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
                    <div className="form-check">
                        <input
                            type="checkbox"
                            name={field.name}
                            className={`form-control ${isValid ? '' : 'is-invalid'}`}
                            checked={previewFieldValues[field.name] || false}
                            onChange={(e) => handlePreviewFieldChange(field.name, e.target.checked)}
                        />
                        <label className="form-check-label">{field.label}</label>
                    </div>
                )}
                {field.type === 'radio' && (
                    <div className={`form-control ${isValid ? '' : 'is-invalid'}`}>
                        <input type="radio" name={name} value="option1" className="form-check-input" />
                        <label className="form-check-label">Option 1</label>
                        <input type="radio" name={name} value="option2" className="form-check-input" />
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

    const [previewPosition, setPreviewPosition] = useState({
        x: 0,
        y: 0,
    });
    const requiredAreaHeight = Math.ceil(currentTemplateFields.length / 2) * 100; // Calculate the required height based on rows and divide by 2 columns

    const [{ isDragging }, previewRef, preview] = useDrag({
        type: 'PREVIEW_CARD',
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const handleClosePreviewCard = () => {
        setShowPreviewCard(false);
    };


    const handleCellClick = (row, column) => {
        // Set the highlighted cell when a cell is clicked
        setHighlightedCell({ row, column });
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

    useEffect(() => {
        const initialFieldLayout = currentTemplateFields.map((field) => ({
            i: field.name,
            x: field.column,
            y: field.row,
            w: 6,
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

    const navigate = useNavigate();

    const [layout, setLayout] = useState([]);

    const handleFieldNameChange = (fieldName, newName) => {
        setCurrentTemplateFields((prevFields) =>
            prevFields.map((field) => (field.name === fieldName ? { ...field, name: newName } : field))
        );
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


    const handleSubmit = async (e) => {
        e.preventDefault();

        handleSaveFieldPositions();

        const dataToValidate = {
            fields: currentTemplateFields,
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
                        })),
                        areaWidth,
                        areaHeight: requiredAreaHeight,
                        rowCount,
                        columnCount,
                        previewData: previewFieldValues, // Include the preview data
                    };

                    // Assuming you have a save API endpoint, e.g., '/api/save'
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
                            setSaveErrorMessage(errorData.error);
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
                        setAreaWidth(selectedTemplate.areaWidth);
                        setAreaHeight(selectedTemplate.areaHeight);
                        setLoadedTemplateName(selectedTemplateName); // Set the loaded template name in the state
                        setLoadedTemplate(selectedTemplate); // Set the loaded template in the state
                        setShowUpdateButton(true); // Show the update button

                        // Set the rowCount and columnCount based on the loaded template
                        setRowCount(selectedTemplate.rowCount);
                        setColumnCount(selectedTemplate.columnCount);
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

    const renderFieldsInRowsAndColumns = (fields, rowCount, columnCount) => {
        const containerStyle = {
            maxHeight: '100%', // Set a fixed maximum height for the container
            overflowY: 'auto', // Add vertical scroll when needed

        };

        const rows = [];

        for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
            const rowFields = [];

            for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
                const field = fields.find(
                    (field) => field.row === rowIndex && field.column === columnIndex
                );

                rowFields.push(
                    <div
                        key={`field-${rowIndex}-${columnIndex}`}
                        style={{
                            flex: '1',
                            position: 'relative',
                            minHeight: '150px',
                            padding: '10px',
                            border: '1px solid transparent',
                            marginRight: '10px',
                            marginBottom: '10px',
                        }}
                        onClick={() => handleCellClick(rowIndex, columnIndex)}
                    >
                        {field && (
                            <div key={field.name}>
                                {renderField(field)}
                            </div>
                        )}
                    </div>
                );
            }
            rows.push(
                <div key={`row-${rowIndex}`} className="row">
                    {rowFields}
                </div>
            );
        }

        return (
            <div style={containerStyle}> {/* Add containerStyle to enable scrolling */}
                <div style={{ border: '1px solid #ccc', }}>
                    <div style={{ border: '20px solid transparent', }}>
                        {rows}
                    </div>
                </div>
                <br />
                <button className="btn btn-success btn-md mx-2" onClick={handleSubmit}>Submit</button>
                <br />
                <MessageDisplay />
                <br />
            </div>
        );
    };

    return (
        <div>
            {showPreviewCard && (
                <div
                    ref={previewRef}
                    className={`preview-card ${isDragging ? 'dragging' : ''}`}
                    style={{
                        left: previewPosition.x,
                        top: previewPosition.y,
                        flexDirection: 'column', // Center content vertically
                        border: '50px solid #ccc', // Add a 10px border
                        borderColor: 'white',
                    }}
                >
                    <button className="btn btn-danger btn-md mx-2" onClick={handleClosePreviewCard}>Close</button>
                    <br />
                    <br />
                    {currentTemplateFields.length > 0 && renderFieldsInRowsAndColumns(currentTemplateFields, rowCount, columnCount)}
                </div>
            )}
        </div>
    );
};

export default PreviewCard;
