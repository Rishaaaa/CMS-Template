

import FieldTypes from './FieldTypes';
import React from 'react';
import { useDrag } from 'react-dnd';

const AdditionalFields = ({ onFieldDrop }) => {
    const additionalFields = [
        { type: FieldTypes.TEXT, label: 'Text Box', name: 'textbox1', required: false },
        { type: FieldTypes.RADIO, label: 'Radio Button', name: 'radio1', required: false },
        { type: FieldTypes.CHECKBOX, label: 'Check Box', name: 'checkbox1', required: false },
        { type: FieldTypes.TEXTAREA, label: 'Text Area', name: 'textarea1', required: false },
        { type: FieldTypes.EMAIL, label: 'Email', name: 'email', required: false },
        { type: FieldTypes.PHONE, label: 'Phone Number', name: 'phone', required: false },
        { type: FieldTypes.TWO_FIELD_COLUMN, label: 'Two Field', name: 'twofield', required: false },
        { type: FieldTypes.THREE_FIELD_COLUMN, label: 'Three Field', name: 'threefield', required: false },
        { type: FieldTypes.DATE, label: 'Date', name: 'date', required: false },
        { type: FieldTypes.TIME, label: 'Time', name: 'time', required: false },
    ];

    return (
        <div>
            <h3>Additional Fields</h3>
            <div
                className="border border-primary rounded p-3"
                style={{
                    width: '100%', // 100% of the total container width for the additional field column
                    backgroundColor: 'EFEFEF',
                }}
            >
                {additionalFields.map((field) => (
                    <AdditionalFieldButton key={field.name} field={field} onFieldDrop={onFieldDrop} />
                ))}
            </div>
        </div>
    );
};

// Define a new component for draggable buttons
const AdditionalFieldButton = ({ field, onFieldDrop }) => {
    const [, drag] = useDrag(() => ({
        type: field.type,
        item: field,
    }));

    return (
        <div
            ref={drag}
            style={{
                cursor: 'pointer',
                border: '1px solid #ccc',
                backgroundColor: 'white',
                padding: '5px 10px',
                marginBottom: '5px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '40px',
                textAlign: 'center',
                color: 'darkblue',
                fontWeight: 'bold',
            }}
            onClick={() => onFieldDrop(field)} // Insert the field on button click
        >
            <span>{field.label}</span>
        </div>
    );
};

export default AdditionalFields;


