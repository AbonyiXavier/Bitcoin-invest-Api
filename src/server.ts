const { config } = require('dotenv');
import * as http from 'http';
import  app from './app';

config();

const PORT = process.env.NODE_ENV === 'test' ? 6378 : process.env.PORT || 200;

const server = http.createServer(app);

server.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`));
