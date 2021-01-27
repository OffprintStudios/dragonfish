import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { AsyncStorageEngine } from '@ngxs-labs/async-storage-plugin';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class StorageService implements AsyncStorageEngine {
    constructor(private storageMap: StorageMap) {}

    length(): Observable<number> {
        return this.storageMap.size;
    }

    getItem(key: any): Observable<any> {
        return this.storageMap.get(key);
    }

    setItem(key: any, val: any): void {
        // Your logic here
        this.storageMap.set(key, val);
    }
    
    removeItem(key: any): void {
        // Your logic here
        this.storageMap.delete(key);
    }
    
    clear(): void {
        // Your logic here
        this.storageMap.clear();
    }
    
    key(val: number): Observable<string> {
        return this.storageMap.keys().pipe(filter((_key: string, index: number) => index === val));
    }
}