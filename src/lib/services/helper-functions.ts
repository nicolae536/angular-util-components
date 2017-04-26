import { FormControl, FormGroup } from '@angular/forms';
export const convertToArray = <T>(value: T): T[] => {
    if (Array.isArray(value)) {
        return value as T[];
    }

    return [value];
};

export const getFormControl = (rootNgFormGroup: FormGroup, parentGroup: string, controlName?: string): FormGroup | FormControl => {
    if (!parentGroup) {
        throw new Error(`Missing form group ${parentGroup}`);
    }

    if (!rootNgFormGroup[parentGroup]) {
        throw new Error(`Invalid form group ${parentGroup}`);
    }

    if (controlName) {
        if (!rootNgFormGroup[parentGroup][controlName]) {
            throw new Error(`Invalid form element with name ${controlName} inside group ${parentGroup}`);
        }

        return rootNgFormGroup[parentGroup][controlName];
    }

    return rootNgFormGroup[parentGroup];
};

