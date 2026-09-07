import fs from 'fs';

const text = fs.readFileSync('hiscox.txt', 'utf8');
const lines = text.split('\n');
const regex2 = /^\s*(\d+[a-zA-Z\s]*)\.\s+(.*)/;

let matches = [];
for (let line of lines) {
  const m = line.match(regex2);
  if (m) {
    const num = parseInt(m[1].replace(/\s+/g, ''), 10);
    if (!isNaN(num)) {
      matches.push(num);
    }
  }
}

console.log(matches.sort((a,b)=>a-b).slice(-20));
