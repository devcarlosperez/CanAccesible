const p2o = require('postman-to-openapi');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, '../../docs/CanAccesible APIs.json');
const outputPath = path.join(__dirname, '../../docs/swagger.json');

// Options for the conversion
const options = {
    defaultTag: 'General'
};

async function convert() {
    try {
        console.log(`Converting ${inputPath} to ${outputPath}...`);
        const result = await p2o(inputPath, outputPath, options);
        console.log('Conversion completed successfully!');
    } catch (err) {
        console.error('Error during conversion:', err);
    }
}

convert();
