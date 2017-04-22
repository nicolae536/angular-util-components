#Generic form component configuration
This configuration is passed to the form component using `[formDefinition]="config"` input

##Configuration example
[Here is a configuration which I use for testing](https://github.com/nicolae536/ng2Tools/blob/master/src/mocks/generic-form-simple-exemple.json)

###For the begining the top level object is `FormDefinition`.
```javascript
{
    name: string // the name of the form which is mandatory
    theme: string // not mandatory
    rows: Array<FormRow> // mandatory all the elements of the form will be stored here on rows
}
```

###Row of the form which is an Array of form elements. `FormRow` definition
```javascript
{
    elements: Array<FormElement> // all the elements inside one line
    class?: string // if you want to add a specific class to the form element
}
```

###`FormElement` the actul definition of an element
```javascript
{
    type: string;
    name: string;
    placeholder: string;
    class: string;
    iconType: string; // prefix, suffinx, in-placeholder
    icon?: string;    
    hint: IHint;
    value?: string;
    disabled?: boolean;
    width: number;
    validation?: IValidator[]; // a set of validators are bulilt
    radioButtons?: IRadioButton[]; // radio buttons have a special implementations
    buttonType?: string; // only for submit/reset types it can have two values md-icon-button or md-raised-button
    position?: string; // when only one element is on the row we can position it on center/left/right
    runtimelinks?: RuntimeLinkRelation[];   // for select, autocomplete a link is interpreted when select event is triggered
                                            // for select, autocomplete a link is interpreted when select event is triggered
    staticLinks: StaticLinkRelation[]; // bindings between form fields which trigger changes on different fields when a certain value changes

    config?: any; custom config for components like autocomplete
    valueField?: string; // which field from the options should represent the value
    dataSource?: Array<any>; // the options for select
    displayFields: Array<string>; // which propertyes from the select options should be displayed
}
```

###`IValidator` the validator configuration 
```javascript
{
    validator: string; // if is a validator that we already have
    regex: string; // if you want to use your own regex validation but the validator value should be pattern
    errorToken?: string; // When the form will be ready it will use this token to get a translated message for errors
}
```
###This is the list possible values for validator property
1. required
2. minLength=value
3. maxLength=value
4. pattern // and you will need to pass a regex
5. email
6. text
7. number
8. password
9. minValue=value
10. manValue=value
11. integer
12. maxDecimalLength=value

###`IRadioButton` the radio buttons configuration 
```javascript
{
    checked: boolean;
    placeholder: string;
    class: string;
}
```
###`IHint` configuration for input hints
```javascript
{
    align: string; // start, end
    value: string;
}
```

###`LinkRelation` the configuration for a link relation
```javascript
{
    type: string; // this should be a {LinkType} this is used only for subscription links
    control: string;
    validation?: IValidator[];
    fieldName?: string; // the field from the Object which should be set as value in the linked field
                        // right now this is used only for select/autocomplete
    disabled?: Array<string>; // an array with the specific option values which should disabled this field
}
```
###This are the possible types for links
1. RESET
2. COPY_VALUE
3. DATA_INHERITANCE
4. CHANGE_VALIDATION
5. CUSTOM_RELATION