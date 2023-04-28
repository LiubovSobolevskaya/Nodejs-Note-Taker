// Import the 'fs' module to work with the file system
const fs = require('fs');

// Define a function called 'readAndAppend' which takes two arguments, 'content' and 'file'
const readAndAppend = (content, file) => {

    // Read the contents of the file asynchronously using 'fs.readFile' method
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            // If an error occurs during reading the file, log the error to the console
            console.error(err);
        } else {
            let parsedData;
            // Try to parse the contents of the file as a JSON string and assign it to 'parsedData' variable
            try {
                parsedData = JSON.parse(data);
            }
            // Catch the error if the contents of the file is not a valid JSON string
            catch {
                // If the file was empty (not even a '[]'), assign an empty array to parsedData
                parsedData = [];
            }
            // Append the new content to the parsedData array
            parsedData.push(content);

            // Write the new data to the file using 'fs.writeFile' method 
            fs.writeFile(file, JSON.stringify(parsedData, null, 4), (err) =>
                err ? console.error(err) : console.info(`\nData written to ${file}`)
            );
        }
    });
};

// Export the 'readAndAppend' function so that it can be used in other files
module.exports = { readAndAppend };
