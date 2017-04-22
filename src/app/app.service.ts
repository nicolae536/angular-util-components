import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { ISearchConfig } from '../lib';
import { IBackend } from '../lib';
import { SERVER_MAP } from './shared/server-map';

@Injectable()
export class BackendService implements IBackend {
    constructor(private http: Http) {
    }

    public getConfiguration<T>(url): Observable<T> {
        return this.http.get(url, this.getJsonHeaders())
            .map((r) => r.json());
    }

    public performSearch(configuration: ISearchConfig, searchQuery: string, customConfig?: any): Observable<any> {
        return this.http.get(SERVER_MAP.autocompleteData, this.getJsonHeaders())
            .map((r) => r.json())
            .map((response) => {
                // return response.filter(element => {
                //     return String(element.text).toLowerCase().indexOf(String(searchQuery).toLowerCase()) !== -1;
                // });
                return response;
            });
    }

    public getJsonHeaders(): Headers {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('accept', 'application/json');
        return headers;
    }
}
