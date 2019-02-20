// import modules

const express =require('express');
const helmet =require('helmet');
//const morgan =require('morgan');
const cors =require('cors');

//build out server by assigning express to a variable

const server =express();

//create import for routers

const usersRouter =require('../users/usersRouter.js');
const postsRouter =require('../posts/postsRouter.js');

// Tell the server to use your middleware

server.use(express.json()); //tells server how to parse json
server.use(helmet()); // Security - protect your app from some well-known web vulnerabilities by setting HTTP headers 
//server.use(morgan()); // auto-generates logs on all HTTP requests
server.use(cors()); // Cross-Origin Resource Sharing - allows cross domain communication from the browser

// routes!

server.use('/users', usersRouter);
server.use('/posts', postsRouter);

// sanity check

server.get('/' , (req, res) => {
    res.send('Which one of you fellers is Dirty Dan?!')
});

// don't forget to export modules!

module.exports = server;