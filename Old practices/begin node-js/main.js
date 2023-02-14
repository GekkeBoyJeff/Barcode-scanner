const port = 3000;

import http from 'http';
import { connectToDatabase } from './js/database.js';
import { testFetch } from './js/fetch.js';
import * as fs from 'fs';

const testJson = './assets/json/product.json'

const server = http.createServer((request, response) => {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    response.end('Hallo wereld\n');
});

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/`);
    connectToDatabase()
    if (!fs.existsSync(testJson)) {
        testFetch()
    } else {
        fetch = JSON.parse(fs.readFileSync(testJson, 'utf8'));
        console.log(fetch)
        console.log('heey')
    }
});
