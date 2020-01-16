const server = require('./server.js');
const dotenv = require('dotenv');

const buf = Buffer.from('PORT');
const opt = { debug: true };
const config = dotenv.parse(buf, opt);
// expect a debug message because the buffer is not in KEY=VAL form

const port = process.env.PORT || 8080;

server.listen(port, () => {  
  console.log(`\n *** Server Running on http://localhost:${port} *** `);
});