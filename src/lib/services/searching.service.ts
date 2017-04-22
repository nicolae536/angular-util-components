import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import '../rx-extensions';
import { ISearchConfig } from '../models/index';
import { SearchStates } from '../models/search-state';

@Injectable()
export class SearchingService {

    /**
     * @desc createSearchObservable - function which creates a BehaviorSubject<SearchState> which representes the SearchState
     * @param senderSubjectRef: Subject<any> a reference to a subject which emits search values
     * @param configuration: ISearchConfig a configuration for the search connection with the backed
     * @param backend: IBackend a backend connection implementation which will use the configuration to perform a search
     * @param customConfig: another configs which you might use in the performSearch implementation
     * @return BehaviorSubject<SearchState>
     */
    public createSearchObservable(senderSubjectRef: Observable<any>, configuration: ISearchConfig, backend: IBackend) {
        const responseSubject = new BehaviorSubject<SearchState>({
            isQueryLengthValid: false,
            state: SearchStates.INITIAL,
            responseObject: [],
            searchQuery: ''
        });
        this.getSearchMechanism(senderSubjectRef, responseSubject, configuration, backend);
        return responseSubject;
    }

    /**
     * @desc getSearchMechanism - function which creates a BehaviorSubject<SearchState> which representes the SearchState
     * @param subjectRef: Subject<any> a reference to a subject which emits search values
     * @param responseSubject: BehaviorSubject<SearchState> which will represent the search states
     * @param configuration: ISearchConfig a configuration for the search connection with the backed
     * @param backend: IBackend a backend connection implementation which will use the configuration to perform a search
     * @param customConfig: another configs which you might use in the performSearch implementation
     * @return subjectRef subscription
     */
    public getSearchMechanism(subjectRef: Observable<any>,
                              responseSubject: BehaviorSubject<SearchState>,
                              configuration: ISearchConfig,
                              backend: IBackend) {

        let searchQuery = '';
        return subjectRef.do((value) => {
            searchQuery = value;
            this.dispatchSearchState(configuration,
                responseSubject,
                SearchStates.TYPING,
                searchQuery);
        }).filter((value) => {
            if (this.isMinSearchQueryLengthValid(value, configuration)) {
                return true;
            } else {
                this.dispatchSearchState(configuration,
                    responseSubject,
                    value ? SearchStates.TYPING : SearchStates.INITIAL,
                    searchQuery);
                return false;
            }
        }).debounceTime(configuration.throttleTimer)
            .distinctUntilChanged((oldValue, newValue) => {
                if (oldValue === newValue) {
                    this.dispatchSearchState(configuration,
                        responseSubject,
                        SearchStates.SEARCH_DONE,
                        searchQuery);
                    return true;
                }
                return false;
            })
            .switchMap(() => {
                this.dispatchSearchState(configuration, responseSubject,
                    SearchStates.SEARCHING,
                    searchQuery);
                return backend.performSearch(configuration, searchQuery);
            }).catch(() => {
                this.dispatchSearchState(configuration,
                    responseSubject,
                    SearchStates.SEARCH_DONE,
                    searchQuery,
                    [],
                    false);
                return this.getSearchMechanism(subjectRef, responseSubject, configuration, backend);
            }).subscribe((searchResult: any[]) => {
                this.dispatchSearchState(configuration,
                    responseSubject,
                    SearchStates.SEARCH_DONE,
                    searchQuery,
                    searchResult,
                    false);
            }, (error) => {
                this.dispatchSearchState(configuration,
                    responseSubject,
                    SearchStates.SEARCH_DONE,
                    searchQuery,
                    [],
                    false);
            });
    }

    public isMinSearchQueryLengthValid(value: string, configuration: ISearchConfig) {
        const newValueString = String(value);
        return value && newValueString.length >= configuration.minSearchQueryLength;
    }

    /**
     * @desc dispatchSearchState - helper to dispatch a new state in the subjectRef from getSearchMechanism
     */
    private dispatchSearchState(config: ISearchConfig,
                                subjectRef: BehaviorSubject<SearchState>, // the subject reference
                                state: string, // the current state for search
                                searchQuery: string = '', // the last searchQuery
                                responseObject: any[] = [], // the current response object
                                useOldResponseValue: boolean = true) { // boolean added to make easyer to dispatch the same responseObject

        if (useOldResponseValue) {
            subjectRef.next({
                isQueryLengthValid: this.isMinSearchQueryLengthValid(searchQuery, config),
                state,
                responseObject: subjectRef.getValue().responseObject,
                searchQuery
            });
            return;
        }
        subjectRef.next({
            isQueryLengthValid: this.isMinSearchQueryLengthValid(searchQuery, config),
            state,
            responseObject,
            searchQuery
        });
    }
}

export interface IBackend {
    performSearch(configuration: ISearchConfig, searchQuery: string, customConfig?: any): Observable<any>;
}

export interface SearchState {
    state: string;
    searchQuery: any;
    responseObject: any;
    isQueryLengthValid: boolean;
}
