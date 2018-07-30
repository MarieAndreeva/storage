"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
class Storage {
    constructor(config) {
        this.get = (key) => {
            return new Promise((resolve, reject) => {
                this._client.get(key, (err, value) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(value);
                });
            });
        };
        this.set = (key, value, ttl) => {
            return new Promise((resolve, reject) => {
                this._client.set(key, value, (err, smth) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(smth);
                });
            });
        };
        this.count = () => {
            return new Promise((resolve, reject) => {
                this._client.keys('*', (err, keys) => {
                    if (err) {
                        reject(err);
                    }
                    const length = keys.length;
                    resolve(length);
                });
            });
        };
        this._client = redis_1.createClient({ port: config.port, host: config.host });
        this._client.on('error', (err) => {
            console.log(`Error: ${err}`);
        });
        this._client.on('connect', () => {
            console.log(`Db initialized on port: ${config.port}, host: ${config.host}`);
        });
    }
}
exports.Storage = Storage;
/*
const cache = new Storage({ port: 6968, host: 'localhost' });

cache.count()
  .then(len => { console.log(len); })
  .catch(err => { console.log(err) });

cache.get('emptyKey')
  .then(value => console.log(value))
  .catch(error => console.log(error));

cache.set('myFirstKey', 'myFirstValue')
  .then(() => {
      return cache.get('myFirstKey');
  })
  .then(value => console.log(value))
  .catch(error => console.log(error));
*/
class StorageNative {
    constructor() {
        this.get = (key) => {
            return Promise.resolve((resolve) => {
                setTimeout(() => {
                    resolve(this._data[key]);
                }, 0);
            });
        };
        this.set = (key, value, ttl) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    this._data[key] = value;
                    resolve('OK');
                    if (ttl) {
                        setTimeout(() => {
                            delete this._data[key];
                        }, ttl);
                    }
                }, 0);
            });
        };
        this.count = () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const length = Object.keys(this._data).length;
                    resolve(length);
                }, 0);
            });
        };
        this._data = Object.create(null);
    }
}
exports.StorageNative = StorageNative;
const nativeCache = new StorageNative();
nativeCache.set('firstKey', 'firstValue');
nativeCache.set('secondKey', 'secondValue', 5);
nativeCache.set('thridKey', 'thirdValue');
nativeCache.count()
    .then((length) => console.log(length))
    .catch((err) => console.log(err));
setTimeout(() => {
    nativeCache.count()
        .then((length) => console.log(length))
        .catch((err) => console.log(err));
}, 20);
setTimeout(() => {
    console.log(nativeCache);
}, 50);
