const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const {readAndAppend, readFromFile} = require('./utils');

const PORT = process.env.PORT || 3001;
const dbFileName = './db/db.json';
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/notes', (req, res) => {
   res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    readFromFile(dbFileName)
    .then((data) => {
        try {
            const parsedData = JSON.parse(data);
            res.json(parsedData);
        }
        catch{
           return res.json([]);
        }
    });

});

app.post('/api/notes', (req, res) => {
    const { title, text} = req.body;

    if (title && text){
        const newNote = {
            title,
            text,
            id: uuidv4(),
        };
        readAndAppend(newNote, dbFileName);

        res.json('Data appended successfully');   
    }
    else{
        res.json('Error in posting a note');
    }
});

app.delete('/api/notes/:id', (req, res) => {
    const nodeId = req.params.id;
    readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((response) => {
        const result = response.filter((note) => note.id !== nodeId);
        fs.writeFile('./db/db.json', JSON.stringify(result, null, 4), (err) =>
           err ? console.error(err) : console.info(`\nData written to ${dbFileName}}`)
        );
        res.json(`Item with id ${nodeId} has been removed`);
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

