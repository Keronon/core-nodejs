```TS
/*
FOR DEBUG

Update  file package.json
Created file tsconfig.json

Used commands :
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm install
npm run build
node build/run.js
*/

// base test code
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
