const port = 3000;

import http from 'http';
import { connectToDatabase } from './js/database.js';

const server = http.createServer((request, response) => {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    response.end('Hallo wereld\n');
});

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/`);
    connectToDatabase()
});