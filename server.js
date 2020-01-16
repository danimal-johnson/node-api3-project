const express = require('express');
const postRouter = require('./posts/postRouter');
const userRouter = require('./users/userRouter');
const server = express();

// Invoke Middleware
server.use(express.json());
// server.use(express.cors());
server.use(logger);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

// External Routes
server.use('/api/posts', postRouter);
server.use('/api/users', userRouter);

// Create Middleware
function logger(req, res, next) {
  const { method, originalUrl } = req;
  const d = Date(Date.now());
  console.log(`${d.toString()}\t${method}\t${originalUrl}`);
  next();
}

module.exports = server;
