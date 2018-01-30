const server = require('./server');

const handwritingKey = process.env.HANDWRITE_API_KEY;
const spellCheckKey = process.env.SPELLCHECK_API_KEY;

module.exports = {
  handwritingKey,
  spellCheckKey,
};

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is listening on localhost:${PORT}`));
