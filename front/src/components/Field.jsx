

// import React, { useState, useEffect } from 'react';
// import FieldTypes from './FieldTypes';
// import { useDrag } from 'react-dnd';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import PlacesAutocomplete, {
//     geocodeByAddress,
//     getLatLng,
// } from 'react-places-autocomplete';
// import '../App.css';

// // Store deletedFields outside of the component
// const deletedFieldsMap = {};

// const Field = ({ type, label, name, required, onEdit, onRequiredChange, onDelete }) => {

//     const [deletedFields, setDeletedFields] = useState(deletedFieldsMap[name] || []);

//     const handleDeleteAddressField = (fieldId) => {
//         // Mark the field as deleted in the deletedFieldsMap
//         deletedFieldsMap[name] = [...deletedFields, fieldId];
//         setDeletedFields(deletedFieldsMap[name]);
//     };


//     const [, drag] = useDrag(() => ({
//         type,
//         item: { label, name, type, required },
//     }));

//     const [addressDetails, setAddressDetails] = useState({
//         state: '',
//         pincode: '',
//         area: '',
//         district: '',
//     });

//     const handleSuggestSelect = async (address) => {
//         try {
//             const results = await geocodeByAddress(address);
//             const latLng = await getLatLng(results[0]);
//             console.log('Success', latLng);

//             // Extract address details if needed
//             const addressComponents = results[0].address_components;
//             let state = '';
//             let pincode = '';
//             let area = '';
//             let district = '';

//             for (let i = 0; i < addressComponents.length; i++) {
//                 const component = addressComponents[i];
//                 if (component.types.includes('administrative_area_level_1')) {
//                     state = component.long_name;
//                 } else if (component.types.includes('postal_code')) {
//                     pincode = component.long_name;
//                 } else if (component.types.includes('locality')) {
//                     area = component.long_name;
//                 } else if (component.types.includes('administrative_area_level_2')) {
//                     district = component.long_name;
//                 }
//             }

//             setAddressDetails({
//                 state,
//                 pincode,
//                 area,
//                 district,
//             });
//         } catch (error) {
//             console.error('Error', error);
//         }
//     };

//     const [fieldWidth, setFieldWidth] = useState('100%'); // Updated to '100%'
//     const [fieldHeight, setFieldHeight] = useState('100%'); // Updated to '100%'
//     const [dateValue, setDateValue] = useState(null);
//     const [timeValue, setTimeValue] = useState(null);
//     const [isEditing, setIsEditing] = useState(false);
//     const [newName, setNewName] = useState(name);
//     const [showOptions, setShowOptions] = useState(false);
//     const [address, setAddress] = useState('');
//     const [addressFields, setAddressFields] = useState([
//         { id: 'street', label: 'Street' },
//         { id: 'city', label: 'City' },
//         { id: 'state', label: 'State' },
//         { id: 'pincode', label: 'Pincode' },
//     ]);

//     const handleNameClick = () => {
//         setIsEditing(true);
//     };

//     const handleBlur = () => {
//         setIsEditing(false);
//         if (newName.trim() !== '') {
//             onEdit(newName);
//         }
//         // Validation for email and phone fields
//         if (type === FieldTypes.EMAIL && newName.trim() !== '') {
//             if (!isValidEmail(newName)) {
//                 alert('Please enter a valid email address.');
//                 setNewName('');
//             }
//         }

//         if (type === FieldTypes.PHONE && newName.trim() !== '') {
//             if (!isValidPhoneNumber(newName)) {
//                 alert('Please enter a valid phone number.');
//                 setNewName('');
//             }
//         }
//     };

//     const isValidEmail = (email) => {
//         const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
//         return emailRegex.test(email);
//     };

//     const isValidPhoneNumber = (phoneNumber) => {
//         const phoneRegex = /^\d{10,12}$/;
//         return phoneRegex.test(phoneNumber);
//     };

//     const handleRequiredChange = (event) => {
//         const newRequired = event.target.value === 'true';
//         onRequiredChange(newRequired);
//     };

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             const fieldElement = document.getElementById(`field_${name}`);
//             if (fieldElement && !fieldElement.contains(event.target)) {
//                 setShowOptions(false);
//             }
//         };

//         document.addEventListener('click', handleClickOutside);

//         return () => {
//             document.removeEventListener('click', handleClickOutside);
//         };
//     }, [name]);

//     const handleFieldClick = (event) => {
//         event.stopPropagation();
//         setShowOptions(true);
//     };

//     const handleTimeChange = (time) => {
//         setTimeValue(time);
//     };

//     let inputField = null;

//     switch (type) {
//         case FieldTypes.TEXT:
//             inputField = (
//                 <input
//                     type="text"
//                     placeholder="Enter text"
//                     style={{ width: '100%', boxSizing: 'border-box' }}
//                 />
//             );
//             break;
//         case FieldTypes.TEXTAREA:
//             inputField = (
//                 <textarea
//                     placeholder="Enter text area"
//                     style={{ width: '100%', boxSizing: 'border-box' }}
//                 ></textarea>
//             );
//             break;
//         case FieldTypes.RADIO:
//             inputField = (
//                 <div>
//                     <input
//                         type="radio"
//                         id={`${name}_option1`}
//                         name={name}
//                         value="option1"
//                     />
//                     <label htmlFor={`${name}_option1`}>Option 1</label>
//                     <input
//                         type="radio"
//                         id={`${name}_option2`}
//                         name={name}
//                         value="option2"
//                     />
//                     <label htmlFor={`${name}_option2`}>Option 2</label>
//                 </div>
//             );
//             break;
//         case FieldTypes.CHECKBOX:
//             inputField = (
//                 <div>
//                     <input
//                         type="checkbox"
//                         id={`${name}_option1`}
//                         name={name}
//                         value="option1"
//                     />
//                     <label htmlFor={`${name}_option1`}>Option 1</label>
//                     <input
//                         type="checkbox"
//                         id={`${name}_option2`}
//                         name={name}
//                         value="option2"
//                     />
//                     <label htmlFor={`${name}_option2`}>Option 2</label>
//                 </div>
//             );
//             break;
//         case FieldTypes.EMAIL:
//             inputField = (
//                 <div>
//                     <input
//                         type="email"
//                         placeholder="Enter email"
//                         style={{ width: '100%', boxSizing: 'border-box' }}
//                     />
//                 </div>
//             );
//             break;
//         case FieldTypes.PHONE:
//             inputField = (
//                 <div>
//                     <input
//                         type="tel"
//                         placeholder="Enter phone number"
//                         style={{ width: '100%', boxSizing: 'border-box' }}
//                     />
//                 </div>
//             );
//             break;
//         case FieldTypes.DATE:
//             inputField = (
//                 <div>
//                     <DatePicker
//                         selected={dateValue}
//                         onChange={(date) => setDateValue(date)}
//                         dateFormat="yyyy-MM-dd"
//                         className="style-input"
//                     />

//                 </div>
//             );
//             break;
//         case FieldTypes.TIME:
//             inputField = (
//                 <DatePicker
//                     selected={timeValue}
//                     onChange={handleTimeChange}
//                     showTimeSelect
//                     showTimeSelectOnly
//                     timeIntervals={60}
//                     dateFormat="h:mm aa"
//                     className="style-input"
//                 />
//             );
//             break;
//         case FieldTypes.ADDRESS:
//             inputField = (
//                 <div>
//                     <PlacesAutocomplete
//                         value={address}
//                         onChange={(value) => setAddress(value)}
//                         onSelect={handleSuggestSelect}
//                     >
//                         {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
//                             <div>
//                                 <input
//                                     {...getInputProps({
//                                         placeholder: 'Search Places ...',
//                                         className: 'location-search-input style-input',
//                                     })}
//                                 />
//                                 <div className="autocomplete-dropdown-container">
//                                     {loading && <div>Loading...</div>}
//                                     {suggestions.map((suggestion, index) => {
//                                         const className = suggestion.active
//                                             ? 'suggestion-item--active'
//                                             : 'suggestion-item';
//                                         // inline style for demonstration purpose
//                                         const style = suggestion.active
//                                             ? { backgroundColor: '#fafafa', cursor: 'pointer' }
//                                             : { backgroundColor: '#ffffff', cursor: 'pointer' };
//                                         return (
//                                             <div
//                                                 {...getSuggestionItemProps(suggestion, {
//                                                     className,
//                                                     style,
//                                                 })}
//                                                 key={index}
//                                             >
//                                                 <span>{suggestion.description}</span>
//                                             </div>
//                                         );
//                                     })}
//                                 </div>
//                             </div>
//                         )}
//                     </PlacesAutocomplete>
//                     <br />
//                     {addressFields
//                         .filter((field) => !deletedFields.includes(field.id))
//                         .map((field) => (
//                             <div key={field.id}>
//                                 <input
//                                     name={`${name}_${field.id}`}
//                                     placeholder={field.label}
//                                     type="text"
//                                     autoComplete={`address-${field.id}`}
//                                     className="style-input"
//                                 />
//                                 <button onClick={() => handleDeleteAddressField(field.id)}>Delete</button>
//                             </div>
//                         ))}

//                 </div>
//             );
//             break;
//         default:
//             inputField = null;
//     }

//     return (
//         <div
//             ref={drag}
//             style={{
//                 cursor: 'grab',
//                 padding: '10px',
//                 backgroundColor: '#f0f0f0',
//                 color: '#333',
//                 margin: '5px',
//                 borderRadius: '4px',
//                 width: fieldWidth, // Updated
//                 height: fieldHeight, // Updated
//             }}
//             id={`field_${name}`}
//             onClick={handleFieldClick}
//         >
//             {isEditing ? (
//                 <input
//                     type="text"
//                     value={newName}
//                     onChange={(e) => setNewName(e.target.value)}
//                     onBlur={handleBlur}
//                     autoFocus
//                     style={{ width: '100%', boxSizing: 'border-box' }}
//                     placeholder={label}
//                 />
//             ) : (
//                 <div onClick={handleNameClick}>
//                     {label} {required && <span style={{ color: 'red' }}> *</span>}
//                 </div>
//             )}

//             {inputField}

//             {showOptions && (
//                 <div>
//                     <input
//                         type="radio"
//                         name={`required_${name}`}
//                         value="true"
//                         checked={required}
//                         onChange={handleRequiredChange}
//                     />{' '}
//                     <label style={{ fontWeight: required ? 'bold' : 'normal' }} onClick={() => onRequiredChange(true)}>
//                         Required
//                     </label>
//                     <input
//                         type="radio"
//                         name={`required_${name}`}
//                         value="false"
//                         checked={!required}
//                         onChange={handleRequiredChange}
//                     />{' '}
//                     <label style={{ fontWeight: !required ? 'bold' : 'normal' }} onClick={() => onRequiredChange(false)}>
//                         Not Required
//                     </label>
//                 </div>
//             )}
//             <button
//                 type="button"
//                 className="btn btn-danger btn-sm"
//                 style={{
//                     position: 'absolute', // Position the button absolutely within the field
//                     top: '5px', // Adjust the top position to place it in the top right corner
//                     right: '5px', // Adjust the right position to place it in the top right corner
//                 }}
//                 onClick={() => onDelete(name)}
//             >
//                 Delete
//             </button>
//         </div>
//     );
// };

// export default Field;



import React, { useState, useEffect } from 'react';
import FieldTypes from './FieldTypes';
import { useDrag } from 'react-dnd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import '../App.css';

// Store deletedFields outside of the component
const deletedFieldsMap = {};

const Field = ({ type, label, name, required, onEdit, onRequiredChange, onDelete }) => {

    const [deletedFields, setDeletedFields] = useState(deletedFieldsMap[name] || []);

    const handleDeleteAddressField = (fieldId) => {
        // Mark the field as deleted in the deletedFieldsMap
        deletedFieldsMap[name] = [...deletedFields, fieldId];
        setDeletedFields(deletedFieldsMap[name]);
    };


    const [, drag] = useDrag(() => ({
        type,
        item: { label, name, type, required },
    }));

    const [addressDetails, setAddressDetails] = useState({
        state: '',
        pincode: '',
        area: '',
        district: '',
    });

    const handleSuggestSelect = async (address) => {
        try {
            const results = await geocodeByAddress(address);
            const latLng = await getLatLng(results[0]);
            console.log('Success', latLng);

            // Extract address details if needed
            const addressComponents = results[0].address_components;
            let state = '';
            let pincode = '';
            let area = '';
            let district = '';

            for (let i = 0; i < addressComponents.length; i++) {
                const component = addressComponents[i];
                if (component.types.includes('administrative_area_level_1')) {
                    state = component.long_name;
                } else if (component.types.includes('postal_code')) {
                    pincode = component.long_name;
                } else if (component.types.includes('locality')) {
                    area = component.long_name;
                } else if (component.types.includes('administrative_area_level_2')) {
                    district = component.long_name;
                }
            }

            setAddressDetails({
                state,
                pincode,
                area,
                district,
            });
        } catch (error) {
            console.error('Error', error);
        }
    };

    const [fieldWidth, setFieldWidth] = useState('100%'); // Updated to '100%'
    const [fieldHeight, setFieldHeight] = useState('100%'); // Updated to '100%'
    const [dateValue, setDateValue] = useState(null);
    const [timeValue, setTimeValue] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(name);
    const [showOptions, setShowOptions] = useState(false);
    const [address, setAddress] = useState('');
    const [addressFields, setAddressFields] = useState([
        { id: 'street', label: 'Street' },
        { id: 'city', label: 'City' },
        { id: 'state', label: 'State' },
        { id: 'pincode', label: 'Pincode' },
    ]);

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

    const handleTimeChange = (time) => {
        setTimeValue(time);
    };

    let inputField = null;

    switch (type) {
        case FieldTypes.TEXT:
            inputField = (
                <input
                    type="text"
                    placeholder="Enter text"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                />
            );
            break;
        case FieldTypes.TEXTAREA:
            inputField = (
                <textarea
                    placeholder="Enter text area"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                ></textarea>
            );
            break;
        case FieldTypes.RADIO:
            inputField = (
                <div>
                    <input
                        type="radio"
                        id={`${name}_option1`}
                        name={name}
                        value="option1"
                    />
                    <label htmlFor={`${name}_option1`}>Option 1</label>
                    <input
                        type="radio"
                        id={`${name}_option2`}
                        name={name}
                        value="option2"
                    />
                    <label htmlFor={`${name}_option2`}>Option 2</label>
                </div>
            );
            break;
        case FieldTypes.CHECKBOX:
            inputField = (
                <div>
                    <input
                        type="checkbox"
                        id={`${name}_option1`}
                        name={name}
                        value="option1"
                    />
                    <label htmlFor={`${name}_option1`}>Option 1</label>
                    <input
                        type="checkbox"
                        id={`${name}_option2`}
                        name={name}
                        value="option2"
                    />
                    <label htmlFor={`${name}_option2`}>Option 2</label>
                </div>
            );
            break;
        case FieldTypes.EMAIL:
            inputField = (
                <div>
                    <input
                        type="email"
                        placeholder="Enter email"
                        style={{ width: '100%', boxSizing: 'border-box' }}
                    />
                </div>
            );
            break;
        case FieldTypes.PHONE:
            inputField = (
                <div>
                    <input
                        type="tel"
                        placeholder="Enter phone number"
                        style={{ width: '100%', boxSizing: 'border-box' }}
                    />
                </div>
            );
            break;
        case FieldTypes.DATE:
            inputField = (
                <div>
                    <DatePicker
                        selected={dateValue}
                        onChange={(date) => setDateValue(date)}
                        dateFormat="yyyy-MM-dd"
                        className="style-input"
                    />

                </div>
            );
            break;
        case FieldTypes.TIME:
            inputField = (
                <DatePicker
                    selected={timeValue}
                    onChange={handleTimeChange}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={60}
                    dateFormat="h:mm aa"
                    className="style-input"
                />
            );
            break;
        case FieldTypes.ADDRESS:
            inputField = (
                <div>
                    <PlacesAutocomplete
                        value={address}
                        onChange={(value) => setAddress(value)}
                        onSelect={handleSuggestSelect}
                    >
                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                            <div>
                                <input
                                    {...getInputProps({
                                        placeholder: 'Search Places ...',
                                        className: 'location-search-input style-input',
                                    })}
                                />
                                <div className="autocomplete-dropdown-container">
                                    {loading && <div>Loading...</div>}
                                    {suggestions.map((suggestion, index) => {
                                        const className = suggestion.active
                                            ? 'suggestion-item--active'
                                            : 'suggestion-item';
                                        // inline style for demonstration purpose
                                        const style = suggestion.active
                                            ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                            : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                        return (
                                            <div
                                                {...getSuggestionItemProps(suggestion, {
                                                    className,
                                                    style,
                                                })}
                                                key={index}
                                            >
                                                <span>{suggestion.description}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </PlacesAutocomplete>
                    <br />
                    {addressFields
                        .filter((field) => !deletedFields.includes(field.id))
                        .map((field) => (
                            <div key={field.id}>
                                <input
                                    name={`${name}_${field.id}`}
                                    placeholder={field.label}
                                    type="text"
                                    autoComplete={`address-${field.id}`}
                                    className="style-input"
                                />
                                <button onClick={() => handleDeleteAddressField(field.id)}>Delete</button>
                            </div>
                        ))}

                </div>
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
                width: fieldWidth, // Updated
                height: fieldHeight, // Updated
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
                </div>
            )}
            <button
                type="button"
                className="btn btn-danger btn-sm"
                style={{
                    position: 'absolute', // Position the button absolutely within the field
                    top: '5px', // Adjust the top position to place it in the top right corner
                    right: '5px', // Adjust the right position to place it in the top right corner
                }}
                onClick={() => onDelete(name)}
            >
                Delete
            </button>
        </div>
    );
};

export default Field;









