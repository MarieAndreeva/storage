import { createClient, RedisClient } from 'redis';
import { IStorage } from './interfaces/storage.interface';
import { IOptions } from './interfaces/config.interface';
import { rejects } from 'assert';
import { resolve } from 'dns';

export class Storage implements IStorage {
    private _client: RedisClient;

    constructor(config: IOptions) {
        this._client = createClient({ port: config.port, host: config.host });
        this._client.on('error', (err) => {
            console.log(`Error: ${err}`);
        });
        this._client.on('connect', () => {
            console.log(`Db initialized on port: ${config.port}, host: ${config.host}`);
        });
    }

    public get = (key: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            this._client.get(key, (err, value) => {
                if (err) {
                    reject(err);
                }

                resolve(value);
            });
        });
    };

    public set = (key: string, value: any, ttl?: number): Promise<void> => {
        return new Promise((resolve, reject) => {
            this._client.set(key, value, (err, smth) => {
                if (err) {
                    reject(err);
                }
            });
        });
    };

    public count = (): Promise<number> => {
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
}

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

export class StorageNative implements IStorage {
    private _data: Object;

    constructor() {
        this._data = Object.create(null);
    }

    public get = (key: string): Promise<any> => {
       return new Promise((resolve, reject) => {
           setTimeout(() => {
            resolve(this._data[key])
           }, 0);
       }); 
    };

    public set = (key: string, value: any, ttl?: number): Promise<void> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this._data[key] = value;
                if (ttl) {
                    setTimeout(() => {
                        delete this._data[key];
                    }, ttl);
                }
            }, 0);
        });
    };

    public count = (): Promise<number> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const length = Object.keys(this._data).length;
                resolve(length);
            }, 0);
        });
    };
}

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