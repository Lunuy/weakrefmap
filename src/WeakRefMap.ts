
import WeakRef from './WeakRef';
import FinalizationRegistry from './FinalizationRegistry';

class WeakRefMap<K, V extends object> {
    private map = new Map<K, WeakRef<V>>();
    private finalizationRegistry = new FinalizationRegistry<V, K, WeakRef<V>>(this.cleanup.bind(this));
    constructor(iterable: Iterable<[K, V]>);
    constructor(entries?: readonly [K, V][]);
    constructor(iterable: Iterable<[K, V]> | readonly [K, V][] = []) {
        for(const [key, value] of iterable)
        this.set(key, value);
    }
    private cleanup(key: K) {
        this.map.delete(key);
    }
    get size() {
        return this.map.size;
    }
    clear() {
        for(const key of this.keys())
            this.delete(key);
    }
    delete(key: K) {
        const ref = this.map.get(key);
        if(!ref) return false;
        this.map.delete(key);
        this.finalizationRegistry.unregister(ref);
        return true;
    }
    *entries(): IterableIterator<[K, V]> {
        for(const key of this.map.keys())
            yield [key, this.map.get(key).deref()];
    }
    forEach(callbackFn: (value: V, key: K, map: this) => void, thisArg?: any) {
        for(const [key, value] of this.entries())
            callbackFn.call(thisArg, value, key, this);
    }
    get(key: K) {
        const ref = this.map.get(key);
        if(!ref) return;
        return ref.deref();
    }
    has(key: K) {
        return this.map.has(key);
    }
    keys() {
        return this.map.keys();
    }
    set(key: K, value: V) {
        if(this.has(key))
            this.delete(key);
        const ref = new WeakRef(value);
        this.map.set(key, ref);
        this.finalizationRegistry.register(value, key, ref);
        return this;
    }
    *values(): IterableIterator<V> {
        for(const ref of this.map.values())
            yield ref.deref();
    }
};

interface WeakRefMap<K, V extends object> {
    [Symbol.iterator](): IterableIterator<[K, V]>
}

WeakRefMap.prototype[Symbol.iterator]
    = WeakRefMap.prototype.entries;

export default WeakRefMap;