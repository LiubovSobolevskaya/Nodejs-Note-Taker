// Importing required modules
const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { readAndAppend } = require('./utils');

// Setting up the port number and database file name
const PORT = process.env.PORT || 3001;
const dbFileName = './db/db.json';
// Creating an instance of express application
const app = express();
// Setting up middleware to parse request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Setting up middleware to serve static files
app.use(express.static('public'));
// Setting up routes for homepage and notes page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});
// Setting up API route to fetch all notes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    // Reading the contents of the db file
    fs.readFile(dbFileName, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        }
        else {
            // try-catch block to catch if dbFileName is empty and does not contain "[]"
            try {
                const parsedData = JSON.parse(data);
                return res.json(parsedData);
            }
            catch {
                // return an epmty array json
                return res.json([]);
            }
        }
    });
});
// Setting up API route to add a new note
app.post('/api/notes', (req, res) => {
    // Extracting the title and text fields from the request body
    const { title, text } = req.body;

    if (title && text) {
        // Creating a new note object with a unique id using uuid module
        const newNote = {
            title,
            text,
            id: uuidv4(),
        };
        // Appending the new note to the db file using the custom readAndAppend function
        readAndAppend(newNote, dbFileName);

        res.json('Data appended successfully');
    }
    else {
        res.json('Error in posting a note');
    }
});
// Setting up API route to delete a note by id
app.delete('/api/notes/:id', (req, res) => {
    // Extracting the id of the note to be deleted from the request parameters
    const nodeId = req.params.id;
    // Reading the contents of the db file
    fs.readFile(dbFileName, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        }
        else {
            // Parsing the data as JSON
            const parsedData = JSON.parse(data);
            // Filtering out the note with the given id
            const result = parsedData.filter((note) => note.id !== nodeId);
            // Writing the filtered notes to the db file
            fs.writeFile(dbFileName, JSON.stringify(result, null, 4), (err) =>
                err ? console.error(err) : console.info(`\nData written to ${dbFileName}`)
            );
            return res.json(`Item with id: ${nodeId} has been removed`);
        }
    });
});
// Setting up a catch-all route for any other requests and redirecting to homepage
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});
// Starting the server on the specified port
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});

