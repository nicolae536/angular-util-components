import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { LoggerService } from './logger.service';
import { StreamModel } from '../models/stream-model';
import { Dictionary } from '../models/generic-types';

/**
 * @desc This service is used to keep data for mutiple components and provides a standard way to updata the data and checking for changes
 */
@Injectable()
export class PageStreamsService {
    // A dictionary which contains a set of streams
    private pageStreams: Dictionary<BehaviorSubject<StreamModel>> = {};
    // A dictionary which contains a set of streams with the same name of the streams from pageStreams
    private pageErrorStreams: Dictionary<BehaviorSubject<any>> = {};
    // A separate stream which reflects if at least one stream has changes
    private changeStream: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private logger: LoggerService) {
    }

    /**
     * @desc returns a BehaviorSubject<boolean> which has the true value each time a stream has changes
     */
    public getChangesStream(): BehaviorSubject<boolean> {
        return this.changeStream;
    }

    /**
     * @param streamNames: Array<IStream>
     * @desc it receives a list of IStream which must contain at least the stream names,
     *       setInitialState, detectStreamChanges, getStreamData are functions which you want to use when a stream is initialized,
     *       when you get data from the stream and and when the stream is chacked for changes
     */
    public registerStreams(streamNames: IStream[]) {
        for (let stream of streamNames) {
            this.registerStream(
                stream.name,
                stream.setInitialValue,
                stream.detectStreamChanges,
                stream.getStreamData,
                stream.resetStreamData
            );
        }
    }

    /**
     * @param name: string the name of the stream
     * @param setInitialState?: (context: StreamModel, data) => void
     *                          - a function which will replace the setInitialState from the stream model implementatio
     *                            it will be used inside the stream model implementation to set the data variable,
     *                            and also the initial values
     * @param detectStreamChanges?: (context: StreamModel, data) => void
     *                              - a function which will replace the detectStreamChanges from the stream model implementatio
     *                                it will be used inside the stream model implementation to set the changes variable
     * @param getStreamData?: (context: StreamModel, data) => void
     *                        - a function which will replace the setInitialState from the stream model implementatio
     *                          it will be used when you subscribe to this stream, to provide data on the subscription
     * @param resetStreamData?: (context: StreamModel, data) => void
     *                          - a function which will replace the setInitialState from the stream model implementatio
     *                            it will be used when you call resetData on the stream
     * @desc this function will create two streams one which contains a streamModel and one which will be used for errors
     */
    public registerStream(name: string,
                          setInitialValue?: (context: StreamModel, data) => void,
                          detectStreamChanges?: (context: StreamModel) => void,
                          getStreamData?: (context: StreamModel) => any,
                          resetStreamData?: (context: StreamModel) => any) {
        if (this.pageStreams[name]) {
            this.logger.logWarning(`Stream with name: ${name} already exists.`);
            return;
        }

        this.pageStreams[name] = new BehaviorSubject<StreamModel>(
            new StreamModel(name, null, setInitialValue, detectStreamChanges, getStreamData, resetStreamData)
        );

        if (this.pageErrorStreams[name]) {
            return;
        }
        this.pageErrorStreams[name] = new BehaviorSubject<any>(null);
    }

    /**
     * @param name: stream name
     * @desc This function will reset the stream to his initial value
     * @return resetedData the reseted data of the stream
     */
    public resetStream(name): any {
        if (!this.pageStreams[name]) {
            this.logger.logWarning(`Stream with name: ${name} does not exist, or it's not initialized.`);
            return null;
        }

        let currentStremValue = this.pageStreams[name].getValue();
        let resetedData = currentStremValue.resetStreamData();
        this.pageStreams[name].next(currentStremValue);
        this.checkStreamsForChanges();
        return resetedData;
    }

    /**
     * @desc This function will reset all streams to initial values
     * @return void
     */
    public resetStreams(): any {
        for (let prop in this.pageStreams) {
            if (!this.pageStreams.hasOwnProperty(prop)) {
                continue;
            }

            this.resetStream(prop);
        }
    }

    /**
     * @param name: stream name
     * @param data: the data for the stream
     * @desc This function will set the data for the stream and the initialValue
     *       it will also check all streams for changes
     */
    public initializeStream(name: string, data: any) {
        if (!this.pageStreams[name]) {
            this.logger.logWarning(`Stream with name: ${name} does not exist, or it's not initialized.`);
            return null;
        }

        let currentStremValue = this.pageStreams[name].getValue();
        currentStremValue.setInitialValue(data);
        this.pageStreams[name].next(currentStremValue);
        this.checkStreamsForChanges();
    }

    /**
     * @param name: stream name
     * @return will return an object which contains two streams
     *              stream will emit only the stream.getStreamData()
     *              streamErrors will emit the server errors
     */
    public getStream(name: string): IStreamsModel {
        if (!this.pageStreams[name]) {
            this.logger.logWarning(`Stream with name: ${name} does not exist, or it's not initialized.`);
            return null;
        }

        return {
            stream: this.pageStreams[name].map((stream) => stream.getStreamData()),
            streamErrors: this.pageErrorStreams[name]
        };
    }

    /**
     * @param name: stream name
     * @return will return a StreamModel
     */
    public getStreamModel(name: string): StreamModel {
        if (!this.pageStreams[name]) {
            this.logger.logWarning(`Stream with name: ${name} does not exist, or it's not initialized.`);
            return null;
        }

        return this.pageStreams[name].getValue();
    }

    /**
     * @param name: stream name
     * @return will return a StreamModel
     */
    public getStreamModelData(name: string): any {
        if (!this.pageStreams[name]) {
            this.logger.logWarning(`Stream with name: ${name} does not exist, or it's not initialized.`);
            return null;
        }

        let value = this.pageStreams[name].getValue();
        if (!value) {
            return null;
        }

        return value.getStreamData();
    }

    /**
     * @param name: stream name
     * @desc will emit an error on the stream
     */
    public setErrorsOnStream(name: string, errors: Object) {
        this.pageErrorStreams[name].next(errors);
    }

    /**
     * @param name: stream name
     * @param data: the data for the current stream
     * @desc this will use streamModel setData to update the current stream value
     *       this function will check all stream for changes
     */
    public updateStream(name: string, data: any) {
        if (!this.pageStreams[name]) {
            this.logger.logWarning(`Stream with name: ${name} does not exist, or it's not initialized.`);
            return null;
        }

        let currentStremValue = this.pageStreams[name].getValue();
        currentStremValue.setStreamData(data);
        this.pageStreams[name].next(currentStremValue);
        this.checkStreamsForChanges();
    }

    /**
     * @param name: stream name
     * @param data: the data for the current stream
     * @desc this will use streamModel inheritDataFrom this will inherit propertyes and values which are provided on your data
     *       this function will check all stream for changes
     */
    public updateStreamUsingDataInheritance(name: string, data: any) {
        if (!this.pageStreams[name]) {
            this.logger.logWarning(`Stream with name: ${name} does not exist, or it's not initialized.`);
            return null;
        }

        let currentStremValue = this.pageStreams[name].getValue();
        currentStremValue.inheritDataFrom(data);
        this.pageStreams[name].next(currentStremValue);
        this.checkStreamsForChanges();
    }

    /**
     * @param name: stream name
     * @desc for the provided streamName callse unsubscribe from rxjs
     */
    public destroyStream(name: string) {
        if (this.pageStreams[name]) {
            this.pageStreams[name].unsubscribe();
            delete this.pageStreams[name];
        }

        if (this.pageErrorStreams[name]) {
            this.pageErrorStreams[name].unsubscribe();
            delete this.pageErrorStreams[name];
        }
    }

    /**
     * @desc destroys all streams from the service
     */
    public destroyStreams() {
        for (let streamName in this.pageStreams) {
            if (!this.pageStreams.hasOwnProperty(streamName)) {
                continue;
            }

            this.destroyStream(streamName);
        }
    }

    /**
     * @param name: stream name
     * @param valid: boolean the valid state
     * @desc this will use streamModel setValidState which will set is valid property from stream model
     *       this function will check all stream for changes
     */
    public setStreamValidState(name: string, valid: boolean) {
        if (!this.pageStreams[name]) {
            this.logger.logWarning(`Stream with name: ${name} does not exist, or it's not initialized.`);
            return null;
        }

        let currentStremValue = this.pageStreams[name].getValue();
        currentStremValue.setValidState(valid);
        this.pageStreams[name].next(currentStremValue);
        this.checkStreamsForChanges();
    }

    /**
     * @desc returns the evaluated valid state
     */
    public getValidState() {
        for (let name in this.pageStreams) {
            if (!this.pageStreams[name] || !this.pageStreams[name].getValue()) {
                continue;
            }

            if (!this.pageStreams[name].getValue().getValidState()) {
                return false;
            }
        }

        return true;
    }

    /**
     * @desc assumes that in streams are no changes, stops at first change and emits the current change value
     */
    private checkStreamsForChanges() {
        let changes = false;

        for (let name in this.pageStreams) {
            if (!this.pageStreams[name] || !this.pageStreams[name].getValue()) {
                continue;
            }

            if (this.pageStreams[name].getValue().getChangesState()) {
                changes = true;
                break;
            }
        }
        this.changeStream.next(changes);
    }
}

export interface IStreamsModel {
    stream: Observable<any>;
    streamErrors: BehaviorSubject<any>;
}

export interface IStream {
    name: string;
    setInitialValue?: (context: StreamModel, data) => void;
    detectStreamChanges?: (context: StreamModel) => void;
    getStreamData?: (context: StreamModel) => any;
    resetStreamData?: (context: StreamModel) => any;
}
