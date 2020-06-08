require('dotenv').config();
const server = require('./api/server.js');
const port = process.env.PORT || 9000;
server.get('/', (req, res) => {
  res.send(` 🐣 API is up and running on port ${port}.`);
});
server.listen(port, console.log(`Server up and running on port ${port}.`));
