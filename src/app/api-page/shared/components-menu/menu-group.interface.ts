import { IMenuItem } from './menu-item';
export interface IMenuGroup {
    group: string;
    groupId: string;
    optionsList: Array<IMenuItem>;
}