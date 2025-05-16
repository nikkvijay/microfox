import fs from 'fs';
import path from 'path';

// Read openapi.json file at runtime instead of importing it
const getOpenApiSchema = () => {
    try {
        // Try multiple paths to find the file
        const possiblePaths = [
            path.join(__dirname, 'openapi.json'),  // When running in compiled mode
            path.join(__dirname, '..', 'src', 'openapi.json'), // When running locally
            '/var/task/src/openapi.json' // Alternate Lambda path
        ];

        for (const filePath of possiblePaths) {
            if (fs.existsSync(filePath)) {
                return JSON.parse(fs.readFileSync(filePath, 'utf8'));
            }
        }
        // Fallback to empty object
        return {};
    } catch (error) {
        console.error('Error loading openapi.json:', error);
        return {};
    }
};