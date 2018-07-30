export interface IStorage {
    get(key: string): Promise<any>;
    set(key: string, value: any, ttl?: number): Promise<string>;
    count(): Promise<number>;
}
