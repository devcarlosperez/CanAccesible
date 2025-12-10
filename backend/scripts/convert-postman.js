const p2o = require('postman-to-openapi');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

const inputPath = path.join(__dirname, '../../docs/CanAccesible APIs.json');
const outputPath = path.join(__dirname, '../../docs/swagger.json');

// Options for the conversion
const options = {
    defaultTag: 'General',
    servers: [
        {
            url: 'http://localhost:85/api',
            description: 'Development server'
        },
        {
            url: 'https://canaccesible.es/api',
            description: 'Production server'
        }
    ]
};

async function convert() {
    try {
        console.log(`Converting ${inputPath} to ${outputPath}...`);
        // Get YAML string first
        const result = await p2o(inputPath, null, options);
        // Convert YAML to JSON
        const json = JSON.stringify(yaml.load(result), null, 2);
        // Write JSON file
        fs.writeFileSync(outputPath, json);
        console.log('Conversion completed successfully!');
    } catch (err) {
        console.error('Error during conversion:', err);
    }
}

convert();
