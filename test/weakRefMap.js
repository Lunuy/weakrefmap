const { WeakRefMap } = require('../dist/');
const { sleep } = require('./util');

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