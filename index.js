const server = require('./server.js');
const port = 8080;

server.listen(port, () => {  
  console.log(`\n *** Server Running on http://localhost:${port} *** `);
});