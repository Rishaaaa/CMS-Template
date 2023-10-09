

import React, { useState } from 'react';

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
                <div className="form-check">
                    {/* Add radio input fields with labels here */}
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

export default renderField;

