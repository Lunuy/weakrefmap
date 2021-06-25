# weakrefmap
WeakRefMap using WeakRef

# Example
```js
const { WeakRefMap } = require('weakrefmap');

function sleep(ms) {
    return new Promise(solve => setTimeout(solve, ms));
}

const weakRefMap = new WeakRefMap();

setInterval(() => {
    console.log(Array.from(weakRefMap.entries()), weakRefMap.size);
}, 1000);

let a = {a:'a'};
let b = {b:'b'};

(async () => {
    weakRefMap.set(1, a);
    weakRefMap.set(2, b);
    
    await sleep(1000);
    weakRefMap.delete(1);
    await sleep(1000);
    b = undefined;
})();
```