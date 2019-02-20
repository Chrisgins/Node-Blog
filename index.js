// create server and import from api/server.js

const server =require('./api/server.js');
const port =5000;

server.listen(port, () => console.log('Server listening on 5000'));
