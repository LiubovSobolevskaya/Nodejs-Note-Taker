const express = require('express');
const path = require('path');
const fs = require('fs');
const {readAndAppend, readFromFile} = require('./utils');

const PORT = process.env.PORT || 3001;

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
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.post('/api/notes', (req, res) => {
    const { title, text} = req.body;
    console.log(req.body);
    // If all the required properties are present
    if (title && text){
        const newNote = {
            title,
            text
        };
        readAndAppend(newNote, './db/db.json');
        
        res.json('Data appended successfully');   
    }
    else{
        res.json('Error in posting a note');
    }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
