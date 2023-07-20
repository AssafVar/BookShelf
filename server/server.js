import 'dotenv';
import http from 'http';
import app from './index.js';

const server = http.createServer(app); 
server.listen(process.env.PORT);
