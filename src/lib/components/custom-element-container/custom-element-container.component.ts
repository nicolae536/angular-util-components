import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { FormElement } from '../generic-form/generic-form-elemets.interfaces';

@Component({
    selector: 'ngt-custom-element-container',
    templateUrl: 'custom-element-container.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: CustomElementContainerComponent,
            multi: true
        },
    ],
})
export class CustomElementContainerComponent implements OnDestroy, ControlValueAccessor {
    @Input() public field: FormElement;
    @Input() public customComponentRef;
    @Output() public onSelect = new EventEmitter();

    public ngFormModelValue: any;
    public isDisabled: any;

    public containerEvents = {
        ngModelChange: new EventEmitter(),
        onTouched: new EventEmitter(),
        onSelect: new EventEmitter()
    };

    constructor() {
        this.containerEvents.ngModelChange.debounceTime(0).subscribe(this.emitOnChange.bind(this));
        this.containerEvents.onTouched.debounceTime(0).subscribe(this.emitOnTouched.bind(this));
        this.containerEvents.onSelect.debounceTime(0).subscribe(this.emitSelection.bind(this));
    }

    public emitSelection(newValue) {
        this.onSelect.emit(newValue);
    }

    public emitOnChange(newValue) {
        this._onChangeCallback(newValue);
    }

    public emitOnTouched(newValue) {
        this._onTouchedCallback(newValue);
    }

    public ngOnDestroy() {
        for (const prop in this.containerEvents) {
            if (!this.containerEvents.hasOwnProperty(prop)) {
                continue;
            }

            this.containerEvents[prop].unsubscribe();
            this.containerEvents[prop] = null;
        }

        this.containerEvents = null;
    }

    // ControlValueAccessor
    public writeValue(obj: any): void {
        // foreward form value to cutom component
        if (!obj) {
            return;
        }

        this.ngFormModelValue = obj;
    }

    public registerOnChange(fn: any): void {
        this._onChangeCallback = fn;
    }

    public registerOnTouched(fn: any): void {
        this._onTouchedCallback = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    private _onChangeCallback(_: any) {
        return;
    };

    private _onTouchedCallback(_: any) {
        return;
    };
}
