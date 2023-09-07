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
        column: { type: Number, required: true }, // Add column information
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


app.post('/api/template', async(req, res) => {
    try {
        const { templateName } = req.body;

        // Check if a template with the same name already exists
        const existingTemplate = await Template.findOne({ templateName });

        if (existingTemplate) {
            return res.status(400).json({ error: 'Template with the same name already exists' });
        }

        const newTemplate = new Template(req.body);
        await newTemplate.save();
        res.status(201).json({ message: 'Template saved successfully' });
    } catch (error) {
        console.error(error);
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


app.put('/api/template/:templateName', async(req, res) => {
    try {
        const templateName = req.params.templateName;
        await Template.findOneAndUpdate({ templateName }, req.body);
        res.json({ message: 'Template updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/template/:templateId', async(req, res) => {
    try {
        const templateId = req.params.templateId;
        const template = await Template.findById(templateId);

        if (!template) {
            return res.status(404).json({ error: 'Template not found' });
        }

        res.json(template);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// Start the server
const port = process.env.PORT || 8082;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});