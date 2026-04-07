```TS
/*
FOR DEBUG

Created file tsconfig.json

Updated package.json fields:
"@types/node" to "^18.0.0",
"@vercel/node": "^4.0.0"

Used commands :
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm install
npm install --save-dev typescript@latest
npx tsc
node build/run.js
*/

const run = require("./chess");
let req = {
    query: {
        'f1': '1',
        'f2': '2'
    }
}
let res = {
    json: function(text) { return text; }
};
console.log(run.default(req, res));
```
