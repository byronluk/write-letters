const server = require('./server');
var handwritingKey = process.env.HANDWRITE_API_KEY;
var spellCheckKey = process.env.SPELLCHECK_API_KEY;
console.log(handwritingKey);
console.log(spellCheckKey);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server is listening on localhost:${PORT}`));
