// // const express = require('express');
// // const mongoose = require('mongoose');
// // const cors = require('cors');
// // const bodyParser = require('body-parser');
// // const app = express();

// // // Middleware
// // app.use(cors());
// // app.use(bodyParser.json());

// // // Replace the old MongoDB URI with your new URI
// // const mongoURI = "mongodb+srv://risha:risha@risha.binbimy.mongodb.net/mern?retryWrites=true&w=majority";

// // // Connect to MongoDB using the new URI
// // mongoose.connect(mongoURI, {
// //     useNewUrlParser: true,
// //     useUnifiedTopology: true,
// // });

// // const db = mongoose.connection;
// // db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// // db.once('open', () => {
// //     console.log('Connected to MongoDB');
// // });

// // // Define Mongoose Models (Create a Template Schema)
// // const templateSchema = new mongoose.Schema({
// //     templateName: {
// //         type: String,
// //         unique: true,
// //     },
// //     fields: [{
// //         label: { type: String, required: true },
// //         name: { type: String, required: true },
// //         type: { type: String, required: true },
// //         required: { type: Boolean, required: true },
// //         row: { type: Number, required: true }, // Add row information
// //         column: { type: Number, required: true }, // Add column information
// //         bounds: {
// //             type: {
// //                 top: { type: Number, required: true },
// //                 left: { type: Number, required: true },
// //                 right: { type: Number, required: true },
// //                 bottom: { type: Number, required: true },
// //             },
// //         },
// //         width: { type: Number, default: 200 },
// //         height: { type: Number, default: 100 },
// //         shape: { type: String, default: 'rectangle' },
// //         color: { type: String, default: '#f0f0f0' },
// //         textColor: { type: String, default: '#333' },
// //         fontSize: { type: Number, default: 14 },

// //     }],
// //     areaWidth: Number,
// //     areaHeight: Number,
// //     rowCount: Number,
// //     columnCount: Number,
// // });

// // const Template = mongoose.model('Template', templateSchema);


// // // Create Routes
// // app.get('/api/templates', async(req, res) => { // Update the route to match the client
// //     try {
// //         const templates = await Template.find();
// //         res.json({ templates });
// //     } catch (error) {
// //         res.status(500).json({ error: 'Internal server error' });
// //     }
// // });


// // // Add routes for creating and updating templates
// // app.post('/api/template', async(req, res) => {
// //     try {
// //         const { templateName, fields, areaWidth, areaHeight, rowCount, columnCount } = req.body;
// //         const newTemplate = new Template({
// //             templateName,
// //             fields,
// //             areaWidth,
// //             areaHeight,
// //             rowCount,
// //             columnCount, // Save columnCount from the request
// //         });

// //         // Save the new template to the database
// //         await newTemplate.save();

// //         res.status(201).json({ message: 'Template created successfully' });
// //     } catch (error) {
// //         res.status(500).json({ error: 'Internal server error' });
// //     }
// // });


// // app.post('/api/validate', (req, res) => {
// //     try {
// //         const dataToValidate = req.body;
// //         console.log(dataToValidate);
// //         // Validate the data here
// //         const validationErrors = validateData(dataToValidate);

// //         if (validationErrors.length === 0) {
// //             // Data is valid
// //             res.status(200).json({ success: true });
// //         } else {
// //             // Data is invalid, return validation errors as JSON
// //             res.status(400).json({ success: false, errors: validationErrors });
// //         }
// //     } catch (error) {
// //         console.error('An error occurred during validation:', error);
// //         // Handle unexpected errors gracefully and return a JSON response
// //         res.status(500).json({ success: false, error: 'An unexpected error occurred during validation.' });
// //     }
// // });

// // // Validation function (you can customize this according to your requirements)
// // function validateData(data) {
// //     const { fields, previewFieldValues } = data;
// //     const errors = [];

// //     fields.forEach((field) => {
// //         const { name, required, type } = field;
// //         const value = previewFieldValues[name];

// //         if (required && (!value || value.trim() === '')) {
// //             errors.push({ field: name, error: 'Field is required.' });
// //         }

// //         if (type === 'email' && value && !isValidEmail(value)) {
// //             errors.push({ field: name, error: 'Invalid email format.' });
// //         }

// //         if (type === 'phone' && value && !isValidPhone(value)) {
// //             errors.push({ field: name, error: 'Invalid phone format.' });
// //         }

// //         if (type === 'address' && value) {
// //             if (!isValidAddress(value)) {
// //                 errors.push({ field: name, error: 'Invalid address format.' });
// //             }
// //         }
// //     });

// //     return errors;
// // }

// // function isValidEmail(email) {
// //     if (!/\S+@\S+\.\S+/.test(email)) {
// //         return false;
// //     }
// //     return true;
// // }

// // function isValidPhone(phone) {
// //     if (!/^\d{10,12}$/.test(phone)) {
// //         return false;
// //     }
// //     return true;
// // }

// // function isValidAddress(address) {
// //     if (!address || typeof address !== 'object') {
// //         return false;
// //     }

// //     const { street, city, state, zip } = address;

// //     if (!street || !city || !state || !zip || !/^[1-9][0-9]{2}\s?[0-9]{3}$/.test(zip)) {
// //         return false;
// //     }

// //     return true;
// // }


// // app.put('/api/template/:templateName', async(req, res) => {
// //     try {
// //         const { templateName } = req.params;
// //         const { fields, areaWidth, areaHeight, rowCount, columnCount } = req.body;

// //         // Find and update the existing template by name
// //         await Template.findOneAndUpdate({ templateName }, {
// //             fields,
// //             areaWidth,
// //             areaHeight,
// //             rowCount,
// //             columnCount, // Update columnCount
// //         });

// //         res.status(200).json({ message: 'Template updated successfully' });
// //     } catch (error) {
// //         res.status(500).json({ error: 'Internal server error' });
// //     }
// // });


// // app.delete('/api/template/:templateId', async(req, res) => {
// //     try {
// //         const templateId = req.params.templateId;
// //         // Use findByIdAndDelete to remove the template by its ID
// //         const deletedTemplate = await Template.findByIdAndDelete(templateId);
// //         if (deletedTemplate) {
// //             res.json({ message: 'Template deleted successfully' });
// //         } else {
// //             res.status(404).json({ error: 'Template not found' });
// //         }
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ error: 'Internal server error' });
// //     }
// // });


// // app.get('/api/template/:templateId', async(req, res) => {
// //     try {
// //         const templateId = req.params.templateId;
// //         const template = await Template.findById(templateId);

// //         if (!template) {
// //             return res.status(404).json({ error: 'Template not found' });
// //         }

// //         res.json(template);
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ error: 'Internal server error' });
// //     }
// // });

// // // Start the server
// // const port = process.env.PORT || 8082;
// // app.listen(port, () => {
// //     console.log(`Server is running on port ${port}`);
// // });


// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const app = express();

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // Replace the old MongoDB URI with your new URI
// const mongoURI = "mongodb+srv://risha:risha@risha.binbimy.mongodb.net/mern?retryWrites=true&w=majority";

// // Connect to MongoDB using the new URI
// mongoose.connect(mongoURI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//     console.log('Connected to MongoDB');
// });

// // Define Mongoose Models (Create a Template Schema)
// const templateSchema = new mongoose.Schema({
//     templateName: {
//         type: String,
//         unique: true,
//     },
//     fields: [{
//         label: { type: String, required: true },
//         name: { type: String, required: true },
//         type: { type: String, required: true },
//         required: { type: Boolean, required: true },
//         row: { type: Number, required: true }, // Add row information
//         column: { type: Number, required: true }, // Add column information
//         bounds: {
//             type: {
//                 top: { type: Number, required: true },
//                 left: { type: Number, required: true },
//                 right: { type: Number, required: true },
//                 bottom: { type: Number, required: true },
//             },
//         },
//         width: { type: Number, default: 200 },
//         height: { type: Number, default: 100 },
//         shape: { type: String, default: 'rectangle' },
//         color: { type: String, default: '#f0f0f0' },
//         textColor: { type: String, default: '#333' },
//         fontSize: { type: Number, default: 14 },

//     }],
//     areaWidth: Number,
//     areaHeight: Number,
//     rowCount: Number,
//     columnCount: Number,
// });

// const Template = mongoose.model('Template', templateSchema);


// // Create Routes
// app.get('/api/templates', async(req, res) => { // Update the route to match the client
//     try {
//         const templates = await Template.find();
//         res.json({ templates });
//     } catch (error) {
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });


// // Add routes for creating and updating templates
// app.post('/api/template', async(req, res) => {
//     try {
//         const { templateName, fields, areaWidth, areaHeight, rowCount, columnCount } = req.body;
//         const newTemplate = new Template({
//             templateName,
//             fields,
//             areaWidth,
//             areaHeight,
//             rowCount,
//             columnCount, // Save columnCount from the request
//         });

//         // Save the new template to the database
//         await newTemplate.save();

//         res.status(201).json({ message: 'Template created successfully' });
//     } catch (error) {
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });


// app.post('/api/validate', (req, res) => {
//     try {
//         const dataToValidate = req.body;
//         console.log(dataToValidate);
//         // Validate the data here
//         const validationErrors = validateData(dataToValidate);

//         if (validationErrors.length === 0) {
//             // Data is valid
//             res.status(200).json({ success: true });
//         } else {
//             // Data is invalid, return validation errors as JSON
//             res.status(400).json({ success: false, errors: validationErrors });
//         }
//     } catch (error) {
//         console.error('An error occurred during validation:', error);
//         // Handle unexpected errors gracefully and return a JSON response
//         res.status(500).json({ success: false, error: 'An unexpected error occurred during validation.' });
//     }
// });

// // Validation function (you can customize this according to your requirements)
// function validateData(data) {
//     const { fields, previewFieldValues } = data;
//     const errors = [];

//     fields.forEach((field) => {
//         const { name, required, type } = field;
//         const value = previewFieldValues[name];

//         if (required && (!value || value.trim() === '')) {
//             errors.push({ field: name, error: 'Field is required.' });
//         }

//         if (type === 'email' && value && !isValidEmail(value)) {
//             errors.push({ field: name, error: 'Invalid email format.' });
//         }

//         if (type === 'phone' && value && !isValidPhone(value)) {
//             errors.push({ field: name, error: 'Invalid phone format.' });
//         }

//         if (type === 'address' && value) {
//             if (!isValidAddress(value)) {
//                 errors.push({ field: name, error: 'Invalid address format.' });
//             }
//         }
//     });

//     return errors;
// }

// function isValidEmail(email) {
//     if (!/\S+@\S+\.\S+/.test(email)) {
//         return false;
//     }
//     return true;
// }

// function isValidPhone(phone) {
//     if (!/^\d{10,12}$/.test(phone)) {
//         return false;
//     }
//     return true;
// }

// function isValidAddress(address) {
//     if (!address || typeof address !== 'object') {
//         return false;
//     }

//     const { street, city, state, zip } = address;

//     if (!street || !city || !state || !zip || !/^[1-9][0-9]{2}\s?[0-9]{3}$/.test(zip)) {
//         return false;
//     }

//     return true;
// }


// app.put('/api/template/:templateName', async(req, res) => {
//     try {
//         const { templateName } = req.params;
//         const { fields, areaWidth, areaHeight, rowCount, columnCount } = req.body;

//         // Find and update the existing template by name
//         await Template.findOneAndUpdate({ templateName }, {
//             fields,
//             areaWidth,
//             areaHeight,
//             rowCount,
//             columnCount, // Update columnCount
//         });

//         res.status(200).json({ message: 'Template updated successfully' });
//     } catch (error) {
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });


// app.delete('/api/template/:templateId', async(req, res) => {
//     try {
//         const templateId = req.params.templateId;
//         // Use findByIdAndDelete to remove the template by its ID
//         const deletedTemplate = await Template.findByIdAndDelete(templateId);
//         if (deletedTemplate) {
//             res.json({ message: 'Template deleted successfully' });
//         } else {
//             res.status(404).json({ error: 'Template not found' });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });


// app.get('/api/template/:templateId', async(req, res) => {
//     try {
//         const templateId = req.params.templateId;
//         const template = await Template.findById(templateId);

//         if (!template) {
//             return res.status(404).json({ error: 'Template not found' });
//         }

//         res.json(template);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Initialize with some default themes
// let themes = {
//     default: {
//         containerColor: '#DDE5E9',
//         menuBarColor: '#EBEBF0',
//         shade: '#F2F2F5',
//         light: '#FAFAFC',
//     },
//     green: {
//         containerColor: '#035B2D',
//         menuBarColor: '#017A3E',
//         shade: '#049649',
//         light: '#D4FFE5',
//     },
//     yellow: {
//         containerColor: '#E8C843',
//         menuBarColor: '#FDD941',
//         shade: '#FFEB97',
//         light: '#FFF4D4',
//     },
//     Orange: {
//         containerColor: '#E5891A',
//         menuBarColor: '#F89C1C',
//         shade: '#F9B25D',
//         light: '#FFEBD7',
//     },
//     Red: {
//         containerColor: '#CE1D2A',
//         menuBarColor: '#E11F26',
//         shade: '#FC3254',
//         light: '#FFD7E2',
//     },
//     Brown: {
//         containerColor: '#7C331D',
//         menuBarColor: '#954121',
//         shade: '#BA4E2D',
//         light: '#FFDDD7',
//     },
//     Blue: {
//         containerColor: '#2B3071',
//         menuBarColor: '#2F4398',
//         shade: '#4455A4',
//         light: '#D7E0FF',
//     },
//     Black: {
//         containerColor: '#0A0A0A',
//         menuBarColor: '#21201F',
//         shade: '#4C4C4B',
//         light: '#999999',
//     },
// };

// // Define a route to get the available themes
// app.get('/api/themes', (req, res) => {
//     res.json({ themes });
// });

// // Define a route to set/update a theme
// app.post('/api/theme', (req, res) => {
//     const { themeName, themeData } = req.body;
//     themes[themeName] = themeData;
//     res.sendStatus(200);
// });

// // Define a route to delete a theme
// app.delete('/api/theme/:themeName', (req, res) => {
//     const { themeName } = req.params;
//     if (themes[themeName]) {
//         delete themes[themeName];
//         res.sendStatus(200);
//     } else {
//         res.status(404).json({ error: 'Theme not found' });
//     }
// });


// // Start the server
// const port = process.env.PORT || 8082;
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });



const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Replace the old MongoDB URI with your new URI
const mongoURI = "mongodb+srv://risha:risha@risha.binbimy.mongodb.net/mern?retryWrites=true&w=majority";

// Connect to MongoDB using the new URI
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define Mongoose Models (Create a Template Schema)
const templateSchema = new mongoose.Schema({
    templateName: {
        type: String,
        unique: true,
    },
    fields: [{
        label: { type: String, required: true },
        name: { type: String, required: true },
        type: { type: String, required: true },
        required: { type: Boolean, required: true },
        row: { type: Number, required: true }, // Add row information
        column: { type: Number, required: true },
        colSpan: { type: Number, required: true },
        rowSpan: { type: Number, required: true },
        columnCount: { type: Number },
        bounds: {
            type: {
                top: { type: Number, required: true },
                left: { type: Number, required: true },
                right: { type: Number, required: true },
                bottom: { type: Number, required: true },
            },
        },
        width: { type: Number, default: 200 },
        height: { type: Number, default: 100 },
        shape: { type: String, default: 'rectangle' },
        color: { type: String, default: '#f0f0f0' },
        textColor: { type: String, default: '#333' },
        fontSize: { type: Number, default: 14 },

    }],
    areaWidth: Number,
    areaHeight: Number,
    rowCount: Number,
});

const Template = mongoose.model('Template', templateSchema);


// Create Routes
app.get('/api/templates', async(req, res) => { // Update the route to match the client
    try {
        const templates = await Template.find();
        res.json({ templates });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Add routes for creating and updating templates
app.post('/api/template', async(req, res) => {
    try {
        const { templateName, fields, areaWidth, areaHeight, rowCount, columnCount } = req.body;
        const newTemplate = new Template({
            templateName,
            fields,
            areaWidth,
            areaHeight,
            rowCount,
        });

        // Save the new template to the database
        await newTemplate.save();

        res.status(201).json({ message: 'Template created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/api/validate', (req, res) => {
    try {
        const dataToValidate = req.body;
        console.log(dataToValidate);
        // Validate the data here
        const validationErrors = validateData(dataToValidate);

        if (validationErrors.length === 0) {
            // Data is valid
            res.status(200).json({ success: true });
        } else {
            // Data is invalid, return validation errors as JSON
            res.status(400).json({ success: false, errors: validationErrors });
        }
    } catch (error) {
        console.error('An error occurred during validation:', error);
        // Handle unexpected errors gracefully and return a JSON response
        res.status(500).json({ success: false, error: 'An unexpected error occurred during validation.' });
    }
});

// Validation function (you can customize this according to your requirements)
function validateData(data) {
    const { fields, previewFieldValues } = data;
    const errors = [];

    fields.forEach((field) => {
        const { name, required, type } = field;
        const value = previewFieldValues[name];

        if (required && (!value || value.trim() === '')) {
            errors.push({ field: name, error: 'Field is required.' });
        }

        if (type === 'email' && value && !isValidEmail(value)) {
            errors.push({ field: name, error: 'Invalid email format.' });
        }

        if (type === 'phone' && value && !isValidPhone(value)) {
            errors.push({ field: name, error: 'Invalid phone format.' });
        }

        if (type === 'address' && value) {
            if (!isValidAddress(value)) {
                errors.push({ field: name, error: 'Invalid address format.' });
            }
        }
    });

    return errors;
}

function isValidEmail(email) {
    if (!/\S+@\S+\.\S+/.test(email)) {
        return false;
    }
    return true;
}

function isValidPhone(phone) {
    if (!/^\d{10,12}$/.test(phone)) {
        return false;
    }
    return true;
}

function isValidAddress(address) {
    if (!address || typeof address !== 'object') {
        return false;
    }

    const { street, city, state, zip } = address;

    if (!street || !city || !state || !zip || !/^[1-9][0-9]{2}\s?[0-9]{3}$/.test(zip)) {
        return false;
    }

    return true;
}

app.put('/api/template/:templateName', async(req, res) => {
    try {
        const { templateName } = req.params;
        const { fields, areaWidth, areaHeight, rowCount, columnCount } = req.body;

        // Find and update the existing template by name
        await Template.findOneAndUpdate({ templateName }, {
            fields,
            areaWidth,
            areaHeight,
            rowCount,
            columnCount, // Update columnCount
        });

        res.status(200).json({ message: 'Template updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.delete('/api/template/:templateId', async(req, res) => {
    try {
        const templateId = req.params.templateId;
        // Use findByIdAndDelete to remove the template by its ID
        const deletedTemplate = await Template.findByIdAndDelete(templateId);
        if (deletedTemplate) {
            res.json({ message: 'Template deleted successfully' });
        } else {
            res.status(404).json({ error: 'Template not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/api/template/:templateId', async(req, res) => {
    try {
        const templateId = req.params.templateId;
        const template = await Template.findById(templateId);
        console.log(template);
        if (!template) {
            return res.status(404).json({ error: 'Template not found' });
        }

        res.json(template);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Initialize with some default themes
let themes = {
    default: {
        containerColor: '#DDE5E9',
        menuBarColor: '#EBEBF0',
        shade: '#F2F2F5',
        light: '#FAFAFC',
    },
    green: {
        containerColor: '#035B2D',
        menuBarColor: '#017A3E',
        shade: '#049649',
        light: '#D4FFE5',
    },
    yellow: {
        containerColor: '#E8C843',
        menuBarColor: '#FDD941',
        shade: '#FFEB97',
        light: '#FFF4D4',
    },
    Orange: {
        containerColor: '#E5891A',
        menuBarColor: '#F89C1C',
        shade: '#F9B25D',
        light: '#FFEBD7',
    },
    Red: {
        containerColor: '#CE1D2A',
        menuBarColor: '#E11F26',
        shade: '#FC3254',
        light: '#FFD7E2',
    },
    Brown: {
        containerColor: '#7C331D',
        menuBarColor: '#954121',
        shade: '#BA4E2D',
        light: '#FFDDD7',
    },
    Blue: {
        containerColor: '#2B3071',
        menuBarColor: '#2F4398',
        shade: '#4455A4',
        light: '#D7E0FF',
    },
    Black: {
        containerColor: '#0A0A0A',
        menuBarColor: '#21201F',
        shade: '#4C4C4B',
        light: '#999999',
    },
};

// Define a route to get the available themes
app.get('/api/themes', (req, res) => {
    res.json({ themes });
});

// Define a route to set/update a theme
app.post('/api/theme', (req, res) => {
    const { themeName, themeData } = req.body;
    themes[themeName] = themeData;
    res.sendStatus(200);
});

// Define a route to delete a theme
app.delete('/api/theme/:themeName', (req, res) => {
    const { themeName } = req.params;
    if (themes[themeName]) {
        delete themes[themeName];
        res.sendStatus(200);
    } else {
        res.status(404).json({ error: 'Theme not found' });
    }
});


// Start the server
const port = process.env.PORT || 8082;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});