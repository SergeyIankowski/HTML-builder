const path = require('path');
const fs = require('fs');

const input = fs.createReadStream(path.resolve(__dirname, 'text.txt'), 'utf-8');
let text = '';
input.on('data', chunk => text += chunk);
input.on('end', data => console.log(text));
input.on('error', err => console.error(err.message));
