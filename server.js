const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { readAndAppend } = require('./utils');

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
    fs.readFile(dbFileName, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } 
        else {
          try {
            const parsedData = JSON.parse(data);  
            return res.json(parsedData);
          }
          catch{
            return res.json([]);
          }
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
    fs.readFile(dbFileName, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
            const parsedData = JSON.parse(data);  
            const result = parsedData.filter((note) => note.id !== nodeId);
            fs.writeFile(dbFileName, JSON.stringify(result, null, 4), (err) =>
               err ? console.error(err) : console.info(`\nData written to ${dbFileName}`)
            );
            return res.json(`Item with id: ${nodeId} has been removed`); 
        }
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

