// validationService.js

// Email validation function
function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
}

// Phone validation function
function validatePhone(phone) {
    return /^\d{10,12}$/.test(phone);
}

// Address validation function
function validateAddress(zipCode) {
    return /^[1-9][0-9]{2}\s?[0-9]{3}$/.test(zipCode);
}

module.exports = {
    validateEmail,
    validatePhone,
    validateAddress,
};