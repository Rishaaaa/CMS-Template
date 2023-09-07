
import React, { useState, useEffect } from 'react';
import FieldTypes from './FieldTypes';
import { useDrag } from 'react-dnd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Field = ({ type, label, name, required, onEdit, onRequiredChange }) => {
    const [, drag] = useDrag(() => ({
        type,
        item: { label, name, type, required },
    }));

    const [fieldWidth, setFieldWidth] = useState(200);
    const [dateValue, setDateValue] = useState(null);
    const [timeValue, setTimeValue] = useState(null); // Change this line
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(name);
    const [showOptions, setShowOptions] = useState(false);

    const handleNameClick = () => {
        setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (newName.trim() !== '') {
            onEdit(newName);
        }
        // Validation for email and phone fields
        if (type === FieldTypes.EMAIL && newName.trim() !== '') {
            if (!isValidEmail(newName)) {
                alert('Please enter a valid email address.');
                setNewName('');
            }
        }

        if (type === FieldTypes.PHONE && newName.trim() !== '') {
            if (!isValidPhoneNumber(newName)) {
                alert('Please enter a valid phone number.');
                setNewName('');
            }
        }
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email);
    };

    const isValidPhoneNumber = (phoneNumber) => {
        const phoneRegex = /^\d{10,12}$/;
        return phoneRegex.test(phoneNumber);
    };

    const handleRequiredChange = (event) => {
        const newRequired = event.target.value === 'true';
        onRequiredChange(newRequired);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            const fieldElement = document.getElementById(`field_${name}`);
            if (fieldElement && !fieldElement.contains(event.target)) {
                setShowOptions(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [name]);

    const handleFieldClick = (event) => {
        event.stopPropagation();
        setShowOptions(true);
    };

    // Handle the time change
    const handleTimeChange = (time) => {
        setTimeValue(time);
    };

    // Render different input types based on 'type'
    let inputField = null;

    switch (type) {
        case FieldTypes.TEXT:
            inputField = (
                <input type="text" placeholder="Enter text" style={{ width: '100%', boxSizing: 'border-box' }} />
            );
            break;
        case FieldTypes.TEXTAREA:
            inputField = (
                <textarea placeholder="Enter text area" style={{ width: '100%', boxSizing: 'border-box' }}></textarea>
            );
            break;
        case FieldTypes.RADIO:
            inputField = (
                <div>
                    <input type="radio" id={`${name}_option1`} name={name} value="option1" />
                    <label htmlFor={`${name}_option1`}>Option 1</label>
                    <input type="radio" id={`${name}_option2`} name={name} value="option2" />
                    <label htmlFor={`${name}_option2`}>Option 2</label>
                </div>
            );
            break;
        case FieldTypes.CHECKBOX:
            inputField = (
                <div>
                    <input type="checkbox" id={`${name}_option1`} name={name} value="option1" />
                    <label htmlFor={`${name}_option1`}>Option 1</label>
                    <input type="checkbox" id={`${name}_option2`} name={name} value="option2" />
                    <label htmlFor={`${name}_option2`}>Option 2</label>
                </div>
            );
            break;
        case FieldTypes.EMAIL:
            inputField = (
                <div>
                    <input type="email" placeholder="Enter email" style={{ width: '100%', boxSizing: 'border-box' }} />
                </div>
            );
            break;
        case FieldTypes.PHONE:
            inputField = (
                <div>
                    <input type="tel" placeholder="Enter phone number" style={{ width: '100%', boxSizing: 'border-box' }} />
                </div>
            );
            break;
        case FieldTypes.DATE:
            inputField = (
                <DatePicker
                    selected={dateValue}
                    onChange={(date) => setDateValue(date)}
                    dateFormat="yyyy-MM-dd"
                />
            );
            break;
        case FieldTypes.TIME:
            inputField = (
                <DatePicker
                    selected={timeValue} // Use timeValue instead of dateValue
                    onChange={handleTimeChange} // Use handleTimeChange instead
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={60}
                    dateFormat="h:mm aa"
                />
            );
            break;

        default:
            inputField = null;
    }

    return (
        <div
            ref={drag}
            style={{
                cursor: 'grab',
                padding: '10px',
                backgroundColor: '#f0f0f0',
                color: '#333',
                margin: '5px',
                borderRadius: '4px',
                width: `${fieldWidth}px`,
            }}
            id={`field_${name}`}
            onClick={handleFieldClick}
        >
            {isEditing ? (
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onBlur={handleBlur}
                    autoFocus
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    placeholder={label}
                />
            ) : (
                <div onClick={handleNameClick}>
                    {label} {required && <span style={{ color: 'red' }}> *</span>}
                </div>
            )}

            {inputField}

            {showOptions && (
                <div>
                    <input
                        type="radio"
                        name={`required_${name}`}
                        value="true"
                        checked={required}
                        onChange={handleRequiredChange}
                    />{' '}
                    <label style={{ fontWeight: required ? 'bold' : 'normal' }} onClick={() => onRequiredChange(true)}>
                        Required
                    </label>
                    <input
                        type="radio"
                        name={`required_${name}`}
                        value="false"
                        checked={!required}
                        onChange={handleRequiredChange}
                    />{' '}
                    <label style={{ fontWeight: !required ? 'bold' : 'normal' }} onClick={() => onRequiredChange(false)}>
                        Not Required
                    </label>

                    <label htmlFor={`width_${name}`}>Width:</label>
                    <input
                        type="number"
                        id={`width_${name}`}
                        value={fieldWidth}
                        onChange={(e) => setFieldWidth(parseInt(e.target.value, 10))}
                    />
                </div>
            )}
        </div>
    );
};

export default Field;
