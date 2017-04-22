import { cloneDeep, isEqual } from 'lodash';

let _ = {
    isEqual,
    cloneDeep
};
/**
 * @desc Each stream has a name, and a data
 */
export class StreamModel {
    public name: string;
    private data: any;
    private initialValues: string;
    private changes: boolean = false;
    private valid: boolean = true;

    private customFunctions: Object;

    /**
     * @desc when a new StreamModel is created we can provide implementations for
     *       setInitialState?: (context: StreamModel, data) => void
     *       detectStreamChanges?: (context: StreamModel) => void
     *       getStreamData?: (context: StreamModel) => any
     *       resetStreamData?: (context: StreamModel) => any
     */
    constructor(name: string, data = null,
                setInitialValue?: (context: StreamModel, data) => void,
                detectStreamChanges?: (context: StreamModel) => void,
                getStreamData?: (context: StreamModel) => any,
                resetStreamData?: (context: StreamModel) => any) {
        this.name = name;
        this.customFunctions = {};

        if (setInitialValue) {
            this.customFunctions['setInitialState'] = setInitialValue;
        }

        if (detectStreamChanges) {
            this.customFunctions['detectStreamChanges'] = detectStreamChanges;
        }

        if (getStreamData) {
            this.customFunctions['getStreamData'] = getStreamData;
        }

        if (data) {
            this.setInitialValue(data);
        }
    }

    public getInitialValue() {
        return this.initialValues;
    }

    /**
     * @param data
     * @desc it sets the initial state of the streamModel and sets the valid state to true and the changes to false
     */
    public setInitialValue(data) {
        if (this.customFunctions['setInitialState']) {
            this.customFunctions['setInitialState'](this, data);
            return;
        }

        this.changes = false;
        this.valid = true;
        this.data = _.cloneDeep(data);
        this.initialValues = _.cloneDeep(data);
    }

    /**
     * @desc sets the stream data from initial value and calls detectStreamChanges
     */
    public resetStreamData() {
        if (this.customFunctions['resetStreamData']) {
            this.customFunctions['resetStreamData'](this);
        }

        this.data = _.cloneDeep(this.initialValues);
        this.detectStreamChanges();
        return this.data;
    }

    /**
     * @param data an object
     * @desc inherits from data the propertyes and property values and calls detectStreamChanges
     */
    public inheritDataFrom(data: Object) {
        if (typeof data !== 'object') {
            console.log(`Cannot inherit data from: k`);
            console.log(data);
        }

        let sortedkeys = Object.keys(data).sort();

        for (let key of sortedkeys) {
            if (!key) {
                continue;
            }
            this.data[key] = _.cloneDeep(data[key]);
        }
        this.detectStreamChanges();
    }

    /**
     * @param data
     * @desc clones the data into the internal data object and calls detectStreamChanges
     */
    public setStreamData(data) {
        this.data = _.cloneDeep(data);
        this.detectStreamChanges();
    }

    /**
     * @returns the stream data or getStreamData provided in the constructor
     */
    public getStreamData() {
        if (this.customFunctions['getStreamData']) {
            return this.customFunctions['getStreamData'](this);
        }
        return this.data;
    }

    /**
     * @desc checks if the streams has the same value with the initial value or uses detectStreamChanges function to set the changes value
     */
    public detectStreamChanges() {
        if (this.customFunctions['detectStreamChanges']) {
            this.changes = this.customFunctions['detectStreamChanges'](this);
            return;
        }

        this.logInternalValues();
        this.changes = !_.isEqual(this.initialValues, this.data);
    }

    /**
     * @desc it sets the valid state of the streamModel
     */
    public setValidState(valid: boolean) {
        this.valid = valid;
    }

    public getValidState(): boolean {
        return this.valid;
    }

    public getChangesState(): boolean {
        return this.changes;
    }

    private logInternalValues() {
        if (this.initialValues && this.data) {
            // console.log('initial-keys-count', Object.keys(this.initialValues).length);
            // console.log('initial-values', this.initialValues);
            // console.log('new-data-keys-count', Object.keys(this.data).length);
            // console.log('new-data', this.data);
        }
    }
}
