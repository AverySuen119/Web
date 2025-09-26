var readline = require('readline');

var ask = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

ask.question(">>What's the year?  ", answer => {
  console.log(`Its `+answer);
  ask.close();
});