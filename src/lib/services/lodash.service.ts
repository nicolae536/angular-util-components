import { Injectable } from '@angular/core';
import { cloneDeep, isEqual, IsEqualCustomizer, isEqualWith } from 'lodash';

export const _ = {
    isEqual,
    isEqualWith,
    cloneDeep
};

@Injectable()
export class LodashService {
    public isEqual(value: any, other: any): boolean {
        return _.isEqual(value, other);
    }

    public isEqualWith(value: any, other: any, customizer: IsEqualCustomizer): boolean {
        return _.isEqualWith(value, other, customizer);
    }

    public cloneDeep<T>(value: T): T {
        return _.cloneDeep<T>(value);
    }
}
